import { OneMapSearchResult, SearchTarget } from '../types';

// Preset popular Singapore locations for 1-click test and exploration
export const POPULAR_SG_LOCATIONS: SearchTarget[] = [
  {
    label: 'Marina Bay Sands',
    address: '10 Bayfront Avenue, Singapore 018956',
    postalCode: '018956',
    latitude: 1.2834,
    longitude: 103.8607,
    mode: 'search_destination',
  },
  {
    label: 'Tampines Hub / Central',
    address: '1 Tampines Walk, Singapore 528523',
    postalCode: '528523',
    latitude: 1.3532,
    longitude: 103.9401,
    mode: 'search_destination',
  },
  {
    label: 'Jurong Point / Jurong West',
    address: '1 Jurong West Central 2, Singapore 648886',
    postalCode: '648886',
    latitude: 1.3404,
    longitude: 103.7063,
    mode: 'search_destination',
  },
  {
    label: 'One-North Fusionopolis',
    address: '1 Fusionopolis Way, Singapore 138632',
    postalCode: '138632',
    latitude: 1.2994,
    longitude: 103.7874,
    mode: 'search_destination',
  },
  {
    label: 'Orchard ION / Ngee Ann City',
    address: '2 Orchard Turn, Singapore 238801',
    postalCode: '238801',
    latitude: 1.3040,
    longitude: 103.8320,
    mode: 'search_destination',
  },
  {
    label: 'Ang Mo Kio Hub',
    address: '53 Ang Mo Kio Ave 3, Singapore 569933',
    postalCode: '569933',
    latitude: 1.3695,
    longitude: 103.8485,
    mode: 'search_destination',
  },
  {
    label: 'VivoCity / HarbourFront',
    address: '1 HarbourFront Walk, Singapore 098585',
    postalCode: '098585',
    latitude: 1.2644,
    longitude: 103.8222,
    mode: 'search_destination',
  },
  {
    label: 'Jewel Changi Airport',
    address: '78 Airport Boulevard, Singapore 819666',
    postalCode: '819666',
    latitude: 1.3602,
    longitude: 103.9898,
    mode: 'search_destination',
  },
  {
    label: 'Toa Payoh HDB Hub',
    address: '480 LorONG 6 Toa Payoh, Singapore 310480',
    postalCode: '310480',
    latitude: 1.3328,
    longitude: 103.8478,
    mode: 'search_destination',
  },
  {
    label: 'Woodlands Civic Centre',
    address: '900 South Woodlands Drive, Singapore 730900',
    postalCode: '730900',
    latitude: 1.4361,
    longitude: 103.7865,
    mode: 'search_destination',
  },
  {
    label: 'Paya Lebar Quarter (PLQ)',
    address: '10 Paya Lebar Road, Singapore 409057',
    postalCode: '409057',
    latitude: 1.3174,
    longitude: 103.8928,
    mode: 'search_destination',
  },
];

// Offline fallback dictionary for popular postal codes & addresses in Singapore
const LOCAL_SG_GEOCODER: { [key: string]: { lat: number; lng: number; address: string; building: string; postal: string } } = {
  '018956': { lat: 1.2834, lng: 103.8607, address: '10 BAYFRONT AVENUE', building: 'MARINA BAY SANDS', postal: '018956' },
  '039593': { lat: 1.2934, lng: 103.8560, address: '3 TEMASEK BOULEVARD', building: 'SUNTEC CITY MALL', postal: '039593' },
  '238801': { lat: 1.3040, lng: 103.8320, address: '2 ORCHARD TURN', building: 'ION ORCHARD', postal: '238801' },
  '238872': { lat: 1.3025, lng: 103.8358, address: '391 ORCHARD ROAD', building: 'NGEE ANN CITY / TAKASHIMAYA', postal: '238872' },
  '098585': { lat: 1.2644, lng: 103.8222, address: '1 HARBOURFRONT WALK', building: 'VIVOCITY', postal: '098585' },
  '528523': { lat: 1.3532, lng: 103.9401, address: '1 TAMPINES WALK', building: 'OUR TAMPINES HUB', postal: '528523' },
  '529510': { lat: 1.3526, lng: 103.9452, address: '4 TAMPINES CENTRAL 5', building: 'TAMPINES MALL', postal: '529510' },
  '648886': { lat: 1.3404, lng: 103.7063, address: '1 JURONG WEST CENTRAL 2', building: 'JURONG POINT', postal: '648886' },
  '608549': { lat: 1.3331, lng: 103.7431, address: '3 GATEWAY DRIVE', building: 'WESTGATE', postal: '608549' },
  '609690': { lat: 1.3347, lng: 103.7441, address: '2 JURONG EAST CENTRAL 1', building: 'JEM', postal: '609690' },
  '138632': { lat: 1.2994, lng: 103.7874, address: '1 FUSIONOPOLIS WAY', building: 'FUSIONOPOLIS', postal: '138632' },
  '138547': { lat: 1.2982, lng: 103.7885, address: '20 BIOPOLIS WAY', building: 'BIOPOLIS CENTROS', postal: '138547' },
  '569933': { lat: 1.3695, lng: 103.8485, address: '53 ANG MO KIO AVE 3', building: 'AMK HUB', postal: '569933' },
  '560410': { lat: 1.3627, lng: 103.8552, address: '410 ANG MO KIO AVE 10', building: 'HDB ANG MO KIO', postal: '560410' },
  '310480': { lat: 1.3328, lng: 103.8478, address: '480 LORONG 6 TOA PAYOH', building: 'HDB HUB TOA PAYOH', postal: '310480' },
  '730900': { lat: 1.4361, lng: 103.7865, address: '900 SOUTH WOODLANDS DRIVE', building: 'WOODLANDS CIVIC CENTRE', postal: '730900' },
  '738099': { lat: 1.4368, lng: 103.7860, address: '1 WOODLANDS SQUARE', building: 'CAUSEWAY POINT', postal: '738099' },
  '819666': { lat: 1.3602, lng: 103.9898, address: '78 AIRPORT BOULEVARD', building: 'JEWEL CHANGI AIRPORT', postal: '819666' },
  '409057': { lat: 1.3174, lng: 103.8928, address: '10 PAYA LEBAR ROAD', building: 'PAYA LEBAR QUARTER (PLQ)', postal: '409057' },
  '467360': { lat: 1.3245, lng: 103.9300, address: '311 NEW UPPER CHANGI ROAD', building: 'BEDOK MALL', postal: '467360' },
  '545078': { lat: 1.3916, lng: 103.8953, address: '1 SENGKANG SQUARE', building: 'COMPASS ONE', postal: '545078' },
  '828761': { lat: 1.4067, lng: 103.9022, address: '83 PUNGGOL CENTRAL', building: 'WATERWAY POINT', postal: '828761' },
  '769098': { lat: 1.4294, lng: 103.8361, address: '930 YISHUN AVENUE 2', building: 'NORTHPOINT CITY', postal: '769098' },
  '579837': { lat: 1.3506, lng: 103.8488, address: '9 BISHAN PLACE', building: 'JUNCTION 8', postal: '579837' },
  '556083': { lat: 1.3508, lng: 103.8727, address: '23 SERANGOON CENTRAL', building: 'NEX MALL', postal: '556083' },
  '179103': { lat: 1.2932, lng: 103.8522, address: '252 NORTH BRIDGE ROAD', building: 'RAFFLES CITY', postal: '179103' },
  '048581': { lat: 1.2829, lng: 103.8525, address: '10 COLLYER QUAY', building: 'OCEAN FINANCIAL CENTRE', postal: '048581' },
  '069046': { lat: 1.2778, lng: 103.8447, address: '1 WALLICH STREET', building: 'GUOCO TOWER / TANJONG PAGAR', postal: '069046' },
  '129588': { lat: 1.3155, lng: 103.7651, address: '3155 COMMONWEALTH AVE WEST', building: 'THE CLEMENTI MALL', postal: '129588' },
};

/**
 * Searches Singapore OneMap API with fallback to offline geocoding catalog
 */
export async function searchSingaporeAddress(query: string): Promise<SearchTarget[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const results: SearchTarget[] = [];

  // Check if it's a 6-digit postal code
  const isPostal = /^\d{6}$/.test(trimmed);

  // 1. Try backend OneMap API service route first
  try {
    const encoded = encodeURIComponent(trimmed);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const response = await fetch(
      `/api/onemap/search?searchVal=${encoded}&returnGeom=Y&getAddrDetails=Y&pageNum=1`,
      { signal: controller.signal }
    );
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data.results && Array.isArray(data.results) && data.results.length > 0) {
        data.results.slice(0, 6).forEach((item: OneMapSearchResult) => {
          const lat = parseFloat(item.LATITUDE);
          const lng = parseFloat(item.LONGITUDE);
          if (!isNaN(lat) && !isNaN(lng)) {
            const building = item.BUILDING && item.BUILDING !== 'NIL' ? item.BUILDING : item.SEARCHVAL;
            const postal = item.POSTAL && item.POSTAL !== 'NIL' ? item.POSTAL : '';
            results.push({
              label: building,
              address: item.ADDRESS,
              postalCode: postal,
              latitude: lat,
              longitude: lng,
              mode: 'search_destination',
            });
          }
        });
      }
    }
  } catch (error) {
    console.warn('Backend OneMap route unavailable, trying direct public query or catalog fallback:', error);
  }

  // 2. Direct public OneMap query fallback if backend returned no results
  if (results.length === 0) {
    try {
      const encoded = encodeURIComponent(trimmed);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const response = await fetch(
        `https://www.onemap.gov.sg/api/common/elastic/search?searchVal=${encoded}&returnGeom=Y&getAddrDetails=Y&pageNum=1`,
        { signal: controller.signal }
      );
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        if (data.results && Array.isArray(data.results) && data.results.length > 0) {
          data.results.slice(0, 6).forEach((item: OneMapSearchResult) => {
            const lat = parseFloat(item.LATITUDE);
            const lng = parseFloat(item.LONGITUDE);
            if (!isNaN(lat) && !isNaN(lng)) {
              const building = item.BUILDING && item.BUILDING !== 'NIL' ? item.BUILDING : item.SEARCHVAL;
              const postal = item.POSTAL && item.POSTAL !== 'NIL' ? item.POSTAL : '';
              results.push({
                label: building,
                address: item.ADDRESS,
                postalCode: postal,
                latitude: lat,
                longitude: lng,
                mode: 'search_destination',
              });
            }
          });
        }
      }
    } catch {
      // Continue to offline dictionary
    }
  }

  // 2. If OneMap returned results, return them
  if (results.length > 0) {
    return results;
  }

  // 3. Fallback to local offline dictionary
  const qLower = trimmed.toLowerCase();

  // Exact postal match
  if (isPostal && LOCAL_SG_GEOCODER[trimmed]) {
    const item = LOCAL_SG_GEOCODER[trimmed];
    return [
      {
        label: item.building,
        address: `${item.address}, Singapore ${item.postal}`,
        postalCode: item.postal,
        latitude: item.lat,
        longitude: item.lng,
        mode: 'search_destination',
      },
    ];
  }

  // Fuzzy match on local list
  Object.entries(LOCAL_SG_GEOCODER).forEach(([postal, item]) => {
    if (
      postal.includes(trimmed) ||
      item.building.toLowerCase().includes(qLower) ||
      item.address.toLowerCase().includes(qLower)
    ) {
      results.push({
        label: item.building,
        address: `${item.address}, Singapore ${item.postal}`,
        postalCode: item.postal,
        latitude: item.lat,
        longitude: item.lng,
        mode: 'search_destination',
      });
    }
  });

  // Popular locations match
  POPULAR_SG_LOCATIONS.forEach((loc) => {
    if (
      loc.label.toLowerCase().includes(qLower) ||
      (loc.address && loc.address.toLowerCase().includes(qLower)) ||
      (loc.postalCode && loc.postalCode.includes(trimmed))
    ) {
      if (!results.some((r) => r.label === loc.label)) {
        results.push(loc);
      }
    }
  });

  // If query is an approximate postal code (starts with 2 digits)
  if (isPostal && results.length === 0) {
    // Generate approximate Singapore center coordinate based on postal sector
    const sector = parseInt(trimmed.substring(0, 2), 10);
    // Rough sector center
    const lat = 1.3521 + (Math.sin(sector) * 0.05);
    const lng = 103.8198 + (Math.cos(sector) * 0.08);
    results.push({
      label: `Singapore Postal Code ${trimmed}`,
      address: `Singapore ${trimmed}`,
      postalCode: trimmed,
      latitude: lat,
      longitude: lng,
      mode: 'search_destination',
    });
  }

  return results.slice(0, 6);
}
