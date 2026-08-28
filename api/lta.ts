import { Request, Response, Router } from 'express';

const router = Router();

const LTA_BASE_URL = 'https://datamall2.mytransport.sg/ltaodataservice';

/**
 * Realistic fallback sample dataset for Singapore EV Charging Points
 * Used when LTA_DATAMALL_API_KEY is not defined in process.env
 */
const SAMPLE_LTA_EV_CHARGING_POINTS = [
  {
    StationID: 'SP-MBS-001',
    Name: 'Marina Bay Sands - Basement 3 South Carpark',
    LocationDescription: '10 Bayfront Ave, Basement 3 Pillar E12, Singapore 018956',
    Address: '10 Bayfront Ave',
    PostalCode: '018956',
    Operator: 'SP Mobility',
    Latitude: 1.2838,
    Longitude: 103.8598,
    ChargingBays: 8,
    AvailableBays: 6,
    Power: 120,
    PlugType: 'CCS2 / Type 2',
    Price: 0.69,
    OperatingHours: '24 Hours',
    Status: 'AVAILABLE',
  },
  {
    StationID: 'SHELL-MBFC-002',
    Name: 'Marina Bay Financial Centre (MBFC) Tower 1',
    LocationDescription: '8 Marina Boulevard, B2 Carpark, Singapore 018981',
    Address: '8 Marina Boulevard',
    PostalCode: '018981',
    Operator: 'Shell Recharge',
    Latitude: 1.2801,
    Longitude: 103.8542,
    ChargingBays: 4,
    AvailableBays: 2,
    Power: 60,
    PlugType: 'CCS2 / Type 2',
    Price: 0.68,
    OperatingHours: '6:00 AM - 12:00 AM',
    Status: 'AVAILABLE',
  },
  {
    StationID: 'CDG-SUNTEC-003',
    Name: 'Suntec City Mall - Green Zone B1',
    LocationDescription: '3 Temasek Boulevard, B1 Green Zone, Singapore 039593',
    Address: '3 Temasek Boulevard',
    PostalCode: '039593',
    Operator: 'CDG ENGIE',
    Latitude: 1.2934,
    Longitude: 103.8572,
    ChargingBays: 10,
    AvailableBays: 7,
    Power: 120,
    PlugType: 'CCS2 / Type 2',
    Price: 0.65,
    OperatingHours: '24 Hours',
    Status: 'AVAILABLE',
  },
  {
    StationID: 'CP-RAFFLES-004',
    Name: 'Raffles City Shopping Centre B2',
    LocationDescription: '252 North Bridge Rd, B2 Carpark Lobby A, Singapore 179103',
    Address: '252 North Bridge Rd',
    PostalCode: '179103',
    Operator: 'Charge+',
    Latitude: 1.2938,
    Longitude: 103.8530,
    ChargingBays: 6,
    AvailableBays: 4,
    Power: 60,
    PlugType: 'CCS2 / Type 2',
    Price: 0.66,
    OperatingHours: '24 Hours',
    Status: 'AVAILABLE',
  },
  {
    StationID: 'SP-ION-005',
    Name: 'ION Orchard - B5 Carpark Zone A',
    LocationDescription: '2 Orchard Turn, B5 Carpark Lobby, Singapore 238801',
    Address: '2 Orchard Turn',
    PostalCode: '238801',
    Operator: 'SP Mobility',
    Latitude: 1.3042,
    Longitude: 103.8318,
    ChargingBays: 6,
    AvailableBays: 5,
    Power: 100,
    PlugType: 'CCS2 / Type 2',
    Price: 0.69,
    OperatingHours: '24 Hours',
    Status: 'AVAILABLE',
  },
  {
    StationID: 'CDG-TAKASHIMAYA-006',
    Name: 'Ngee Ann City (Takashimaya) Carpark B3',
    LocationDescription: '391 Orchard Road, B3 Carpark, Singapore 238872',
    Address: '391 Orchard Road',
    PostalCode: '238872',
    Operator: 'CDG ENGIE',
    Latitude: 1.3023,
    Longitude: 103.8354,
    ChargingBays: 6,
    AvailableBays: 3,
    Power: 50,
    PlugType: 'CCS2 / Type 2',
    Price: 0.65,
    OperatingHours: '7:00 AM - 11:30 PM',
    Status: 'AVAILABLE',
  },
  {
    StationID: 'SP-OTH-007',
    Name: 'Our Tampines Hub (OTH) B1 Multi-Storey',
    LocationDescription: '1 Tampines Walk, B1 Carpark Lot 120-128, Singapore 528523',
    Address: '1 Tampines Walk',
    PostalCode: '528523',
    Operator: 'SP Mobility',
    Latitude: 1.3534,
    Longitude: 103.9398,
    ChargingBays: 8,
    AvailableBays: 6,
    Power: 60,
    PlugType: 'CCS2 / Type 2',
    Price: 0.65,
    OperatingHours: '24 Hours',
    Status: 'AVAILABLE',
  },
  {
    StationID: 'CDG-TAMPINES81-008',
    Name: 'HDB MSCP Blk 823A Tampines St 81',
    LocationDescription: 'Blk 823A Tampines Street 81, Deck 1B, Singapore 521823',
    Address: 'Blk 823A Tampines Street 81',
    PostalCode: '521823',
    Operator: 'CDG ENGIE',
    Latitude: 1.3508,
    Longitude: 103.9372,
    ChargingBays: 4,
    AvailableBays: 3,
    Power: 22,
    PlugType: 'Type 2',
    Price: 0.54,
    OperatingHours: '24 Hours',
    Status: 'AVAILABLE',
  },
  {
    StationID: 'CP-TAMPMALL-009',
    Name: 'Tampines Mall - Level 4 Carpark',
    LocationDescription: '4 Tampines Central 5, Level 4 Row C, Singapore 529510',
    Address: '4 Tampines Central 5',
    PostalCode: '529510',
    Operator: 'Charge+',
    Latitude: 1.3528,
    Longitude: 103.9449,
    ChargingBays: 4,
    AvailableBays: 2,
    Power: 60,
    PlugType: 'CCS2 / Type 2',
    Price: 0.67,
    OperatingHours: '10:00 AM - 10:30 PM',
    Status: 'AVAILABLE',
  },
  {
    StationID: 'SP-JEWEL-010',
    Name: 'Jewel Changi Airport - B3 Carpark North',
    LocationDescription: '78 Airport Boulevard, B3 Carpark North Lobby, Singapore 819666',
    Address: '78 Airport Boulevard',
    PostalCode: '819666',
    Operator: 'SP Mobility',
    Latitude: 1.3601,
    Longitude: 103.9895,
    ChargingBays: 12,
    AvailableBays: 9,
    Power: 150,
    PlugType: 'CCS2 / Type 2',
    Price: 0.70,
    OperatingHours: '24 Hours',
    Status: 'AVAILABLE',
  },
  {
    StationID: 'SP-JURONGPOINT-011',
    Name: 'Jurong Point - B2 Carpark Zone JP2',
    LocationDescription: '1 Jurong West Central 2, B2 Carpark JP2, Singapore 648886',
    Address: '1 Jurong West Central 2',
    PostalCode: '648886',
    Operator: 'SP Mobility',
    Latitude: 1.3406,
    Longitude: 103.7061,
    ChargingBays: 8,
    AvailableBays: 5,
    Power: 100,
    PlugType: 'CCS2 / Type 2',
    Price: 0.65,
    OperatingHours: '24 Hours',
    Status: 'AVAILABLE',
  },
  {
    StationID: 'CP-FUSIONOPOLIS-012',
    Name: 'One-North Fusionopolis One B3',
    LocationDescription: '1 Fusionopolis Way, B3 Carpark Pillar C14, Singapore 138632',
    Address: '1 Fusionopolis Way',
    PostalCode: '138632',
    Operator: 'Charge+',
    Latitude: 1.2996,
    Longitude: 103.7876,
    ChargingBays: 6,
    AvailableBays: 4,
    Power: 120,
    PlugType: 'CCS2 / Type 2',
    Price: 0.67,
    OperatingHours: '24 Hours',
    Status: 'AVAILABLE',
  },
  {
    StationID: 'SP-JEM-013',
    Name: 'JEM Shopping Mall - B2 Carpark',
    LocationDescription: '50 Jurong Gateway Road, B2 Lot 45-48, Singapore 608549',
    Address: '50 Jurong Gateway Road',
    PostalCode: '608549',
    Operator: 'SP Mobility',
    Latitude: 1.3333,
    Longitude: 103.7433,
    ChargingBays: 6,
    AvailableBays: 4,
    Power: 60,
    PlugType: 'CCS2 / Type 2',
    Price: 0.66,
    OperatingHours: '24 Hours',
    Status: 'AVAILABLE',
  },
  {
    StationID: 'SP-AMKHUB-014',
    Name: 'AMK Hub - Basement 3 Carpark',
    LocationDescription: '53 Ang Mo Kio Ave 3, B3 Carpark Pillar G4, Singapore 569933',
    Address: '53 Ang Mo Kio Ave 3',
    PostalCode: '569933',
    Operator: 'SP Mobility',
    Latitude: 1.3697,
    Longitude: 103.8483,
    ChargingBays: 6,
    AvailableBays: 4,
    Power: 100,
    PlugType: 'CCS2 / Type 2',
    Price: 0.65,
    OperatingHours: '24 Hours',
    Status: 'AVAILABLE',
  },
  {
    StationID: 'SP-WOODLANDS-015',
    Name: 'Woodlands Civic Centre B1 Carpark',
    LocationDescription: '900 South Woodlands Drive, B1 Lot 22-26, Singapore 730900',
    Address: '900 South Woodlands Drive',
    PostalCode: '730900',
    Operator: 'SP Mobility',
    Latitude: 1.4363,
    Longitude: 103.7867,
    ChargingBays: 6,
    AvailableBays: 5,
    Power: 100,
    PlugType: 'CCS2 / Type 2',
    Price: 0.65,
    OperatingHours: '24 Hours',
    Status: 'AVAILABLE',
  },
  {
    StationID: 'SP-TOAPAYOH-016',
    Name: 'HDB Hub Toa Payoh - Basement 2 Carpark',
    LocationDescription: '480 Lorong 6 Toa Payoh, B2 Carpark Pillar D5, Singapore 310480',
    Address: '480 Lorong 6 Toa Payoh',
    PostalCode: '310480',
    Operator: 'SP Mobility',
    Latitude: 1.3330,
    Longitude: 103.8476,
    ChargingBays: 8,
    AvailableBays: 6,
    Power: 120,
    PlugType: 'CCS2 / Type 2',
    Price: 0.65,
    OperatingHours: '24 Hours',
    Status: 'AVAILABLE',
  },
  {
    StationID: 'CP-VIVOCITY-017',
    Name: 'VivoCity - B2 Carpark Yellow Zone',
    LocationDescription: '1 HarbourFront Walk, B2 Yellow Zone Lobby C, Singapore 098585',
    Address: '1 HarbourFront Walk',
    PostalCode: '098585',
    Operator: 'Charge+',
    Latitude: 1.2646,
    Longitude: 103.8220,
    ChargingBays: 8,
    AvailableBays: 5,
    Power: 120,
    PlugType: 'CCS2 / Type 2',
    Price: 0.68,
    OperatingHours: '24 Hours',
    Status: 'AVAILABLE',
  },
  {
    StationID: 'SP-PLQ-018',
    Name: 'Paya Lebar Quarter (PLQ Mall) B2 Carpark',
    LocationDescription: '10 Paya Lebar Road, B2 Lot 72-78, Singapore 409057',
    Address: '10 Paya Lebar Road',
    PostalCode: '409057',
    Operator: 'SP Mobility',
    Latitude: 1.3176,
    Longitude: 103.8926,
    ChargingBays: 6,
    AvailableBays: 4,
    Power: 100,
    PlugType: 'CCS2 / Type 2',
    Price: 0.66,
    OperatingHours: '24 Hours',
    Status: 'AVAILABLE',
  },
];

/**
 * Helper to fetch LTA DataMall endpoints with AccountKey authentication or graceful mock fallback
 */
async function fetchLTAData(endpoint: string, queryParams: Record<string, string | number> = {}) {
  const apiKey = process.env.LTA_DATAMALL_API_KEY || process.env.DATAMALL_API_KEY || process.env.LTA_API_KEY;

  if (!apiKey) {
    console.warn(`[LTA DataMall API] LTA_DATAMALL_API_KEY is not defined in process.env. Providing realistic sample data for ${endpoint}.`);
    return {
      'odata.metadata': `${LTA_BASE_URL}/$metadata#${endpoint}`,
      value: SAMPLE_LTA_EV_CHARGING_POINTS,
      _fallback: true,
    };
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
    console.warn(`[LTA DataMall API] Request failed with HTTP ${response.status}: ${errorText}. Falling back to sample data.`);
    return {
      'odata.metadata': `${LTA_BASE_URL}/$metadata#${endpoint}`,
      value: SAMPLE_LTA_EV_CHARGING_POINTS,
      _fallback: true,
    };
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
    console.warn('[LTA DataMall API] Error fetching EVChargingPoints, sending sample dataset fallback:', error);
    res.json({
      'odata.metadata': `${LTA_BASE_URL}/$metadata#EVChargingPoints`,
      value: SAMPLE_LTA_EV_CHARGING_POINTS,
      _fallback: true,
    });
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
    console.warn('[LTA DataMall API] Error fetching EVCBatch, sending sample dataset fallback:', error);
    res.json({
      'odata.metadata': `${LTA_BASE_URL}/$metadata#EVCBatch`,
      value: SAMPLE_LTA_EV_CHARGING_POINTS,
      _fallback: true,
    });
  }
});

/**
 * GET /api/lta/ev-stations-all
 * Fetches all pages of EV charging points or returns the full realistic dataset
 */
router.get('/ev-stations-all', async (_req: Request, res: Response) => {
  try {
    const apiKey = process.env.LTA_DATAMALL_API_KEY || process.env.DATAMALL_API_KEY || process.env.LTA_API_KEY;
    if (!apiKey) {
      console.warn('[LTA DataMall API] LTA_DATAMALL_API_KEY not configured. Returning full realistic Singapore EV station grid.');
      return res.json({
        source: 'SAMPLE_FALLBACK_GRID',
        totalCount: SAMPLE_LTA_EV_CHARGING_POINTS.length,
        timestamp: new Date().toISOString(),
        value: SAMPLE_LTA_EV_CHARGING_POINTS,
      });
    }

    let allItems: any[] = [];
    let skip = 0;
    let hasMore = true;

    // Fetch pages (up to 500 items per request)
    while (hasMore && skip < 5000) {
      const data = await fetchLTAData('EVChargingPoints', { $skip: skip });
      const items = data.value || [];
      allItems = allItems.concat(items);

      if (items.length < 500 || data._fallback) {
        hasMore = false;
      } else {
        skip += 500;
      }
    }

    res.json({
      source: 'LTA_DATAMALL_LIVE',
      totalCount: allItems.length,
      timestamp: new Date().toISOString(),
      value: allItems.length > 0 ? allItems : SAMPLE_LTA_EV_CHARGING_POINTS,
    });
  } catch (error: any) {
    console.warn('[LTA DataMall API] Error in ev-stations-all, returning sample stations:', error);
    res.json({
      source: 'SAMPLE_FALLBACK_GRID',
      totalCount: SAMPLE_LTA_EV_CHARGING_POINTS.length,
      timestamp: new Date().toISOString(),
      value: SAMPLE_LTA_EV_CHARGING_POINTS,
    });
  }
});

export default router;
