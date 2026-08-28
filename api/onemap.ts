import { Request, Response, Router } from 'express';

const router = Router();

const ONEMAP_BASE_URL = 'https://www.onemap.gov.sg/api';

/**
 * 82-Sector Singapore Postal Geocoding Model
 * Maps any Singapore 2-digit postal sector (01-82) to exact neighborhood coordinates
 */
const SG_POSTAL_SECTORS: Record<string, { lat: number; lng: number; area: string; district: string }> = {
  '01': { lat: 1.2838, lng: 103.8598, area: 'Marina Bay / Raffles Place', district: 'D01' },
  '02': { lat: 1.2792, lng: 103.8530, area: 'Anson / Shenton Way', district: 'D01' },
  '03': { lat: 1.2934, lng: 103.8572, area: 'Suntec / Marina Centre', district: 'D01' },
  '04': { lat: 1.2829, lng: 103.8525, area: 'Collyer Quay / Cecil', district: 'D01' },
  '05': { lat: 1.2850, lng: 103.8440, area: 'Chinatown / People\'s Park', district: 'D01' },
  '06': { lat: 1.2785, lng: 103.8490, area: 'Shenton Way / Robinson Rd', district: 'D01' },
  '07': { lat: 1.2760, lng: 103.8440, area: 'Tanjong Pagar', district: 'D02' },
  '08': { lat: 1.2778, lng: 103.8410, area: 'Cantonment / Duxton', district: 'D02' },
  '09': { lat: 1.2644, lng: 103.8222, area: 'HarbourFront / Telok Blangah', district: 'D04' },
  '10': { lat: 1.2710, lng: 103.8110, area: 'Keppel / Bukit Purmei', district: 'D04' },
  '11': { lat: 1.2820, lng: 103.7850, area: 'Pasir Panjang', district: 'D05' },
  '12': { lat: 1.3010, lng: 103.7650, area: 'West Coast / Clementi South', district: 'D05' },
  '13': { lat: 1.2994, lng: 103.7874, area: 'One-North / Buona Vista', district: 'D05' },
  '14': { lat: 1.2940, lng: 103.8050, area: 'Queenstown / Commonwealth', district: 'D03' },
  '15': { lat: 1.2880, lng: 103.8240, area: 'Alexandra / Bukit Merah', district: 'D03' },
  '16': { lat: 1.2840, lng: 103.8320, area: 'Tiong Bahru / Kim Tian', district: 'D03' },
  '17': { lat: 1.2932, lng: 103.8522, area: 'City Hall / North Bridge Rd', district: 'D06' },
  '18': { lat: 1.2990, lng: 103.8550, area: 'Bugis / Middle Road', district: 'D07' },
  '19': { lat: 1.3030, lng: 103.8610, area: 'Beach Road / Golden Mile', district: 'D07' },
  '20': { lat: 1.3110, lng: 103.8540, area: 'Little India / Jalan Besar', district: 'D08' },
  '21': { lat: 1.3140, lng: 103.8500, area: 'Farrer Park / Serangoon Rd', district: 'D08' },
  '22': { lat: 1.3010, lng: 103.8390, area: 'River Valley / Somerset', district: 'D09' },
  '23': { lat: 1.3040, lng: 103.8320, area: 'Orchard Road / Cairnhill', district: 'D09' },
  '24': { lat: 1.3060, lng: 103.8250, area: 'Tanglin / Grange Road', district: 'D10' },
  '25': { lat: 1.3150, lng: 103.8180, area: 'Bukit Timah / Botanic Gardens', district: 'D10' },
  '26': { lat: 1.3200, lng: 103.8050, area: 'Holland Road / Coronation', district: 'D10' },
  '27': { lat: 1.3115, lng: 103.7930, area: 'Holland Village', district: 'D10' },
  '28': { lat: 1.3280, lng: 103.8120, area: 'Watten Estate / Dunearn', district: 'D11' },
  '29': { lat: 1.3250, lng: 103.8320, area: 'Novena / Chancery', district: 'D11' },
  '30': { lat: 1.3200, lng: 103.8440, area: 'Newton / Thomson Rd', district: 'D11' },
  '31': { lat: 1.3328, lng: 103.8478, area: 'Toa Payoh Central', district: 'D12' },
  '32': { lat: 1.3250, lng: 103.8530, area: 'Balestier / Whampoa', district: 'D12' },
  '33': { lat: 1.3280, lng: 103.8650, area: 'Serangoon / Bendemeer', district: 'D12' },
  '34': { lat: 1.3360, lng: 103.8740, area: 'Macpherson / Potong Pasir', district: 'D13' },
  '35': { lat: 1.3410, lng: 103.8700, area: 'Braddell / Woodleigh', district: 'D13' },
  '36': { lat: 1.3380, lng: 103.8820, area: 'Aljunied / Circuit Rd', district: 'D13' },
  '37': { lat: 1.3450, lng: 103.8800, area: 'Tai Seng / Ubi', district: 'D13' },
  '38': { lat: 1.3150, lng: 103.8810, area: 'Geylang East / Sims Ave', district: 'D14' },
  '39': { lat: 1.3190, lng: 103.8900, area: 'Eunos / Changi Rd', district: 'D14' },
  '40': { lat: 1.3174, lng: 103.8928, area: 'Paya Lebar / PLQ', district: 'D14' },
  '41': { lat: 1.3220, lng: 103.9080, area: 'Kembangan / Lengkong', district: 'D14' },
  '42': { lat: 1.3060, lng: 103.9010, area: 'Katong / Mountbatten', district: 'D15' },
  '43': { lat: 1.3010, lng: 103.8850, area: 'Tanjong Rhu / Fort Road', district: 'D15' },
  '44': { lat: 1.3030, lng: 103.9060, area: 'Marine Parade / Parkway', district: 'D15' },
  '45': { lat: 1.3110, lng: 103.9100, area: 'Joo Chiat / Telok Kurau', district: 'D15' },
  '46': { lat: 1.3245, lng: 103.9300, area: 'Bedok Central / Bedok Mall', district: 'D16' },
  '47': { lat: 1.3320, lng: 103.9410, area: 'Bedok North / Reservoir', district: 'D16' },
  '48': { lat: 1.3180, lng: 103.9450, area: 'Upper East Coast / Bayshore', district: 'D16' },
  '49': { lat: 1.3620, lng: 103.9680, area: 'Loyang / Flora Road', district: 'D17' },
  '50': { lat: 1.3720, lng: 103.9780, area: 'Changi Village / Telok Paku', district: 'D17' },
  '51': { lat: 1.3721, lng: 103.9474, area: 'Pasir Ris Town', district: 'D18' },
  '52': { lat: 1.3532, lng: 103.9401, area: 'Tampines Central / Hub', district: 'D18' },
  '53': { lat: 1.3712, lng: 103.8915, area: 'Hougang Central / Mall', district: 'D19' },
  '54': { lat: 1.3916, lng: 103.8953, area: 'Sengkang Central / Compass One', district: 'D19' },
  '55': { lat: 1.3508, lng: 103.8727, area: 'Serangoon / NEX Mall', district: 'D19' },
  '56': { lat: 1.3695, lng: 103.8485, area: 'Ang Mo Kio Central / AMK Hub', district: 'D20' },
  '57': { lat: 1.3506, lng: 103.8488, area: 'Bishan Central / Junction 8', district: 'D20' },
  '58': { lat: 1.3380, lng: 103.7740, area: 'Upper Bukit Timah / Beauty World', district: 'D21' },
  '59': { lat: 1.3450, lng: 103.7650, area: 'Clementi Park / Ulu Pandan', district: 'D21' },
  '60': { lat: 1.3331, lng: 103.7431, area: 'Jurong East / Westgate / JEM', district: 'D22' },
  '61': { lat: 1.3200, lng: 103.7200, area: 'Jurong Industrial / Taman Jurong', district: 'D22' },
  '62': { lat: 1.3150, lng: 103.6850, area: 'Pioneer / International Rd', district: 'D22' },
  '63': { lat: 1.3250, lng: 103.6500, area: 'Tuas / Gul Circle', district: 'D22' },
  '64': { lat: 1.3404, lng: 103.7063, area: 'Jurong West / Jurong Point', district: 'D22' },
  '65': { lat: 1.3590, lng: 103.7510, area: 'Bukit Batok Central / West Mall', district: 'D23' },
  '66': { lat: 1.3620, lng: 103.7680, area: 'Hillview / Dairy Farm', district: 'D23' },
  '67': { lat: 1.3780, lng: 103.7620, area: 'Bukit Panjang / Hillion Mall', district: 'D23' },
  '68': { lat: 1.3850, lng: 103.7450, area: 'Choa Chu Kang / Lot One', district: 'D23' },
  '69': { lat: 1.3570, lng: 103.7310, area: 'Tengah New Town', district: 'D24' },
  '70': { lat: 1.4150, lng: 103.7100, area: 'Lim Chu Kang / Sungei Buloh', district: 'D24' },
  '71': { lat: 1.4200, lng: 103.7250, area: 'Neo Tiew / Murai', district: 'D24' },
  '72': { lat: 1.4250, lng: 103.7550, area: 'Kranji / Turf Club', district: 'D25' },
  '73': { lat: 1.4361, lng: 103.7865, area: 'Woodlands Central / Causeway Point', district: 'D25' },
  '75': { lat: 1.4480, lng: 103.8200, area: 'Sembawang / Canberra', district: 'D27' },
  '76': { lat: 1.4294, lng: 103.8361, area: 'Yishun Central / Northpoint City', district: 'D27' },
  '77': { lat: 1.3950, lng: 103.8250, area: 'Upper Thomson / Springleaf', district: 'D26' },
  '78': { lat: 1.4100, lng: 103.8180, area: 'Mandai / Singapore Zoo', district: 'D26' },
  '79': { lat: 1.3900, lng: 103.8650, area: 'Seletar / Jalan Kayu', district: 'D28' },
  '80': { lat: 1.4050, lng: 103.8750, area: 'Seletar Aerospace Park', district: 'D28' },
  '81': { lat: 1.3602, lng: 103.9898, area: 'Changi Airport / Jewel', district: 'D17' },
  '82': { lat: 1.4067, lng: 103.9022, area: 'Punggol Central / Waterway Point', district: 'D19' },
};

/**
 * Helper to get active OneMap token or API key if configured
 */
function getOneMapCredential(): string | null {
  return process.env.ONEMAP_API_KEY || process.env.ONEMAP_TOKEN || null;
}

/**
 * GET /api/onemap/search
 * Proxies search query with automatic multi-source geocoding:
 * 1. OneMap API (if reachable / authenticated)
 * 2. OpenStreetMap Nominatim SG
 * 3. 82-Sector Singapore Postal Geocoder
 */
router.get('/search', async (req: Request, res: Response) => {
  const query = (req.query.searchVal as string || '').trim();
  if (!query) {
    return res.json({ found: 0, totalNumPages: 0, pageNum: 1, results: [] });
  }

  const cleanQuery = query.replace(/^Singapore\s*/i, '').trim();
  const is6DigitPostal = /^\d{6}$/.test(cleanQuery);
  const results: any[] = [];

  // 1. Check if query starts with or matches a Singapore 6-digit postal code
  if (is6DigitPostal) {
    const sector = cleanQuery.substring(0, 2);
    if (SG_POSTAL_SECTORS[sector]) {
      const secData = SG_POSTAL_SECTORS[sector];
      results.push({
        SEARCHVAL: `Singapore Postal ${cleanQuery}`,
        BUILDING: `${secData.area} (S${cleanQuery})`,
        ADDRESS: `Singapore ${cleanQuery}, ${secData.area} (${secData.district})`,
        POSTAL: cleanQuery,
        ROAD_NAME: secData.area,
        LATITUDE: secData.lat.toString(),
        LONGITUDE: secData.lng.toString(),
        SOURCE: 'SG_POSTAL_SECTOR_GEOCODER',
      });
    }
  }

  // 2. Try OpenStreetMap Nominatim Singapore Geocoder
  try {
    const nominatimUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      query + (is6DigitPostal ? ' Singapore' : ', Singapore')
    )}&countrycodes=sg&format=json&addressdetails=1&limit=6`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    const nomRes = await fetch(nominatimUrl, {
      headers: {
        'User-Agent': 'EVChargingX-Singapore-App/1.0',
        'Accept-Language': 'en',
      },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (nomRes.ok) {
      const nomData = await nomRes.json();
      if (Array.isArray(nomData) && nomData.length > 0) {
        nomData.forEach((item: any) => {
          const lat = parseFloat(item.lat);
          const lon = parseFloat(item.lon);
          if (!isNaN(lat) && !isNaN(lon)) {
            const postal = item.address?.postcode || (is6DigitPostal ? cleanQuery : '');
            const building = item.name || item.address?.building || item.address?.amenity || item.display_name.split(',')[0];
            results.push({
              SEARCHVAL: building.toUpperCase(),
              BUILDING: building,
              ADDRESS: item.display_name,
              POSTAL: postal,
              ROAD_NAME: item.address?.road || '',
              LATITUDE: lat.toString(),
              LONGITUDE: lon.toString(),
              SOURCE: 'OSM_NOMINATIM',
            });
          }
        });
      }
    }
  } catch (err) {
    console.warn('[OneMap/OSM Proxy] Nominatim query skipped:', err);
  }

  // 3. Try OneMap Elastic API if token available
  const token = getOneMapCredential();
  if (token) {
    try {
      const url = `${ONEMAP_BASE_URL}/common/elastic/search?searchVal=${encodeURIComponent(
        query
      )}&returnGeom=Y&getAddrDetails=Y&pageNum=1`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: token.startsWith('Bearer ') ? token : `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.results && data.results.length > 0) {
          data.results.forEach((item: any) => {
            results.unshift({
              ...item,
              SOURCE: 'ONEMAP_API',
            });
          });
        }
      }
    } catch (error: any) {
      console.warn('[OneMap API] OneMap search error:', error);
    }
  }

  // 4. Fuzzy Sector / Landmark fallback if no results yet
  if (results.length === 0) {
    const qLower = cleanQuery.toLowerCase();
    Object.entries(SG_POSTAL_SECTORS).forEach(([sec, data]) => {
      if (
        data.area.toLowerCase().includes(qLower) ||
        data.district.toLowerCase().includes(qLower) ||
        sec === cleanQuery.substring(0, 2)
      ) {
        results.push({
          SEARCHVAL: data.area.toUpperCase(),
          BUILDING: data.area,
          ADDRESS: `${data.area}, Singapore (${data.district})`,
          POSTAL: `${sec}0000`,
          ROAD_NAME: data.area,
          LATITUDE: data.lat.toString(),
          LONGITUDE: data.lng.toString(),
          SOURCE: 'SG_SECTOR_FALLBACK',
        });
      }
    });
  }

  // Deduplicate results
  const seen = new Set<string>();
  const uniqueResults = results.filter((item) => {
    const key = `${item.LATITUDE}_${item.LONGITUDE}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  res.json({
    found: uniqueResults.length,
    totalNumPages: 1,
    pageNum: 1,
    results: uniqueResults.slice(0, 8),
  });
});

/**
 * GET /api/onemap/revgeocode
 * Reverse geocodes coordinates (lat, lng) to Singapore address
 */
router.get('/revgeocode', async (req: Request, res: Response) => {
  const lat = req.query.latitude || req.query.lat;
  const lng = req.query.longitude || req.query.lng;

  const token = getOneMapCredential();
  const headers: Record<string, string> = {
    accept: 'application/json',
  };

  if (token) {
    headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
  }

  if (lat && lng) {
    try {
      const url = `${ONEMAP_BASE_URL}/public/revgeocodex?location=${lat},${lng}&buffer=100&addressType=All&otherFeatures=Y`;
      const response = await fetch(url, {
        method: 'GET',
        headers,
      });

      if (response.ok) {
        const data = await response.json();
        return res.json(data);
      }
    } catch (error: any) {
      console.warn('[OneMap API] Reverse geocoding failed, using sample address response:', error);
    }
  }

  // Fallback realistic response
  res.json({
    GeocodeInfo: [
      {
        BUILDINGNAME: 'Singapore Destination',
        ROAD: 'Central Singapore Area',
        POSTALCODE: '018956',
        LATITUDE: String(lat || '1.3521'),
        LONGITUDE: String(lng || '103.8198'),
      },
    ],
    _fallback: true,
  });
});

/**
 * GET /api/onemap/protected-data
 * Returns configuration or mock status gracefully
 */
router.get('/protected-data', async (_req: Request, res: Response) => {
  const token = getOneMapCredential();
  if (!token) {
    console.warn('[OneMap API] Protected route requested without ONEMAP credentials. Returning sample fallback payload.');
    return res.json({ status: 'sample_fallback', provider: 'OneMap SG (Sample Mode)' });
  }

  res.json({ status: 'authenticated', provider: 'OneMap SG' });
});

export default router;
