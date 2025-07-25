import express from 'express';
import helmet from 'helmet';
import { createServer } from 'http';
import { Server } from '@grpc/grpc-js';
import { UserServiceImpl } from './services/userService';
import { setupGrpcServer } from './grpc/server';
import { setupKafka } from './kafka/producer';
import { setupDatabase } from './config/database';
import { setupRedis } from './config/redis';
import { setupTracing } from './config/tracing';
import { setupHealthChecks } from './health/checks';
import { logger } from './utils/logger';

const PORT = process.env.PORT || 3001;
const GRPC_PORT = process.env.GRPC_PORT || 50001;

class UserServiceApplication {
  private app: express.Application;
  private grpcServer: Server;
  private httpServer: any;

  constructor() {
    this.app = express();
    this.grpcServer = new Server();
    this.setupExpress();
  }

  private setupExpress() {
    this.app.use(helmet());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  async initialize() {
    try {
      // Setup distributed tracing
      await setupTracing();
      logger.info('Distributed tracing initialized');

      // Setup database connection
      await setupDatabase();
      logger.info('Database connection established');

      // Setup Redis connection
      await setupRedis();
      logger.info('Redis connection established');

      // Setup Kafka producer
      await setupKafka();
      logger.info('Kafka producer initialized');

      // Setup gRPC server
      const userService = new UserServiceImpl();
      await setupGrpcServer(this.grpcServer, userService);
      logger.info('gRPC server configured');

      // Setup health checks
      setupHealthChecks(this.app);
      logger.info('Health checks configured');

      // Start HTTP server
      this.httpServer = createServer(this.app);
      this.httpServer.listen(PORT, () => {
        logger.info(`User Service HTTP server running on port ${PORT}`);
      });

      // Start gRPC server
      this.grpcServer.bindAsync(
        `0.0.0.0:${GRPC_PORT}`,
        require('@grpc/grpc-js').ServerCredentials.createInsecure(),
        (error, port) => {
          if (error) {
            logger.error('Failed to start gRPC server:', error);
            process.exit(1);
          }
          this.grpcServer.start();
          logger.info(`User Service gRPC server running on port ${port}`);
        }
      );

      // Graceful shutdown handling
      this.setupGracefulShutdown();

    } catch (error) {
      logger.error('Failed to initialize User Service:', error);
      process.exit(1);
    }
  }

  private setupGracefulShutdown() {
    const shutdown = async (signal: string) => {
      logger.info(`Received ${signal}, starting graceful shutdown...`);
      
      try {
        // Stop accepting new connections
        this.httpServer?.close();
        this.grpcServer?.tryShutdown(() => {
          logger.info('gRPC server shut down');
        });

        // Close database connections
        // Close Redis connections
        // Close Kafka connections

        logger.info('Graceful shutdown completed');
        process.exit(0);
      } catch (error) {
        logger.error('Error during shutdown:', error);
        process.exit(1);
      }
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  }
}

// Start the service
const userService = new UserServiceApplication();
userService.initialize().catch((error) => {
  logger.error('Failed to start User Service:', error);
  process.exit(1);
});

export default userService;