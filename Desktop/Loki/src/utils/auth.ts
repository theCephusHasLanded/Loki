import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export class AuthUtils {
  private static readonly SALT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || '12');

  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  static generateId(): string {
    return uuidv4();
  }

  static generateTransactionHash(): string {
    return `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isValidUsername(username: string): boolean {
    const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
    return usernameRegex.test(username);
  }

  static sanitizeInput(input: string): string {
    return input.trim().replace(/[<>]/g, '');
  }

  static getClientInfo(req: any): { ipAddress: string; userAgent: string } {
    const ipAddress = req.ip || 
                     req.connection?.remoteAddress || 
                     req.socket?.remoteAddress || 
                     req.headers['x-forwarded-for']?.split(',')[0] || 
                     'unknown';
    
    const userAgent = req.headers['user-agent'] || 'unknown';
    
    return { ipAddress, userAgent };
  }
}

export default AuthUtils;