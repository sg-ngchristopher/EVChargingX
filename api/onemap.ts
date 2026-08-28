import { Request, Response, Router } from 'express';

const router = Router();

const ONEMAP_BASE_URL = 'https://www.onemap.gov.sg/api';

/**
 * Helper to get active OneMap token or API key if configured
 */
function getOneMapCredential(): string | null {
  return (
    process.env.ONEMAP_API_KEY ||
    process.env.ONEMAP_TOKEN ||
    null
  );
}

/**
 * POST /api/onemap/token
 * Obtains an access token using ONEMAP_EMAIL and ONEMAP_PASSWORD
 */
router.post('/token', async (_req: Request, res: Response) => {
  const email = process.env.ONEMAP_EMAIL;
  const password = process.env.ONEMAP_PASSWORD;

  if (!email || !password) {
    return res.status(500).json({ error: 'credential not configured' });
  }

  try {
    const response = await fetch(`${ONEMAP_BASE_URL}/auth/post/getToken`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        error: 'Failed to authenticate with OneMap API',
        details: errorText,
      });
    }

    const data = await response.json();
    res.json(data);
  } catch (error: any) {
    console.error('Error authenticating with OneMap:', error);
    res.status(502).json({ error: 'OneMap token endpoint error', details: error.message });
  }
});

/**
 * GET /api/onemap/search
 * Proxies search query to OneMap Search API
 */
router.get('/search', async (req: Request, res: Response) => {
  const query = req.query.searchVal as string;
  if (!query) {
    return res.status(400).json({ error: 'Missing searchVal query parameter' });
  }

  const returnGeom = req.query.returnGeom || 'Y';
  const getAddrDetails = req.query.getAddrDetails || 'Y';
  const pageNum = req.query.pageNum || '1';

  const token = getOneMapCredential();
  const headers: Record<string, string> = {
    accept: 'application/json',
  };

  if (token) {
    headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
  }

  try {
    const url = `${ONEMAP_BASE_URL}/common/elastic/search?searchVal=${encodeURIComponent(
      query
    )}&returnGeom=${returnGeom}&getAddrDetails=${getAddrDetails}&pageNum=${pageNum}`;

    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        error: 'OneMap API responded with error',
        details: errorText,
      });
    }

    const data = await response.json();
    res.json(data);
  } catch (error: any) {
    console.error('Error proxying OneMap search:', error);
    res.status(502).json({ error: 'Failed to query OneMap search service', details: error.message });
  }
});

/**
 * GET /api/onemap/revgeocode
 * Reverse geocodes coordinates (lat, lng) to Singapore address
 */
router.get('/revgeocode', async (req: Request, res: Response) => {
  const lat = req.query.latitude || req.query.lat;
  const lng = req.query.longitude || req.query.lng;

  if (!lat || !lng) {
    return res.status(400).json({ error: 'Missing latitude or longitude parameter' });
  }

  const token = getOneMapCredential();
  const headers: Record<string, string> = {
    accept: 'application/json',
  };

  if (token) {
    headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
  }

  try {
    const url = `${ONEMAP_BASE_URL}/public/revgeocodex?location=${lat},${lng}&buffer=100&addressType=All&otherFeatures=Y`;
    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        error: 'OneMap reverse geocoding failed',
        details: errorText,
      });
    }

    const data = await response.json();
    res.json(data);
  } catch (error: any) {
    console.error('Error during OneMap reverse geocode:', error);
    res.status(502).json({ error: 'Reverse geocode service error', details: error.message });
  }
});

/**
 * GET /api/onemap/protected-data
 * Strictly requires ONEMAP_API_KEY or ONEMAP_TOKEN
 */
router.get('/protected-data', async (_req: Request, res: Response) => {
  const token = getOneMapCredential();
  if (!token) {
    return res.status(500).json({ error: 'credential not configured' });
  }

  res.json({ status: 'authenticated', provider: 'OneMap SG' });
});

export default router;
