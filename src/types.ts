export type ConnectorType = 'CCS2' | 'Type 2' | 'CHAdeMO' | 'Tesla Supercharger';
export type CurrentType = 'AC' | 'DC';
export type BayStatus = 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE';
export type OperatorName = 
  | 'SP Mobility'
  | 'CDG ENGIE'
  | 'Charge+'
  | 'Shell Recharge'
  | 'TotalEnergies'
  | 'Bluecharge'
  | 'Tesla'
  | 'QuickCharge';

export interface Connector {
  id: string;
  type: ConnectorType;
  powerKw: number;
  currentType: CurrentType;
  status: BayStatus;
  pricePerKwh: number;
  total: number;
  available: number;
}

export interface ChargingStation {
  id: string;
  name: string;
  operator: OperatorName;
  operatorLogo?: string;
  address: string;
  postalCode: string;
  carparkType: 'HDB MSCP' | 'Shopping Mall' | 'Commercial / Office' | 'Petrol Station' | 'Hotel' | 'Industrial Park' | 'Community Club';
  latitude: number;
  longitude: number;
  totalBays: number;
  availableBays: number;
  occupiedBays: number;
  offlineBays: number;
  connectors: Connector[];
  pricingInfo: {
    perKwh: number;
    parkingFee: string;
    idleFee?: string;
  };
  operatingHours: string;
  accessType: 'PUBLIC' | 'RESTRICTED' | 'CUSTOMERS_ONLY';
  amenities: string[];
  lastUpdated: string;
  is24Hours: boolean;
  isSheltered: boolean;
  distanceMeters?: number;
  isWithinZone?: boolean;
  isWithin500m?: boolean;
}

export type LocationMode = 'near_me' | 'search_destination';

export interface SearchTarget {
  latitude: number;
  longitude: number;
  label: string;
  address?: string;
  postalCode?: string;
  mode: LocationMode;
}

export interface FilterState {
  searchQuery: string;
  plugTypes: ConnectorType[];
  speedTypes: ('ALL' | 'AC' | 'DC_FAST' | 'ULTRA_FAST')[];
  operators: OperatorName[];
  availableOnly: boolean;
  minPowerKw: number;
  only24Hours: boolean;
  onlySheltered: boolean;
  radiusMeters: number; // default 2000 (2km)
  strict500mOnly: boolean;
}

export type SortBy = 'distance' | 'available_bays' | 'max_power' | 'price';
export type ThemeMode = 'dark' | 'light';

export interface OneMapSearchResult {
  SEARCHVAL: string;
  BLK_NO: string;
  ROAD_NAME: string;
  BUILDING: string;
  ADDRESS: string;
  POSTAL: string;
  X: string;
  Y: string;
  LATITUDE: string;
  LONGITUDE: string;
}
