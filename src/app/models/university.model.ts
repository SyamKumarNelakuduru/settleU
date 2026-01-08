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
}
