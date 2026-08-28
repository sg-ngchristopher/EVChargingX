import express, { Request, Response } from 'express';
import ltaRouter from './lta';
import onemapRouter from './onemap';
import statusRouter from './status';

const app = express();
app.use(express.json());

// Mount sub-routers
app.use('/lta', ltaRouter);
app.use('/onemap', onemapRouter);
app.use('/', statusRouter);

// Direct aliases matching LTA service naming conventions
app.get('/EVChargingPoints', (req: Request, res: Response) => {
  req.url = '/ev-charging-points';
  ltaRouter(req, res, () => {});
});

app.get('/EVCBatch', (req: Request, res: Response) => {
  req.url = '/evc-batch';
  ltaRouter(req, res, () => {});
});

app.get('/ev-charging-points', (req: Request, res: Response) => {
  req.url = '/ev-charging-points';
  ltaRouter(req, res, () => {});
});

app.get('/evc-batch', (req: Request, res: Response) => {
  req.url = '/evc-batch';
  ltaRouter(req, res, () => {});
});

export default app;
