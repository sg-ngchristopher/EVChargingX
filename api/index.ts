import { Router, Request, Response } from 'express';
import ltaRouter from './lta';
import onemapRouter from './onemap';
import statusRouter from './status';

const apiRouter = Router();

// LTA DataMall Endpoints
apiRouter.use('/lta', ltaRouter);

// Direct aliases matching LTA service naming conventions
apiRouter.get('/EVChargingPoints', (req: Request, res: Response) => {
  req.url = '/ev-charging-points';
  ltaRouter(req, res, () => {});
});

apiRouter.get('/EVCBatch', (req: Request, res: Response) => {
  req.url = '/evc-batch';
  ltaRouter(req, res, () => {});
});

apiRouter.get('/ev-charging-points', (req: Request, res: Response) => {
  req.url = '/ev-charging-points';
  ltaRouter(req, res, () => {});
});

apiRouter.get('/evc-batch', (req: Request, res: Response) => {
  req.url = '/evc-batch';
  ltaRouter(req, res, () => {});
});

// OneMap SG Endpoints
apiRouter.use('/onemap', onemapRouter);

// System Status and Health
apiRouter.use('/', statusRouter);

export default apiRouter;
