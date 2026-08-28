import { Request, Response, Router } from 'express';

const router = Router();

/**
 * GET /api/status
 * Returns connectivity status and configuration flags (without exposing secrets)
 */
router.get('/status', (_req: Request, res: Response) => {
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

  res.json({
    status: 'online',
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
  });
});

export default router;
