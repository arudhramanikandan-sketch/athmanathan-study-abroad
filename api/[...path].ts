import type { IncomingMessage, ServerResponse } from 'http';
import app from '../server/app';

export default function handler(req: any, res: ServerResponse) {
  const matchedPath = req.headers?.['x-matched-path'] || req.headers?.['x-vercel-matched-path'];
  if (typeof matchedPath === 'string' && matchedPath.startsWith('/api')) {
    req.url = matchedPath;
  } else if (typeof req.url === 'string' && !req.url.startsWith('/api')) {
    req.url = `/api${req.url.startsWith('/') ? req.url : '/' + req.url}`;
  }

  return app(req, res);
}
