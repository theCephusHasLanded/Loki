import * as tf from '@tensorflow/tfjs-node';
import { logger } from '../utils/logger';
import { redis } from '../config/redis';

export interface UserBehaviorProfile {
  userId: string;
  averageTradeSize: number;
  tradingFrequency: number;
  preferredMarkets: string[];
  sessionDuration: number;
  deviceFingerprints: string[];
  geographicPattern: string[];
  timeZonePattern: number[];
  velocityMetrics: {
    tradesPerHour: number;
    volumePerHour: number;
    uniqueMarketsPerDay: number;
  };
}

export interface TransactionRiskScore {
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  reasons: string[];
  recommendedAction: 'allow' | 'review' | 'block';
  confidence: number;
}

export interface AnomalyDetectionResult {
  isAnomaly: boolean;
  anomalyScore: number;
  anomalyType: string[];
  features: string[];
  timestamp: Date;
}

export class FraudDetectionService {
  private behaviorModel: tf.LayersModel | null = null;
  private anomalyModel: tf.LayersModel | null = null;
  private userProfiles: Map<string, UserBehaviorProfile> = new Map();

  constructor() {
    this.initializeModels();
    this.loadUserProfiles();
  }

  /**
   * Initialize ML models for fraud detection
   */
  async initializeModels(): Promise<void> {
    try {
      // Load behavior analysis model (neural network for user behavior patterns)
      this.behaviorModel = await this.createBehaviorModel();
      
      // Load anomaly detection model (autoencoder for detecting unusual patterns)
      this.anomalyModel = await this.createAnomalyModel();

      logger.info('Fraud detection models initialized successfully');
    } catch (error) {
      logger.error('Error initializing fraud detection models:', error);
    }
  }

  /**
   * Create behavior analysis model
   */
  private createBehaviorModel(): tf.LayersModel {
    const model = tf.sequential();

    // Input layer for behavior features
    model.add(tf.layers.inputLayer({
      inputShape: [20] // 20 behavioral features
    }));

    // Hidden layers for pattern detection
    model.add(tf.layers.dense({
      units: 64,
      activation: 'relu'
    }));

    model.add(tf.layers.dropout({ rate: 0.3 }));

    model.add(tf.layers.dense({
      units: 32,
      activation: 'relu'
    }));

    model.add(tf.layers.dropout({ rate: 0.3 }));

    model.add(tf.layers.dense({
      units: 16,
      activation: 'relu'
    }));

    // Output layer (fraud probability)
    model.add(tf.layers.dense({
      units: 1,
      activation: 'sigmoid'
    }));

    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'binaryCrossentropy',
      metrics: ['accuracy']
    });

    return model;
  }

  /**
   * Create anomaly detection model (autoencoder)
   */
  private createAnomalyModel(): tf.LayersModel {
    const inputDim = 30; // 30 transaction features
    const encodingDim = 10;

    // Encoder
    const input = tf.input({ shape: [inputDim] });
    const encoded = tf.layers.dense({ 
      units: encodingDim, 
      activation: 'relu',
      name: 'encoder'
    }).apply(input) as tf.SymbolicTensor;

    // Decoder
    const decoded = tf.layers.dense({
      units: inputDim,
      activation: 'sigmoid',
      name: 'decoder'
    }).apply(encoded) as tf.SymbolicTensor;

    const model = tf.model({ inputs: input, outputs: decoded });

    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'meanSquaredError'
    });

    return model;
  }

  /**
   * Analyze transaction for fraud risk
   */
  async analyzeTransaction(transaction: {
    userId: string;
    amount: number;
    marketId: string;
    shares: number;
    timestamp: Date;
    ipAddress: string;
    userAgent: string;
    sessionId: string;
  }): Promise<TransactionRiskScore> {
    try {
      // Get user profile
      const userProfile = await this.getUserProfile(transaction.userId);
      
      // Calculate behavioral features
      const behaviorFeatures = await this.calculateBehaviorFeatures(transaction, userProfile);
      
      // Get fraud probability from behavior model
      const behaviorTensor = tf.tensor2d([behaviorFeatures], [1, 20]);
      const fraudProbability = await this.behaviorModel!.predict(behaviorTensor) as tf.Tensor;
      const fraudScore = (await fraudProbability.data())[0];

      // Detect anomalies
      const anomalyResult = await this.detectAnomalies(transaction, userProfile);
      
      // Combine scores
      const combinedRiskScore = this.combineRiskScores(fraudScore, anomalyResult.anomalyScore);
      
      // Determine risk level and action
      const { riskLevel, recommendedAction } = this.determineRiskLevelAndAction(combinedRiskScore);
      
      // Generate reasons
      const reasons = this.generateRiskReasons(fraudScore, anomalyResult, userProfile);

      // Cleanup tensors
      behaviorTensor.dispose();
      fraudProbability.dispose();

      // Update user profile with new transaction
      await this.updateUserProfile(transaction.userId, transaction);

      return {
        riskScore: combinedRiskScore,
        riskLevel,
        reasons,
        recommendedAction,
        confidence: Math.min(0.95, fraudScore * 0.7 + anomalyResult.anomalyScore * 0.3)
      };

    } catch (error) {
      logger.error('Error analyzing transaction for fraud:', error);
      // Return conservative high-risk score on error
      return {
        riskScore: 0.8,
        riskLevel: 'high',
        reasons: ['Analysis error - requires manual review'],
        recommendedAction: 'review',
        confidence: 0.5
      };
    }
  }

  /**
   * Calculate behavioral features for fraud detection
   */
  private async calculateBehaviorFeatures(
    transaction: any,
    userProfile: UserBehaviorProfile
  ): Promise<number[]> {
    const features: number[] = [];

    // Amount deviation from user average
    const amountDeviation = Math.abs(transaction.amount - userProfile.averageTradeSize) / 
                           Math.max(userProfile.averageTradeSize, 1);
    features.push(Math.min(amountDeviation, 10)); // Cap at 10x

    // Trading frequency anomaly
    const currentHour = new Date(transaction.timestamp).getHours();
    const isUnusualTime = !userProfile.timeZonePattern.includes(currentHour) ? 1 : 0;
    features.push(isUnusualTime);

    // Geographic anomaly (simplified)
    const isNewLocation = !userProfile.geographicPattern.includes(transaction.ipAddress) ? 1 : 0;
    features.push(isNewLocation);

    // Market familiarity
    const isUnfamiliarMarket = !userProfile.preferredMarkets.includes(transaction.marketId) ? 1 : 0;
    features.push(isUnfamiliarMarket);

    // Session behavior
    const sessionData = await redis.get(`session:${transaction.sessionId}`);
    const sessionDuration = sessionData ? JSON.parse(sessionData).duration || 0 : 0;
    const sessionDeviation = Math.abs(sessionDuration - userProfile.sessionDuration) / 
                            Math.max(userProfile.sessionDuration, 1);
    features.push(Math.min(sessionDeviation, 5));

    // Velocity checks
    const recentTransactions = await this.getRecentTransactions(transaction.userId, 3600000); // 1 hour
    const tradesPerHour = recentTransactions.length;
    const volumePerHour = recentTransactions.reduce((sum, tx) => sum + tx.amount, 0);

    features.push(Math.min(tradesPerHour / Math.max(userProfile.velocityMetrics.tradesPerHour, 1), 10));
    features.push(Math.min(volumePerHour / Math.max(userProfile.velocityMetrics.volumePerHour, 1), 10));

    // Device fingerprint anomaly
    const deviceFingerprint = this.generateDeviceFingerprint(transaction.userAgent, transaction.ipAddress);
    const isNewDevice = !userProfile.deviceFingerprints.includes(deviceFingerprint) ? 1 : 0;
    features.push(isNewDevice);

    // Technical indicators (add more features to reach 20)
    features.push(transaction.shares / Math.max(transaction.amount, 1)); // Price per share ratio
    features.push(new Date(transaction.timestamp).getDay()); // Day of week
    features.push(currentHour); // Hour of day
    features.push(Math.log(transaction.amount + 1)); // Log of amount

    // Add more derived features
    const daysSinceLastTrade = await this.getDaysSinceLastTrade(transaction.userId);
    features.push(Math.min(daysSinceLastTrade, 30));

    // Pad or trim to exactly 20 features
    while (features.length < 20) {
      features.push(0);
    }

    return features.slice(0, 20);
  }

  /**
   * Detect anomalies using autoencoder
   */
  private async detectAnomalies(
    transaction: any,
    userProfile: UserBehaviorProfile
  ): Promise<AnomalyDetectionResult> {
    try {
      // Prepare transaction features for anomaly detection
      const transactionFeatures = await this.prepareTransactionFeatures(transaction, userProfile);
      
      // Get reconstruction from autoencoder
      const inputTensor = tf.tensor2d([transactionFeatures], [1, 30]);
      const reconstruction = await this.anomalyModel!.predict(inputTensor) as tf.Tensor;
      
      // Calculate reconstruction error
      const reconstructionError = tf.losses.meanSquaredError(inputTensor, reconstruction);
      const anomalyScore = Math.min((await reconstructionError.data())[0] * 10, 1); // Scale to 0-1

      // Determine if it's an anomaly
      const anomalyThreshold = 0.7;
      const isAnomaly = anomalyScore > anomalyThreshold;

      // Identify anomaly types
      const anomalyTypes = this.identifyAnomalyTypes(transactionFeatures, anomalyScore);

      // Cleanup tensors
      inputTensor.dispose();
      reconstruction.dispose();
      reconstructionError.dispose();

      return {
        isAnomaly,
        anomalyScore,
        anomalyType: anomalyTypes,
        features: ['transaction_pattern', 'amount_anomaly', 'timing_anomaly'],
        timestamp: new Date()
      };

    } catch (error) {
      logger.error('Error in anomaly detection:', error);
      return {
        isAnomaly: false,
        anomalyScore: 0,
        anomalyType: [],
        features: [],
        timestamp: new Date()
      };
    }
  }

  /**
   * Prepare transaction features for anomaly detection
   */
  private async prepareTransactionFeatures(transaction: any, userProfile: UserBehaviorProfile): Promise<number[]> {
    const features: number[] = [];

    // Normalize transaction amount
    features.push(transaction.amount / 10000); // Assuming max transaction is 10k

    // Time-based features
    const date = new Date(transaction.timestamp);
    features.push(date.getHours() / 24);
    features.push(date.getDay() / 7);
    features.push(date.getDate() / 31);

    // User behavior deviation
    features.push(Math.abs(transaction.amount - userProfile.averageTradeSize) / 10000);
    features.push(transaction.shares / 1000); // Normalize shares

    // Add more features (pad to 30)
    while (features.length < 30) {
      features.push(Math.random() * 0.1); // Small noise for missing features
    }

    return features.slice(0, 30);
  }

  /**
   * Combine risk scores from different models
   */
  private combineRiskScores(fraudScore: number, anomalyScore: number): number {
    // Weighted combination with fraud model having higher weight
    return fraudScore * 0.7 + anomalyScore * 0.3;
  }

  /**
   * Determine risk level and recommended action
   */
  private determineRiskLevelAndAction(riskScore: number): {
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    recommendedAction: 'allow' | 'review' | 'block';
  } {
    if (riskScore < 0.3) {
      return { riskLevel: 'low', recommendedAction: 'allow' };
    } else if (riskScore < 0.6) {
      return { riskLevel: 'medium', recommendedAction: 'allow' };
    } else if (riskScore < 0.8) {
      return { riskLevel: 'high', recommendedAction: 'review' };
    } else {
      return { riskLevel: 'critical', recommendedAction: 'block' };
    }
  }

  /**
   * Generate human-readable reasons for risk assessment
   */
  private generateRiskReasons(
    fraudScore: number,
    anomalyResult: AnomalyDetectionResult,
    userProfile: UserBehaviorProfile
  ): string[] {
    const reasons: string[] = [];

    if (fraudScore > 0.6) {
      reasons.push('Behavioral pattern indicates potential fraud');
    }

    if (anomalyResult.isAnomaly) {
      reasons.push('Transaction pattern is anomalous for this user');
    }

    if (anomalyResult.anomalyTypes.includes('amount')) {
      reasons.push('Transaction amount significantly deviates from user history');
    }

    if (anomalyResult.anomalyTypes.includes('timing')) {
      reasons.push('Transaction timing is unusual for this user');
    }

    if (anomalyResult.anomalyTypes.includes('velocity')) {
      reasons.push('High transaction velocity detected');
    }

    return reasons.length > 0 ? reasons : ['Standard risk assessment completed'];
  }

  /**
   * Identify specific types of anomalies
   */
  private identifyAnomalyTypes(features: number[], anomalyScore: number): string[] {
    const types: string[] = [];

    // Amount anomaly (first feature is normalized amount)
    if (features[0] > 0.8) {
      types.push('amount');
    }

    // Timing anomaly
    if (features[1] < 0.2 || features[1] > 0.8) { // Very early or very late hours
      types.push('timing');
    }

    // High overall anomaly score
    if (anomalyScore > 0.8) {
      types.push('high_risk_pattern');
    }

    return types;
  }

  /**
   * Get or create user behavioral profile
   */
  private async getUserProfile(userId: string): Promise<UserBehaviorProfile> {
    // Try to get from cache first
    let profile = this.userProfiles.get(userId);
    
    if (!profile) {
      // Try Redis cache
      const cachedProfile = await redis.get(`user_profile:${userId}`);
      if (cachedProfile) {
        profile = JSON.parse(cachedProfile);
      } else {
        // Create new profile from transaction history
        profile = await this.buildUserProfile(userId);
      }
      
      // Cache in memory
      this.userProfiles.set(userId, profile!);
    }

    return profile!;
  }

  /**
   * Build user profile from transaction history
   */
  private async buildUserProfile(userId: string): Promise<UserBehaviorProfile> {
    // This would typically query the database for user's transaction history
    // For now, return a default profile
    const defaultProfile: UserBehaviorProfile = {
      userId,
      averageTradeSize: 100,
      tradingFrequency: 5, // trades per day
      preferredMarkets: [],
      sessionDuration: 1800, // 30 minutes
      deviceFingerprints: [],
      geographicPattern: [],
      timeZonePattern: [9, 10, 11, 12, 13, 14, 15, 16, 17], // Business hours
      velocityMetrics: {
        tradesPerHour: 2,
        volumePerHour: 200,
        uniqueMarketsPerDay: 3
      }
    };

    // Cache the profile
    await redis.setex(`user_profile:${userId}`, 3600, JSON.stringify(defaultProfile));

    return defaultProfile;
  }

  /**
   * Update user profile with new transaction data
   */
  private async updateUserProfile(userId: string, transaction: any): Promise<void> {
    const profile = await this.getUserProfile(userId);
    
    // Update average trade size (exponential moving average)
    profile.averageTradeSize = profile.averageTradeSize * 0.9 + transaction.amount * 0.1;
    
    // Add to preferred markets if not already there
    if (!profile.preferredMarkets.includes(transaction.marketId)) {
      profile.preferredMarkets.push(transaction.marketId);
      if (profile.preferredMarkets.length > 10) {
        profile.preferredMarkets = profile.preferredMarkets.slice(-10); // Keep last 10
      }
    }

    // Update device fingerprint
    const deviceFingerprint = this.generateDeviceFingerprint(transaction.userAgent, transaction.ipAddress);
    if (!profile.deviceFingerprints.includes(deviceFingerprint)) {
      profile.deviceFingerprints.push(deviceFingerprint);
      if (profile.deviceFingerprints.length > 5) {
        profile.deviceFingerprints = profile.deviceFingerprints.slice(-5);
      }
    }

    // Update geographic pattern
    if (!profile.geographicPattern.includes(transaction.ipAddress)) {
      profile.geographicPattern.push(transaction.ipAddress);
      if (profile.geographicPattern.length > 5) {
        profile.geographicPattern = profile.geographicPattern.slice(-5);
      }
    }

    // Cache updated profile
    await redis.setex(`user_profile:${userId}`, 3600, JSON.stringify(profile));
    this.userProfiles.set(userId, profile);
  }

  /**
   * Generate device fingerprint
   */
  private generateDeviceFingerprint(userAgent: string, ipAddress: string): string {
    // Simple fingerprinting - in production would use more sophisticated methods
    const crypto = require('crypto');
    return crypto.createHash('md5').update(userAgent + ipAddress).digest('hex');
  }

  /**
   * Load user profiles from cache
   */
  private async loadUserProfiles(): Promise<void> {
    // Implementation would load frequently accessed user profiles
    logger.info('User profiles loaded');
  }

  /**
   * Get recent transactions for velocity checking
   */
  private async getRecentTransactions(userId: string, timeWindowMs: number): Promise<any[]> {
    // This would query the database for recent transactions
    // For now, return empty array
    return [];
  }

  /**
   * Get days since last trade
   */
  private async getDaysSinceLastTrade(userId: string): Promise<number> {
    // This would query the database for the last trade date
    // For now, return 1 day
    return 1;
  }

  /**
   * Get fraud detection statistics
   */
  async getDetectionStats(): Promise<{
    totalTransactionsAnalyzed: number;
    fraudDetectionRate: number;
    falsePositiveRate: number;
    averageResponseTime: number;
  }> {
    const stats = await redis.get('fraud_detection_stats');
    return stats ? JSON.parse(stats) : {
      totalTransactionsAnalyzed: 0,
      fraudDetectionRate: 0,
      falsePositiveRate: 0,
      averageResponseTime: 0
    };
  }
}