import session from 'express-session';
import RedisStore from 'connect-redis';
import redisClient from '../redis/client';
import { Express } from 'express';

export const configureSession = (app: Express) => {
  const redisStore = new RedisStore({
    client: redisClient,
    prefix: 'sahihai:',
  });

  app.use(
    session({
      store: redisStore,
      secret: process.env.SESSION_SECRET || 'supersecretkey',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'lax', // Needed for cross-origin and mobile
        maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
      },

    })
  );
};
