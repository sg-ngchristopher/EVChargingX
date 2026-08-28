import { ChargingStation, Connector, OperatorName } from '../types';

export interface BackendStatus {
  status: string;
  timestamp: string;
  services: {
    ltaDatamall: {
      configured: boolean;
      endpoints: string[];
    };
    oneMap: {
      configured: boolean;
      endpoint: string;
    };
  };
}

/**
 * Checks backend API connectivity and credentials status
 */
export async function getBackendStatus(): Promise<BackendStatus | null> {
  try {
    const res = await fetch('/api/status');
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Failed to retrieve backend status:', err);
  }
  return null;
}

/**
 * Fetches raw LTA EV Charging points from the backend service
 * Maps to https://datamall2.mytransport.sg/ltaodataservice/EVChargingPoints
 */
export async function fetchLTAEVChargingPoints(skip = 0): Promise<{ data: any[] | null; error?: string }> {
  try {
    const res = await fetch(`/api/lta/ev-charging-points?$skip=${skip}`);
    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      return { data: null, error: errJson.error || `HTTP ${res.status}` };
    }
    const json = await res.json();
    return { data: json.value || [] };
  } catch (err: any) {
    return { data: null, error: err.message || 'Network error' };
  }
}

/**
 * Fetches raw LTA EVCBatch data from the backend service
 * Maps to https://datamall2.mytransport.sg/ltaodataservice/EVCBatch
 */
export async function fetchLTAEVCBatch(skip = 0): Promise<{ data: any[] | null; error?: string }> {
  try {
    const res = await fetch(`/api/lta/evc-batch?$skip=${skip}`);
    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      return { data: null, error: errJson.error || `HTTP ${res.status}` };
    }
    const json = await res.json();
    return { data: json.value || [] };
  } catch (err: any) {
    return { data: null, error: err.message || 'Network error' };
  }
}

/**
 * Normalizes LTA DataMall EV record into the application's ChargingStation format
 */
export function normalizeLTARecordToStation(record: any, index: number): ChargingStation {
  const name = record.Name || record.LocationDescription || `EV Station #${index + 1}`;
  const address = record.Address || record.LocationDescription || 'Singapore';
  const postalCode = record.PostalCode || '';
  const lat = typeof record.Latitude === 'number' ? record.Latitude : parseFloat(record.Latitude) || (record.Location?.Latitude ?? 1.3521);
  const lng = typeof record.Longitude === 'number' ? record.Longitude : parseFloat(record.Longitude) || (record.Location?.Longitude ?? 103.8198);
  
  const rawOp = (record.Operator || record.ServiceOperator || 'SP Mobility').trim();
  let operator: OperatorName = 'SP Mobility';
  if (/cdg|engie/i.test(rawOp)) operator = 'CDG ENGIE';
  else if (/charge\+/i.test(rawOp)) operator = 'Charge+';
  else if (/shell/i.test(rawOp)) operator = 'Shell Recharge';
  else if (/total/i.test(rawOp)) operator = 'TotalEnergies';
  else if (/bluecharge/i.test(rawOp)) operator = 'Bluecharge';
  else if (/tesla/i.test(rawOp)) operator = 'Tesla';
  else if (/quickcharge/i.test(rawOp)) operator = 'QuickCharge';

  const totalBays = Number(record.ChargingBays || record.NoOfChargers || 2);
  const availableBays = typeof record.AvailableBays === 'number' 
    ? record.AvailableBays 
    : (record.Status === 'AVAILABLE' ? totalBays : Math.max(0, totalBays - 1));

  const powerKw = Number(record.Power || record.RatedPower || 50);
  const isDC = powerKw >= 50;

  const connectors: Connector[] = [
    {
      id: `conn-${record.StationID || index}-1`,
      type: isDC ? 'CCS2' : 'Type 2',
      powerKw,
      currentType: isDC ? 'DC' : 'AC',
      status: availableBays > 0 ? 'AVAILABLE' : 'OCCUPIED',
      pricePerKwh: record.Price ? Number(record.Price) : (isDC ? 0.65 : 0.58),
      total: totalBays,
      available: availableBays,
    },
  ];

  return {
    id: `lta-${record.StationID || record.ID || index}`,
    name,
    operator,
    address,
    postalCode,
    carparkType: /hdb/i.test(address + name) ? 'HDB MSCP' : /mall|plaza|square/i.test(address + name) ? 'Shopping Mall' : 'Commercial / Office',
    latitude: lat,
    longitude: lng,
    totalBays,
    availableBays,
    occupiedBays: Math.max(0, totalBays - availableBays),
    offlineBays: 0,
    connectors,
    pricingInfo: {
      perKwh: connectors[0].pricePerKwh,
      parkingFee: 'Standard parking charges apply',
    },
    operatingHours: record.OperatingHours || '24/7 Access',
    accessType: 'PUBLIC',
    amenities: ['24/7 Access', 'Lighting', 'CCTV'],
    lastUpdated: 'Live via LTA DataMall',
    is24Hours: true,
    isSheltered: true,
  };
}
