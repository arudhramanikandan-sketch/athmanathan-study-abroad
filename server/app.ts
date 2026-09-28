import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import { router as apiRouter } from './routes';

export function createExpressApp() {
  const app = express();

  // Standard middlewares
  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true, limit: '15mb' }));
  app.use(cookieParser());

  // Serve public and uploaded media files directly
  const publicPath = path.join(process.cwd(), 'public');
  const uploadsPath = path.join(process.cwd(), 'public', 'uploads');
  app.use(express.static(publicPath));
  app.use('/uploads', express.static(uploadsPath));

  // Health check endpoints
  app.get(['/api/health', '/health'], (req, res) => {
    res.json({
      status: 'ok',
      name: 'Athmanathan Study Abroad Server',
      environment: process.env.NODE_ENV || 'development',
      time: new Date().toISOString(),
    });
  });

  // Mount API routes under /api
  app.use('/api', apiRouter);

  // Fallback mount under root in case serverless rewrites strip the /api prefix
  app.use(apiRouter);

  // Disable / redirect legacy extra admin paths like /admin/irs to /admin
  app.get(['/admin/irs', '/admin/irs/*', '/admin/dashboard', '/admin/dashboard/*'], (req, res) => {
    res.redirect(302, '/admin');
  });

  return app;
}

export const app = createExpressApp();
export default app;
