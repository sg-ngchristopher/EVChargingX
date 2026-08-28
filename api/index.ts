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

// Mount on both root and /api prefixes for full Vercel Serverless and Express compatibility
app.use('/api', apiRoutes);
app.use('/', apiRoutes);

export default app;
