import express from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { config } from './config.js';
import { createAuthRouter } from './routes/auth.js';
import { dashboardRouter } from './routes/dashboard.js';
import { notFound, errorHandler } from './middleware/errors.js';
import { requireSessionOrigin } from './middleware/auth.js';

export function createApp() {
  const app = express();
  const sessionStore = MongoStore.create({
    mongoUrl: config.MONGODB_URI,
    collectionName: 'sessions',
    ttl: 30 * 24 * 60 * 60,
  });

  app.disable('x-powered-by');
  app.set('trust proxy', config.isProduction ? 1 : false);
  app.use(helmet());
  app.use(express.json({ limit: '20kb', strict: true }));
  app.use(session({
    name: 'bridgesync.sid',
    secret: config.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      httpOnly: true,
      secure: config.isProduction,
      sameSite: 'lax',
      path: '/',
    },
  }));
  app.use('/api', requireSessionOrigin(config.APP_ORIGIN));
  // Report actual database readiness; the API may lose its Atlas connection after startup.
  app.get('/api/health', (_req, res) => {
    const databaseReady = mongoose.connection.readyState === 1;
    res.status(databaseReady ? 200 : 503).json({
      status: databaseReady ? 'ok' : 'unavailable',
      database: databaseReady ? 'ready' : 'not_ready',
    });
  });
  app.use('/api/auth', createAuthRouter({ isProduction: config.isProduction }));
  app.use('/api/dashboard', dashboardRouter);
  app.use(notFound);
  app.use(errorHandler);
  return app;
}
