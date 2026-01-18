import session from 'express-session';
import MongoStore from 'connect-mongo';
import { env } from '../../../config/env';

export const sessionMiddleware = session({
  store: MongoStore.create({
    mongoUrl: env.MONGODB_URI,
    collectionName: 'sessions',
    ttl: 14 * 24 * 60 * 60, // 14 days
    autoRemove: 'native'
  }),
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
