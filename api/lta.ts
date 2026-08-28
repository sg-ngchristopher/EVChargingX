import { Request, Response, Router } from 'express';

const router = Router();

const LTA_BASE_URL = 'https://datamall2.mytransport.sg/ltaodataservice';

/**
 * Helper to fetch LTA DataMall endpoints with AccountKey authentication
 */
async function fetchLTAData(endpoint: string, queryParams: Record<string, string | number> = {}) {
  const apiKey = process.env.LTA_DATAMALL_API_KEY || process.env.DATAMALL_API_KEY || process.env.LTA_API_KEY;

  if (!apiKey) {
    throw new Error('CREDENTIAL_NOT_CONFIGURED');
  }

  const url = new URL(`${LTA_BASE_URL}/${endpoint}`);
  Object.entries(queryParams).forEach(([k, v]) => {
    if (v !== undefined && v !== null) {
      url.searchParams.set(k, String(v));
    }
  });

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      AccountKey: apiKey,
      accept: 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`LTA DataMall API responded with HTTP ${response.status}: ${errorText}`);
  }

  return await response.json();
}

/**
 * GET /api/lta/ev-charging-points
 * Direct proxy to https://datamall2.mytransport.sg/ltaodataservice/EVChargingPoints
 */
router.get('/ev-charging-points', async (req: Request, res: Response) => {
  try {
    const skip = req.query.$skip ? Number(req.query.$skip) : 0;
    const data = await fetchLTAData('EVChargingPoints', { $skip: skip });
    res.json(data);
  } catch (error: any) {
    if (error.message === 'CREDENTIAL_NOT_CONFIGURED') {
      return res.status(500).json({ error: 'credential not configured' });
    }
    console.error('Error fetching LTA EVChargingPoints:', error);
    res.status(502).json({ error: 'Failed to fetch EV Charging Points from LTA DataMall', details: error.message });
  }
});

/**
 * GET /api/lta/evc-batch
 * Direct proxy to https://datamall2.mytransport.sg/ltaodataservice/EVCBatch
 */
router.get('/evc-batch', async (req: Request, res: Response) => {
  try {
    const skip = req.query.$skip ? Number(req.query.$skip) : 0;
    const data = await fetchLTAData('EVCBatch', { $skip: skip });
    res.json(data);
  } catch (error: any) {
    if (error.message === 'CREDENTIAL_NOT_CONFIGURED') {
      return res.status(500).json({ error: 'credential not configured' });
    }
    console.error('Error fetching LTA EVCBatch:', error);
    res.status(502).json({ error: 'Failed to fetch EVCBatch from LTA DataMall', details: error.message });
  }
});

/**
 * GET /api/lta/ev-stations-all
 * Fetches all pages of EV charging points and normalizes them for the UI
 */
router.get('/ev-stations-all', async (_req: Request, res: Response) => {
  try {
    const apiKey = process.env.LTA_DATAMALL_API_KEY || process.env.DATAMALL_API_KEY || process.env.LTA_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'credential not configured' });
    }

    let allItems: any[] = [];
    let skip = 0;
    let hasMore = true;

    // Fetch pages (up to 500 items per request)
    while (hasMore && skip < 5000) {
      const data = await fetchLTAData('EVChargingPoints', { $skip: skip });
      const items = data.value || [];
      allItems = allItems.concat(items);

      if (items.length < 500) {
        hasMore = false;
      } else {
        skip += 500;
      }
    }

    res.json({
      source: 'LTA_DATAMALL_LIVE',
      totalCount: allItems.length,
      timestamp: new Date().toISOString(),
      value: allItems,
    });
  } catch (error: any) {
    if (error.message === 'CREDENTIAL_NOT_CONFIGURED') {
      return res.status(500).json({ error: 'credential not configured' });
    }
    console.error('Error fetching full LTA EV points list:', error);
    res.status(502).json({ error: 'Failed to fetch full EV Charging Points list', details: error.message });
  }
});

export default router;
