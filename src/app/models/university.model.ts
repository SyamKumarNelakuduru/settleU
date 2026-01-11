export interface AreaToLive {
  name: string;
  reason: string;
  link?: string;
}

export interface SafetyInfo {
  level: 'Safe' | 'Moderate' | 'Use Caution';
  note: string;
  source?: string;
}

export interface University {
  name: string;
  streetAddress: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
  type: 'Public' | 'Private';
  website: string;
  createdAt?: any;
  numberOfGasStations?: number;
  isadmin?: boolean;
  about?: string;
  students?: {
    total: number;
    international: number;
    domestic: number;
    year: number;
    source: string;
  };
  safety?: SafetyInfo;
  bestAreasToLive?: AreaToLive[];
}
