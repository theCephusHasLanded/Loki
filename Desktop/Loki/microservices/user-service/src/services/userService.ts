import { ServerUnaryCall, sendUnaryData, UntypedHandleCall } from '@grpc/grpc-js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../config/database';
import { redis } from '../config/redis';
import { kafkaProducer } from '../kafka/producer';
import { logger } from '../utils/logger';
import {
  CreateUserRequest,
  CreateUserResponse,
  GetUserRequest,
  GetUserResponse,
  UpdateUserRequest,
  UpdateUserResponse,
  ValidateTokenRequest,
  ValidateTokenResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  UpdateBalanceRequest,
  UpdateBalanceResponse,
  GetUsersByIdsRequest,
  GetUsersByIdsResponse,
  User
} from '../types/grpc';

export class UserServiceImpl {
  private readonly JWT_SECRET = process.env.JWT_SECRET || 'user-service-secret';
  private readonly JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'user-refresh-secret';

  async CreateUser(
    call: ServerUnaryCall<CreateUserRequest, CreateUserResponse>,
    callback: sendUnaryData<CreateUserResponse>
  ) {
    try {
      const { email, username, password, ip_address, user_agent } = call.request;

      // Check if user already exists
      const existingUser = await db('users')
        .where({ email })
        .orWhere({ username })
        .first();

      if (existingUser) {
        return callback(null, {
          success: false,
          message: existingUser.email === email ? 'Email already registered' : 'Username already taken',
          user: undefined,
          access_token: '',
          refresh_token: ''
        });
      }

      // Hash password and create user
      const passwordHash = await bcrypt.hash(password, 12);
      const userId = uuidv4();

      await db('users').insert({
        id: userId,
        email,
        username,
        password_hash: passwordHash,
        wallet_balance: 1000.00, // Starting balance
        kyc_status: 'pending',
        is_active: true
      });

      // Generate tokens
      const accessToken = jwt.sign(
        { userId, username, email },
        this.JWT_SECRET,
        { expiresIn: '15m' }
      );

      const refreshToken = jwt.sign(
        { userId },
        this.JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
      );

      // Store refresh token in Redis
      await redis.setex(`refresh_token:${userId}`, 7 * 24 * 60 * 60, refreshToken);

      // Publish user created event
      await kafkaProducer.send({
        topic: 'user.events',
        messages: [{
          key: userId,
          value: JSON.stringify({
            event_type: 'user_created',
            user_id: userId,
            email,
            username,
            timestamp: new Date().toISOString(),
            ip_address,
            user_agent
          })
        }]
      });

      const user: User = {
        id: userId,
        email,
        username,
        wallet_balance: 1000.00,
        kyc_status: 'pending',
        created_at: new Date().toISOString(),
        is_active: true
      };

      callback(null, {
        success: true,
        message: 'User created successfully',
        user,
        access_token: accessToken,
        refresh_token: refreshToken
      });

    } catch (error) {
      logger.error('CreateUser error:', error);
      callback(null, {
        success: false,
        message: 'Failed to create user',
        user: undefined,
        access_token: '',
        refresh_token: ''
      });
    }
  }

  async GetUser(
    call: ServerUnaryCall<GetUserRequest, GetUserResponse>,
    callback: sendUnaryData<GetUserResponse>
  ) {
    try {
      const { user_id } = call.request;

      // Check cache first
      const cachedUser = await redis.get(`user:${user_id}`);
      if (cachedUser) {
        const user = JSON.parse(cachedUser);
        return callback(null, {
          success: true,
          message: 'User retrieved from cache',
          user
        });
      }

      // Get from database
      const dbUser = await db('users')
        .where({ id: user_id, is_active: true })
        .select('id', 'email', 'username', 'wallet_balance', 'kyc_status', 'created_at')
        .first();

      if (!dbUser) {
        return callback(null, {
          success: false,
          message: 'User not found',
          user: undefined
        });
      }

      const user: User = {
        id: dbUser.id,
        email: dbUser.email,
        username: dbUser.username,
        wallet_balance: parseFloat(dbUser.wallet_balance),
        kyc_status: dbUser.kyc_status,
        created_at: dbUser.created_at.toISOString(),
        is_active: true
      };

      // Cache user data for 5 minutes
      await redis.setex(`user:${user_id}`, 300, JSON.stringify(user));

      callback(null, {
        success: true,
        message: 'User retrieved successfully',
        user
      });

    } catch (error) {
      logger.error('GetUser error:', error);
      callback(null, {
        success: false,
        message: 'Failed to retrieve user',
        user: undefined
      });
    }
  }

  async ValidateToken(
    call: ServerUnaryCall<ValidateTokenRequest, ValidateTokenResponse>,
    callback: sendUnaryData<ValidateTokenResponse>
  ) {
    try {
      const { token } = call.request;

      const decoded = jwt.verify(token, this.JWT_SECRET) as any;
      
      callback(null, {
        valid: true,
        user_id: decoded.userId,
        username: decoded.username,
        email: decoded.email,
        message: 'Token is valid'
      });

    } catch (error) {
      callback(null, {
        valid: false,
        user_id: '',
        username: '',
        email: '',
        message: 'Invalid token'
      });
    }
  }

  async UpdateBalance(
    call: ServerUnaryCall<UpdateBalanceRequest, UpdateBalanceResponse>,
    callback: sendUnaryData<UpdateBalanceResponse>
  ) {
    try {
      const { user_id, amount, operation, reason } = call.request;

      const user = await db('users').where({ id: user_id }).first();
      if (!user) {
        return callback(null, {
          success: false,
          message: 'User not found',
          new_balance: 0
        });
      }

      const currentBalance = parseFloat(user.wallet_balance);
      let newBalance: number;

      if (operation === 'add') {
        newBalance = currentBalance + amount;
      } else if (operation === 'subtract') {
        if (currentBalance < amount) {
          return callback(null, {
            success: false,
            message: 'Insufficient balance',
            new_balance: currentBalance
          });
        }
        newBalance = currentBalance - amount;
      } else {
        return callback(null, {
          success: false,
          message: 'Invalid operation',
          new_balance: currentBalance
        });
      }

      // Update balance
      await db('users')
        .where({ id: user_id })
        .update({ wallet_balance: newBalance });

      // Invalidate cache
      await redis.del(`user:${user_id}`);

      // Publish balance updated event
      await kafkaProducer.send({
        topic: 'user.events',
        messages: [{
          key: user_id,
          value: JSON.stringify({
            event_type: 'balance_updated',
            user_id,
            old_balance: currentBalance,
            new_balance: newBalance,
            amount,
            operation,
            reason,
            timestamp: new Date().toISOString()
          })
        }]
      });

      callback(null, {
        success: true,
        message: 'Balance updated successfully',
        new_balance: newBalance
      });

    } catch (error) {
      logger.error('UpdateBalance error:', error);
      callback(null, {
        success: false,
        message: 'Failed to update balance',
        new_balance: 0
      });
    }
  }

  // Additional methods implementation would go here...
}