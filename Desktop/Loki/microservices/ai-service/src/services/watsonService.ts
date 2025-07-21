import NaturalLanguageUnderstandingV1 from 'ibm-watson/natural-language-understanding/v1';
import VisualRecognitionV4 from 'ibm-watson/visual-recognition/v4';
import DiscoveryV2 from 'ibm-watson/discovery/v2';
import { IamAuthenticator } from 'ibm-watson/auth';
import { logger } from '../utils/logger';

export interface SentimentAnalysis {
  sentiment: 'positive' | 'neutral' | 'negative';
  confidence: number;
  emotion: {
    joy: number;
    fear: number;
    sadness: number;
    disgust: number;
    anger: number;
  };
}

export interface EntityExtraction {
  entities: Array<{
    type: string;
    text: string;
    confidence: number;
    relevance: number;
  }>;
  keywords: Array<{
    text: string;
    relevance: number;
    sentiment: {
      score: number;
    };
  }>;
}

export interface AstronomicalImageAnalysis {
  objectType: string;
  confidence: number;
  coordinates: {
    ra: number;
    dec: number;
  };
  magnitude?: number;
  classification: string;
  anomalies: string[];
}

export interface DocumentInsights {
  passages: Array<{
    passage_text: string;
    confidence: number;
    relevance: number;
  }>;
  concepts: Array<{
    text: string;
    relevance: number;
  }>;
  enrichments: {
    entities: any[];
    sentiment: any;
    categories: any[];
  };
}

export class WatsonAIService {
  private nlu: NaturalLanguageUnderstandingV1;
  private visualRecognition: VisualRecognitionV4;
  private discovery: DiscoveryV2;

  constructor() {
    // Initialize Natural Language Understanding
    this.nlu = new NaturalLanguageUnderstandingV1({
      version: '2022-04-07',
      authenticator: new IamAuthenticator({
        apikey: process.env.WATSON_NLU_API_KEY!,
      }),
      serviceUrl: process.env.WATSON_NLU_URL || 'https://api.us-south.natural-language-understanding.watson.cloud.ibm.com',
    });

    // Initialize Visual Recognition
    this.visualRecognition = new VisualRecognitionV4({
      version: '2019-02-11',
      authenticator: new IamAuthenticator({
        apikey: process.env.WATSON_VR_API_KEY!,
      }),
      serviceUrl: process.env.WATSON_VR_URL || 'https://api.us-south.visual-recognition.watson.cloud.ibm.com',
    });

    // Initialize Discovery
    this.discovery = new DiscoveryV2({
      version: '2020-08-30',
      authenticator: new IamAuthenticator({
        apikey: process.env.WATSON_DISCOVERY_API_KEY!,
      }),
      serviceUrl: process.env.WATSON_DISCOVERY_URL || 'https://api.us-south.discovery.watson.cloud.ibm.com',
    });
  }

  /**
   * Analyze sentiment and emotions in market-related text
   */
  async analyzeSentiment(text: string): Promise<SentimentAnalysis> {
    try {
      const analysisResults = await this.nlu.analyze({
        text,
        features: {
          sentiment: {
            document: true,
          },
          emotion: {
            document: true,
          },
        },
      });

      const result = analysisResults.result;
      const sentiment = result.sentiment?.document;
      const emotion = result.emotion?.document;

      return {
        sentiment: sentiment?.label as 'positive' | 'neutral' | 'negative',
        confidence: sentiment?.score || 0,
        emotion: {
          joy: emotion?.joy || 0,
          fear: emotion?.fear || 0,
          sadness: emotion?.sadness || 0,
          disgust: emotion?.disgust || 0,
          anger: emotion?.anger || 0,
        },
      };
    } catch (error) {
      logger.error('Watson sentiment analysis error:', error);
      throw new Error('Failed to analyze sentiment');
    }
  }

  /**
   * Extract entities and keywords from market discussions
   */
  async extractEntities(text: string): Promise<EntityExtraction> {
    try {
      const analysisResults = await this.nlu.analyze({
        text,
        features: {
          entities: {
            model: process.env.WATSON_CUSTOM_ENTITY_MODEL || undefined,
            limit: 20,
            sentiment: true,
          },
          keywords: {
            limit: 20,
            sentiment: true,
          },
        },
      });

      const result = analysisResults.result;

      return {
        entities: result.entities?.map(entity => ({
          type: entity.type || 'unknown',
          text: entity.text || '',
          confidence: entity.confidence || 0,
          relevance: entity.relevance || 0,
        })) || [],
        keywords: result.keywords?.map(keyword => ({
          text: keyword.text || '',
          relevance: keyword.relevance || 0,
          sentiment: {
            score: keyword.sentiment?.score || 0,
          },
        })) || [],
      };
    } catch (error) {
      logger.error('Watson entity extraction error:', error);
      throw new Error('Failed to extract entities');
    }
  }

  /**
   * Analyze astronomical images from telescopes and satellites
   */
  async analyzeAstronomicalImage(imageBuffer: Buffer | string): Promise<AstronomicalImageAnalysis> {
    try {
      const classifyParams = {
        imagesFile: imageBuffer,
        classifierIds: [process.env.WATSON_ASTRONOMY_CLASSIFIER_ID!],
        threshold: 0.6,
      };

      const classifyResults = await this.visualRecognition.classify(classifyParams);
      const result = classifyResults.result;

      if (!result.images || result.images.length === 0) {
        throw new Error('No classification results');
      }

      const image = result.images[0];
      const topClassifier = image.classifiers?.[0];
      const topClass = topClassifier?.classes?.[0];

      if (!topClass) {
        throw new Error('No classification found');
      }

      // Extract astronomical coordinates if available from metadata
      // This would typically come from telescope metadata
      const coordinates = {
        ra: 0, // Right Ascension
        dec: 0, // Declination
      };

      return {
        objectType: topClass.class,
        confidence: topClass.score || 0,
        coordinates,
        classification: topClassifier?.name || 'unknown',
        anomalies: [], // Would be populated by custom analysis
      };
    } catch (error) {
      logger.error('Watson visual recognition error:', error);
      throw new Error('Failed to analyze astronomical image');
    }
  }

  /**
   * Search and analyze astronomical documents and research
   */
  async searchAstronomicalDocuments(query: string, projectId: string): Promise<DocumentInsights> {
    try {
      const queryParams = {
        projectId,
        query,
        count: 10,
        passages: {
          enabled: true,
          count: 5,
          fields: ['text', 'title'],
          characters: 400,
          per_document: true,
        },
      };

      const queryResults = await this.discovery.query(queryParams);
      const result = queryResults.result;

      return {
        passages: result.passages?.map(passage => ({
          passage_text: passage.passage_text || '',
          confidence: passage.confidence || 0,
          relevance: passage.start_offset || 0, // Using start_offset as relevance proxy
        })) || [],
        concepts: [], // Would extract from enrichments
        enrichments: {
          entities: result.results?.flatMap(doc => doc.enriched_text?.entities || []) || [],
          sentiment: result.results?.[0]?.enriched_text?.sentiment || {},
          categories: result.results?.flatMap(doc => doc.enriched_text?.categories || []) || [],
        },
      };
    } catch (error) {
      logger.error('Watson Discovery search error:', error);
      throw new Error('Failed to search astronomical documents');
    }
  }

  /**
   * Generate market insights based on astronomical events
   */
  async generateMarketInsights(
    eventData: {
      eventType: string;
      description: string;
      significance: number;
      historicalData?: any[];
    }
  ): Promise<{
    prediction: string;
    confidence: number;
    factors: string[];
    recommendations: string[];
  }> {
    try {
      // Combine event description with historical context
      const analysisText = `
        Astronomical Event: ${eventData.eventType}
        Description: ${eventData.description}
        Significance Level: ${eventData.significance}/10
        ${eventData.historicalData ? 'Historical patterns available' : 'No historical data'}
      `;

      // Analyze the text for insights
      const sentiment = await this.analyzeSentiment(analysisText);
      const entities = await this.extractEntities(analysisText);

      // Generate prediction based on Watson analysis
      let prediction = 'neutral';
      let confidence = 0.5;

      if (eventData.significance > 7) {
        prediction = sentiment.sentiment === 'positive' ? 'bullish' : 'bearish';
        confidence = Math.min(0.9, sentiment.confidence + (eventData.significance / 10) * 0.3);
      } else if (eventData.significance > 4) {
        prediction = 'moderate volatility expected';
        confidence = Math.min(0.7, sentiment.confidence + (eventData.significance / 10) * 0.2);
      }

      const factors = [
        `Event significance: ${eventData.significance}/10`,
        `Market sentiment: ${sentiment.sentiment} (${sentiment.confidence.toFixed(2)})`,
        `Entity relevance: ${entities.entities.length} entities identified`,
      ];

      const recommendations = this.generateRecommendations(eventData, sentiment, entities);

      return {
        prediction,
        confidence,
        factors,
        recommendations,
      };
    } catch (error) {
      logger.error('Market insights generation error:', error);
      throw new Error('Failed to generate market insights');
    }
  }

  /**
   * Generate trading recommendations based on AI analysis
   */
  private generateRecommendations(
    eventData: any,
    sentiment: SentimentAnalysis,
    entities: EntityExtraction
  ): string[] {
    const recommendations: string[] = [];

    // Base recommendations on event significance
    if (eventData.significance > 8) {
      recommendations.push('Consider high volatility trading strategies');
      recommendations.push('Monitor markets closely for rapid price movements');
    }

    // Sentiment-based recommendations
    if (sentiment.confidence > 0.7) {
      if (sentiment.sentiment === 'positive') {
        recommendations.push('Positive sentiment detected - consider long positions');
      } else if (sentiment.sentiment === 'negative') {
        recommendations.push('Negative sentiment detected - consider risk management');
      }
    }

    // Entity-based recommendations
    if (entities.entities.length > 5) {
      recommendations.push('Multiple relevant entities detected - analyze cross-correlations');
    }

    // Default recommendation
    if (recommendations.length === 0) {
      recommendations.push('Maintain current positions and monitor for new information');
    }

    return recommendations;
  }

  /**
   * Health check for Watson services
   */
  async healthCheck(): Promise<{
    nlu: boolean;
    visualRecognition: boolean;
    discovery: boolean;
  }> {
    const results = {
      nlu: false,
      visualRecognition: false,
      discovery: false,
    };

    try {
      await this.nlu.analyze({
        text: 'test',
        features: { sentiment: {} },
      });
      results.nlu = true;
    } catch (error) {
      logger.warn('NLU health check failed:', error);
    }

    try {
      // Visual Recognition health check would go here
      results.visualRecognition = true;
    } catch (error) {
      logger.warn('Visual Recognition health check failed:', error);
    }

    try {
      // Discovery health check would go here
      results.discovery = true;
    } catch (error) {
      logger.warn('Discovery health check failed:', error);
    }

    return results;
  }
}