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
      resave: false, // required: force lightweight session keep alive (touch)
      saveUninitialized: false, // recommended: only save session when data exists
      cookie: {
        secure: process.env.NODE_ENV === 'production', // true in prod
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
      },
    })
  );
};
