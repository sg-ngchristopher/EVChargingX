import express, { Request, Response, Router } from 'express';
import ltaRouter from './lta.js';
import onemapRouter from './onemap.js';
import statusRouter, { getHealthStatus } from './status.js';

const app = express();
app.use(express.json());

const apiRoutes = Router();

// Dedicated Health and Status route handlers
apiRoutes.get(['/health', '/api/health'], (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    uptime: typeof process.uptime === 'function' ? process.uptime() : 0,
    timestamp: new Date().toISOString(),
  });
});

apiRoutes.get(['/status', '/api/status'], (_req: Request, res: Response) => {
  res.status(200).json(getHealthStatus());
});

// Mount sub-routers
apiRoutes.use('/lta', ltaRouter);
apiRoutes.use('/onemap', onemapRouter);
apiRoutes.use('/', statusRouter);

// Direct aliases matching LTA service naming conventions
apiRoutes.get('/EVChargingPoints', (req: Request, res: Response) => {
  req.url = '/ev-charging-points';
  ltaRouter(req, res, () => {});
});

apiRoutes.get('/EVCBatch', (req: Request, res: Response) => {
  req.url = '/evc-batch';
  ltaRouter(req, res, () => {});
});

apiRoutes.get('/ev-charging-points', (req: Request, res: Response) => {
  req.url = '/ev-charging-points';
  ltaRouter(req, res, () => {});
});

apiRoutes.get('/evc-batch', (req: Request, res: Response) => {
  req.url = '/evc-batch';
  ltaRouter(req, res, () => {});
});

// Dual mounting for root rewrite and /api prefix
app.use('/api', apiRoutes);
app.use('/', apiRoutes);

// Root fallback for /api
app.get('/api', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    message: 'EVChargingX API Gateway',
    timestamp: new Date().toISOString(),
  });
});

// Vercel Serverless Function entrypoint export
export default function handler(req: any, res: any) {
  return app(req, res);
}

export { app };
