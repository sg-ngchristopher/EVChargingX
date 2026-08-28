import express, { Request, Response, Router } from 'express';
import ltaRouter from './lta';
import onemapRouter from './onemap';
import statusRouter from './status';

const app = express();
app.use(express.json());

const apiRoutes = Router();

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

// Vercel Serverless Function entrypoint export
export default function handler(req: any, res: any) {
  return app(req, res);
}

export { app };
