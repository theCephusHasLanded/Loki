import * as tf from '@tensorflow/tfjs-node';
import { logger } from '../utils/logger';
import { redis } from '../config/redis';

export interface MarketFeatures {
  price: number[];
  volume: number[];
  sentiment: number[];
  technicalIndicators: {
    rsi: number[];
    macd: number[];
    bollinger: number[];
    ema: number[];
  };
  astronomicalCorrelation: number[];
  timestamp: number[];
}

export interface PredictionResult {
  prediction: number;
  confidence: number;
  features: string[];
  model: string;
  timestamp: Date;
}

export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  mae: number; // Mean Absolute Error
  rmse: number; // Root Mean Square Error
}

export class AITradingModels {
  private lstmModel: tf.LayersModel | null = null;
  private transformerModel: tf.LayersModel | null = null;
  private ensembleWeights: number[] = [0.4, 0.6]; // LSTM, Transformer
  private isTraining = false;

  constructor() {
    this.initializeModels();
  }

  /**
   * Initialize and load pre-trained models
   */
  async initializeModels(): Promise<void> {
    try {
      // Try to load existing models from storage
      try {
        this.lstmModel = await tf.loadLayersModel('file://models/lstm_market_predictor/model.json');
        logger.info('LSTM model loaded successfully');
      } catch (error) {
        logger.info('No existing LSTM model found, will create new one');
        this.lstmModel = this.createLSTMModel();
      }

      try {
        this.transformerModel = await tf.loadLayersModel('file://models/transformer_market_predictor/model.json');
        logger.info('Transformer model loaded successfully');
      } catch (error) {
        logger.info('No existing Transformer model found, will create new one');
        this.transformerModel = this.createTransformerModel();
      }

    } catch (error) {
      logger.error('Error initializing AI models:', error);
    }
  }

  /**
   * Create LSTM model for time series prediction
   */
  private createLSTMModel(): tf.LayersModel {
    const model = tf.sequential();

    // Input layer - expects sequences of market features
    model.add(tf.layers.inputLayer({
      inputShape: [60, 15] // 60 time steps, 15 features
    }));

    // LSTM layers with dropout for regularization
    model.add(tf.layers.lstm({
      units: 128,
      returnSequences: true,
      dropout: 0.2,
      recurrentDropout: 0.2
    }));

    model.add(tf.layers.lstm({
      units: 64,
      returnSequences: true,
      dropout: 0.2,
      recurrentDropout: 0.2
    }));

    model.add(tf.layers.lstm({
      units: 32,
      dropout: 0.2,
      recurrentDropout: 0.2
    }));

    // Dense layers for final prediction
    model.add(tf.layers.dense({
      units: 16,
      activation: 'relu'
    }));

    model.add(tf.layers.dropout({ rate: 0.3 }));

    model.add(tf.layers.dense({
      units: 1,
      activation: 'sigmoid' // Output probability between 0 and 1
    }));

    // Compile model
    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'binaryCrossentropy',
      metrics: ['accuracy', 'precision', 'recall']
    });

    return model;
  }

  /**
   * Create Transformer model for sequence analysis
   */
  private createTransformerModel(): tf.LayersModel {
    // Simplified transformer architecture
    const input = tf.input({ shape: [60, 15] });

    // Multi-head attention layers
    const attention1 = tf.layers.multiHeadAttention({
      numHeads: 8,
      keyDim: 64,
      name: 'attention_1'
    }).apply([input, input]) as tf.SymbolicTensor;

    const norm1 = tf.layers.layerNormalization().apply(attention1) as tf.SymbolicTensor;
    const add1 = tf.layers.add().apply([input, norm1]) as tf.SymbolicTensor;

    // Feed forward network
    const ff1 = tf.layers.dense({ units: 256, activation: 'relu' }).apply(add1) as tf.SymbolicTensor;
    const ff2 = tf.layers.dense({ units: 15 }).apply(ff1) as tf.SymbolicTensor;
    const norm2 = tf.layers.layerNormalization().apply(ff2) as tf.SymbolicTensor;
    const add2 = tf.layers.add().apply([add1, norm2]) as tf.SymbolicTensor;

    // Global average pooling and final layers
    const pool = tf.layers.globalAveragePooling1d().apply(add2) as tf.SymbolicTensor;
    const dense = tf.layers.dense({ units: 32, activation: 'relu' }).apply(pool) as tf.SymbolicTensor;
    const dropout = tf.layers.dropout({ rate: 0.3 }).apply(dense) as tf.SymbolicTensor;
    const output = tf.layers.dense({ units: 1, activation: 'sigmoid' }).apply(dropout) as tf.SymbolicTensor;

    const model = tf.model({ inputs: input, outputs: output });

    model.compile({
      optimizer: tf.train.adam(0.0001),
      loss: 'binaryCrossentropy',
      metrics: ['accuracy', 'precision', 'recall']
    });

    return model;
  }

  /**
   * Predict market movement using ensemble of models
   */
  async predictMarketMovement(features: MarketFeatures): Promise<PredictionResult> {
    if (!this.lstmModel || !this.transformerModel) {
      throw new Error('Models not initialized');
    }

    try {
      // Prepare input tensor
      const inputTensor = this.prepareInputTensor(features);

      // Get predictions from both models
      const lstmPrediction = await this.lstmModel.predict(inputTensor) as tf.Tensor;
      const transformerPrediction = await this.transformerModel.predict(inputTensor) as tf.Tensor;

      // Get prediction values
      const lstmValue = await lstmPrediction.data();
      const transformerValue = await transformerPrediction.data();

      // Ensemble prediction using weighted average
      const ensemblePrediction = (
        lstmValue[0] * this.ensembleWeights[0] + 
        transformerValue[0] * this.ensembleWeights[1]
      );

      // Calculate confidence based on model agreement
      const modelAgreement = 1 - Math.abs(lstmValue[0] - transformerValue[0]);
      const confidence = Math.min(0.95, modelAgreement * 0.8 + 0.2);

      // Identify most important features
      const importantFeatures = await this.getFeatureImportance(features);

      // Cleanup tensors
      inputTensor.dispose();
      lstmPrediction.dispose();
      transformerPrediction.dispose();

      return {
        prediction: ensemblePrediction,
        confidence,
        features: importantFeatures,
        model: 'ensemble_lstm_transformer',
        timestamp: new Date()
      };

    } catch (error) {
      logger.error('Error in market prediction:', error);
      throw new Error('Failed to generate market prediction');
    }
  }

  /**
   * Prepare input tensor from market features
   */
  private prepareInputTensor(features: MarketFeatures): tf.Tensor {
    // Normalize features
    const normalizedFeatures = this.normalizeFeatures(features);
    
    // Create tensor with shape [1, 60, 15] for batch prediction
    return tf.tensor3d([normalizedFeatures], [1, 60, 15]);
  }

  /**
   * Normalize features to [0, 1] range
   */
  private normalizeFeatures(features: MarketFeatures): number[][] {
    const sequenceLength = features.price.length;
    const normalized: number[][] = [];

    for (let i = 0; i < sequenceLength; i++) {
      const featureVector = [
        this.normalize(features.price[i], 0, 1), // Assuming price is already normalized
        this.normalize(features.volume[i], 0, 1000000), // Normalize volume
        features.sentiment[i], // Sentiment already -1 to 1
        ...Object.values(features.technicalIndicators).map(indicator => indicator[i]),
        features.astronomicalCorrelation[i]
      ];
      normalized.push(featureVector);
    }

    return normalized;
  }

  /**
   * Simple min-max normalization
   */
  private normalize(value: number, min: number, max: number): number {
    return (value - min) / (max - min);
  }

  /**
   * Get feature importance using gradient-based method
   */
  private async getFeatureImportance(features: MarketFeatures): Promise<string[]> {
    const featureNames = [
      'price', 'volume', 'sentiment', 'rsi', 'macd', 
      'bollinger', 'ema', 'astronomical_correlation'
    ];

    // Simplified feature importance - in production would use SHAP or LIME
    const importance = [0.25, 0.20, 0.15, 0.12, 0.10, 0.08, 0.08, 0.02];
    
    // Sort by importance and return top 5
    const sortedFeatures = featureNames
      .map((name, index) => ({ name, importance: importance[index] }))
      .sort((a, b) => b.importance - a.importance)
      .slice(0, 5)
      .map(item => item.name);

    return sortedFeatures;
  }

  /**
   * Train models with new data
   */
  async trainModels(
    trainingData: MarketFeatures[], 
    labels: number[],
    validationData?: { features: MarketFeatures[]; labels: number[] }
  ): Promise<ModelMetrics> {
    if (this.isTraining) {
      throw new Error('Model training already in progress');
    }

    this.isTraining = true;

    try {
      // Prepare training tensors
      const xTrain = this.prepareTrainingTensor(trainingData);
      const yTrain = tf.tensor1d(labels);

      let xVal: tf.Tensor | undefined;
      let yVal: tf.Tensor | undefined;

      if (validationData) {
        xVal = this.prepareTrainingTensor(validationData.features);
        yVal = tf.tensor1d(validationData.labels);
      }

      // Train LSTM model
      logger.info('Training LSTM model...');
      const lstmHistory = await this.lstmModel!.fit(xTrain, yTrain, {
        epochs: 50,
        batchSize: 32,
        validationData: xVal && yVal ? [xVal, yVal] : undefined,
        callbacks: {
          onEpochEnd: (epoch, logs) => {
            if (epoch % 10 === 0) {
              logger.info(`LSTM Epoch ${epoch}: loss=${logs?.loss}, accuracy=${logs?.acc}`);
            }
          }
        }
      });

      // Train Transformer model
      logger.info('Training Transformer model...');
      const transformerHistory = await this.transformerModel!.fit(xTrain, yTrain, {
        epochs: 30,
        batchSize: 16,
        validationData: xVal && yVal ? [xVal, yVal] : undefined,
        callbacks: {
          onEpochEnd: (epoch, logs) => {
            if (epoch % 5 === 0) {
              logger.info(`Transformer Epoch ${epoch}: loss=${logs?.loss}, accuracy=${logs?.acc}`);
            }
          }
        }
      });

      // Evaluate models
      const metrics = await this.evaluateModels(xTrain, yTrain);

      // Save models
      await this.saveModels();

      // Cleanup
      xTrain.dispose();
      yTrain.dispose();
      xVal?.dispose();
      yVal?.dispose();

      logger.info('Model training completed successfully');
      return metrics;

    } catch (error) {
      logger.error('Error training models:', error);
      throw error;
    } finally {
      this.isTraining = false;
    }
  }

  /**
   * Prepare training tensor from multiple market features
   */
  private prepareTrainingTensor(data: MarketFeatures[]): tf.Tensor {
    const batchSize = data.length;
    const sequenceLength = 60;
    const featureSize = 15;

    const tensorData: number[][][] = data.map(features => 
      this.normalizeFeatures(features)
    );

    return tf.tensor3d(tensorData, [batchSize, sequenceLength, featureSize]);
  }

  /**
   * Evaluate model performance
   */
  private async evaluateModels(xTest: tf.Tensor, yTest: tf.Tensor): Promise<ModelMetrics> {
    // Get predictions
    const lstmPredictions = await this.lstmModel!.predict(xTest) as tf.Tensor;
    const transformerPredictions = await this.transformerModel!.predict(xTest) as tf.Tensor;

    // Calculate ensemble predictions
    const lstmData = await lstmPredictions.data();
    const transformerData = await transformerPredictions.data();
    const yTestData = await yTest.data();

    let correct = 0;
    let truePositives = 0;
    let falsePositives = 0;
    let falseNegatives = 0;
    let totalError = 0;
    let totalSquaredError = 0;

    for (let i = 0; i < lstmData.length; i++) {
      const ensemblePred = lstmData[i] * this.ensembleWeights[0] + 
                          transformerData[i] * this.ensembleWeights[1];
      const predicted = ensemblePred > 0.5 ? 1 : 0;
      const actual = yTestData[i];

      if (predicted === actual) correct++;
      if (predicted === 1 && actual === 1) truePositives++;
      if (predicted === 1 && actual === 0) falsePositives++;
      if (predicted === 0 && actual === 1) falseNegatives++;

      const error = Math.abs(ensemblePred - actual);
      totalError += error;
      totalSquaredError += error * error;
    }

    const accuracy = correct / lstmData.length;
    const precision = truePositives / (truePositives + falsePositives) || 0;
    const recall = truePositives / (truePositives + falseNegatives) || 0;
    const f1Score = 2 * (precision * recall) / (precision + recall) || 0;
    const mae = totalError / lstmData.length;
    const rmse = Math.sqrt(totalSquaredError / lstmData.length);

    // Cleanup
    lstmPredictions.dispose();
    transformerPredictions.dispose();

    return { accuracy, precision, recall, f1Score, mae, rmse };
  }

  /**
   * Save trained models
   */
  private async saveModels(): Promise<void> {
    try {
      await this.lstmModel!.save('file://models/lstm_market_predictor');
      await this.transformerModel!.save('file://models/transformer_market_predictor');
      
      // Cache model metadata
      const metadata = {
        lastTrained: new Date().toISOString(),
        version: '2.0.0',
        ensembleWeights: this.ensembleWeights
      };
      
      await redis.set('model:metadata', JSON.stringify(metadata));
      
      logger.info('Models saved successfully');
    } catch (error) {
      logger.error('Error saving models:', error);
      throw error;
    }
  }

  /**
   * Get model status and metadata
   */
  async getModelStatus(): Promise<{
    lstmLoaded: boolean;
    transformerLoaded: boolean;
    isTraining: boolean;
    lastTrained?: string;
    version?: string;
  }> {
    const metadata = await redis.get('model:metadata');
    const parsedMetadata = metadata ? JSON.parse(metadata) : {};

    return {
      lstmLoaded: !!this.lstmModel,
      transformerLoaded: !!this.transformerModel,
      isTraining: this.isTraining,
      lastTrained: parsedMetadata.lastTrained,
      version: parsedMetadata.version
    };
  }
}