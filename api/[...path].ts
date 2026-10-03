import type { ServerResponse } from 'http';
import app from '../server/app';

export default function handler(req: any, res: ServerResponse) {
  // 1. Edge matched path headers from Vercel routing
  const matchedPath =
    req.headers?.['x-matched-path'] ||
    req.headers?.['x-vercel-matched-path'] ||
    req.headers?.['x-forwarded-uri'];

  if (typeof matchedPath === 'string' && matchedPath.startsWith('/api')) {
    req.url = matchedPath;
  } else if (req.query?.path) {
    // 2. Query param populated by Vercel [...path] dynamic route or rewrite
    const pathSegments = Array.isArray(req.query.path)
      ? req.query.path.join('/')
      : String(req.query.path);
    const searchIdx = (req.url || '').indexOf('?');
    const queryString = searchIdx !== -1 ? req.url.substring(searchIdx) : '';
    req.url = `/api/${pathSegments}${queryString}`;
  } else if (typeof req.url === 'string') {
    // 3. Fallback check for URL search param
    try {
      const urlObj = new URL(req.url, 'http://localhost');
      const pathParam = urlObj.searchParams.get('path');
      if (pathParam) {
        urlObj.searchParams.delete('path');
        const remainingQuery = urlObj.searchParams.toString();
        req.url = `/api/${pathParam}${remainingQuery ? '?' + remainingQuery : ''}`;
      }
    } catch {
      // keep current req.url
    }
  }

  // Ensure request url has /api prefix if stripped
  if (typeof req.url === 'string') {
    if (!req.url.startsWith('/api')) {
      req.url = `/api${req.url.startsWith('/') ? req.url : '/' + req.url}`;
    }
  }

  return app(req, res);
}
