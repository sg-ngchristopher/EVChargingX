import { Request, Response, Router } from 'express';

const router = Router();

export const getHealthStatus = () => {
  const hasLtaKey = Boolean(
    process.env.LTA_DATAMALL_API_KEY ||
    process.env.DATAMALL_API_KEY ||
    process.env.LTA_API_KEY
  );

  const hasOneMapKey = Boolean(
    process.env.ONEMAP_API_KEY ||
    process.env.ONEMAP_TOKEN ||
    (process.env.ONEMAP_EMAIL && process.env.ONEMAP_PASSWORD)
  );

  return {
    status: 'ok',
    uptime: typeof process.uptime === 'function' ? process.uptime() : 0,
    timestamp: new Date().toISOString(),
    services: {
      ltaDatamall: {
        configured: hasLtaKey,
        endpoints: [
          'https://datamall2.mytransport.sg/ltaodataservice/EVChargingPoints',
          'https://datamall2.mytransport.sg/ltaodataservice/EVCBatch',
        ],
      },
      oneMap: {
        configured: hasOneMapKey,
        endpoint: 'https://www.onemap.gov.sg/api/',
      },
    },
  };
};

/**
 * GET /health or /api/health
 */
router.get(['/health', '/api/health'], (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    uptime: typeof process.uptime === 'function' ? process.uptime() : 0,
    timestamp: new Date().toISOString(),
  });
});

/**
 * GET /status or /api/status
 */
router.get(['/status', '/api/status'], (_req: Request, res: Response) => {
  res.status(200).json(getHealthStatus());
});

export default router;
