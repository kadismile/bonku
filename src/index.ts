import 'module-alias/register';
import 'source-map-support/register';
import dotenv from 'dotenv';

const result = dotenv.config();
if (result.error) {
  dotenv.config({ path: '.env.default' });
}

import util from 'util';
import app from './app';

import SafeMongooseConnection from './lib/safe-mongoose-connection';
import logger from './logger';

const PORT = process.env.PORT || 80;

let debugCallback: any = null;
if (process.env.NODE_ENV === 'development') {
  debugCallback = (collectionName: string, method: string, query: string, doc: string): void => {
    const message = `${doc}.${collectionName}.${method}(${util.inspect(query, { colors: true, depth: null })})`;
    logger.log({
      level: 'verbose',
      message,
      consoleLoggerOptions: { label: 'MONGO' },
    });
  };
}

const safeMongooseConnection = new SafeMongooseConnection({
  mongoUrl: process.env.MONGO_URL || '',
  debugCallback,
  onStartConnection: (mongoUrl) => logger.info(`Connecting to MongoDB at ${process.env.NODE_ENV}, ${mongoUrl} environment`),
  onConnectionError: (error, mongoUrl) =>
    logger.log({
      level: 'error',
      message: `Could not connect to MongoDB with the provided credentials ${mongoUrl}`,
      error,
    }),
  onConnectionRetry: (mongoUrl) => logger.info(`Retrying to MongoDB at ${process.env.NODE_ENV} ${mongoUrl} environment`),
});

const serve = () =>
  app.listen(PORT, () => {
    logger.info(`🌏 Express server started at http://localhost:${PORT}`);
  });

if (process.env.MONGO_URL == null) {
  logger.error('MONGO_URL not specified in environment');
  process.exit(1);
} else {
  safeMongooseConnection.connect((mongoUrl: string) => {
    logger.info(`Connected to MongoDB at ${process.env.NODE_ENV} environment ${mongoUrl}`);
    serve();
  });
}

// Close the Mongoose connection, when receiving SIGINT
process.on('SIGINT', () => {
  console.log('\n'); /* eslint-disable-line */
  logger.info('Gracefully shutting down');
  logger.info('Closing the MongoDB connection');
  safeMongooseConnection.close((err: any) => {
    if (err) {
      logger.log({
        level: 'error',
        message: 'Error shutting closing mongo connection',
        error: err,
      });
    } else {
      logger.info('Mongo connection closed successfully');
    }
    process.exit(0);
  }, true);
});