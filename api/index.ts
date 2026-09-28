import type { IncomingMessage, ServerResponse } from 'http';
import app from '../server/app';

export default function handler(req: any, res: ServerResponse) {
  // Restore matched path from Vercel edge headers if available
  const matchedPath = req.headers?.['x-matched-path'] || req.headers?.['x-vercel-matched-path'];
  if (typeof matchedPath === 'string' && matchedPath.startsWith('/api')) {
    req.url = matchedPath;
  } else if (typeof req.url === 'string') {
    // If URL has query parameters from rewrites like /api?path=public/bootstrap
    try {
      const urlObj = new URL(req.url, 'http://localhost');
      const pathParam = urlObj.searchParams.get('path');
      if (pathParam) {
        urlObj.searchParams.delete('path');
        const remainingQuery = urlObj.searchParams.toString();
        req.url = `/api/${pathParam}${remainingQuery ? '?' + remainingQuery : ''}`;
      }
    } catch {
      // Keep existing req.url
    }
  }

  return app(req, res);
}
