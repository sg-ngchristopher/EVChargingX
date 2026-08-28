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
 * 82-Sector Singapore Postal Geocoding Model
 * Maps any Singapore 2-digit postal sector (01-82) to exact neighborhood coordinates
 */
export const SG_POSTAL_SECTORS: Record<string, { lat: number; lng: number; area: string; district: string }> = {
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
 * Searches Singapore OneMap API with fallback to offline geocoding catalog
 */
export async function searchSingaporeAddress(query: string): Promise<SearchTarget[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const results: SearchTarget[] = [];
  const isPostal = /^\d{6}$/.test(trimmed);

  // 1. Try backend OneMap / Nominatim API service route first
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
            const postal = item.POSTAL && item.POSTAL !== 'NIL' ? item.POSTAL : (isPostal ? trimmed : '');
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
    console.warn('Backend search route failed, using client-side geocoder:', error);
  }

  // 2. If results found from API proxy, return them
  if (results.length > 0) {
    return results;
  }

  // 3. 6-digit postal sector geocoding calculation
  if (isPostal) {
    const sector = trimmed.substring(0, 2);
    if (SG_POSTAL_SECTORS[sector]) {
      const sec = SG_POSTAL_SECTORS[sector];
      results.push({
        label: `${sec.area} (S${trimmed})`,
        address: `Singapore ${trimmed}, ${sec.area} (${sec.district})`,
        postalCode: trimmed,
        latitude: sec.lat,
        longitude: sec.lng,
        mode: 'search_destination',
      });
      return results;
    }
  }

  // 4. Fallback to local offline dictionary
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

  // Fuzzy match on local landmark list
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

  // Check SG Postal Sector dictionary for keywords (e.g. "Woodlands", "Tampines", "Yishun")
  Object.entries(SG_POSTAL_SECTORS).forEach(([sec, data]) => {
    if (
      data.area.toLowerCase().includes(qLower) ||
      data.district.toLowerCase().includes(qLower) ||
      sec === trimmed.substring(0, 2)
    ) {
      if (!results.some((r) => r.label.includes(data.area))) {
        results.push({
          label: data.area,
          address: `${data.area}, Singapore (${data.district})`,
          postalCode: `${sec}0000`,
          latitude: data.lat,
          longitude: data.lng,
          mode: 'search_destination',
        });
      }
    }
  });

  return results.slice(0, 6);
}

