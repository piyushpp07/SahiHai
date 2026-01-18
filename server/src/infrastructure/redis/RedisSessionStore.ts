import session from 'express-session';
import RedisStore from 'connect-redis';
import { RedisConnection } from './RedisConnection';
import { env } from '../../config/env';

export const getSessionStore = () => {
  if (!env.REDIS_URL) {
    return undefined; // Falls back to MemoryStore
  }
  
  const redisClient = RedisConnection.getInstance();
  if (!redisClient) return undefined;

  return new RedisStore({
    client: redisClient,
    prefix: 'sahihai:sess:',
  });
};

export const sessionMiddleware = session({
  store: getSessionStore(),
  secret: env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  name: 'sahihai.sid',
  cookie: {
    secure: env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
  },
});
