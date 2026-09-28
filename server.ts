import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import { createServer as createViteServer } from 'vite';
import { router as apiRouter } from './server/routes';

const PORT = 3000;

async function startServer() {
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

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', name: 'Athmanathan Study Abroad Server', time: new Date().toISOString() });
  });

  // Mount API routes
  app.use('/api', apiRouter);

  // Disable / redirect legacy extra admin paths like /admin/irs to /admin
  app.get(['/admin/irs', '/admin/irs/*', '/admin/dashboard', '/admin/dashboard/*'], (req, res) => {
    res.redirect(302, '/admin');
  });

  // Vite middleware for development vs static build for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ATHMANATHAN STUDY ABROAD Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal error starting server:', err);
  process.exit(1);
});
