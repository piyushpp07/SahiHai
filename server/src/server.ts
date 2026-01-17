import { app } from './app';
import http from 'http';
import logger from './infrastructure/logging/logger';
import { env } from './config/env';

const port = env.PORT || 3000;

/**
 * Cleanup function for graceful shutdown
 */
const cleanup = async () => {
  logger.info('Shutting down server...');
  process.exit(0);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

app.listen(port, () => {
    logger.info(`SahiHai Backend 2.0 running on port ${port} in ${env.NODE_ENV} mode`);
});
