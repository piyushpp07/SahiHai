import Redis from 'ioredis';
import { env } from '../../config/env';
import logger from '../logging/logger';

export class RedisConnection {
  private static instance: Redis;

  private constructor() {}

  public static getInstance(): Redis {
    if (!RedisConnection.instance) {
      RedisConnection.instance = new Redis(env.REDIS_URL, {
        retryStrategy: (times) => {
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
      });

      RedisConnection.instance.on('connect', () => {
        logger.info('Connected to Redis');
      });

      RedisConnection.instance.on('error', (err) => {
        logger.error('Redis connection error:', err);
      });
    }

    return RedisConnection.instance;
  }
}
