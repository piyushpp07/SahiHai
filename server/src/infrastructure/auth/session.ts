import session from 'express-session';
import { Express } from 'express';

export const configureSession = (app: Express) => {

  app.use(
    session({
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
