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

export interface AccommodationGroup {
  name: string;
  platform: 'Facebook' | 'Discord' | 'Telegram' | 'WhatsApp' | 'Website';
  url: string;
  note: string;
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
    internationalCountryBreakdown?: { [country: string]: number };
  };
  safety?: SafetyInfo;
  bestAreasToLive?: AreaToLive[];
  accommodationGroups?: AccommodationGroup[];
  accommodationTips?: string[];
}
