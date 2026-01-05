export interface POI {
  name: string;
  address?: string;
  phone?: string;
  website?: string;
}

export interface CityPOIData {
  id: string;
  name: string;
  lat?: number;
  lng?: number;
  counts: { [category: string]: number };
  items: { [category: string]: POI[] };
}

export const POI_CATEGORIES = [
  { key: 'malls', label: 'Malls' },
  { key: 'groceryStores', label: 'Grocery Stores' },
  { key: 'gasStations', label: 'Gas Stations' },
  { key: 'hospitals', label: 'Hospitals' },
  { key: 'transport', label: 'Transport' },
  { key: 'restaurants', label: 'Restaurants' },
  { key: 'carShowrooms', label: 'Car Showrooms' }
];

export const MOCK_CITY_POIS: CityPOIData[] = [
  {
    id: 'naperville',
    name: 'Naperville',
    counts: {
      malls: 4,
      groceryStores: 12,
      gasStations: 8,
      hospitals: 2,
      transport: 10,
      restaurants: 85,
      carShowrooms: 6
    },
    items: {
      malls: [
        { name: 'Naperville Plaza' },
        { name: 'Riverwalk Mall' },
        { name: 'Edison Mall' },
        { name: 'Meadowridge Shops' }
      ],
      groceryStores: [
        { name: 'Whole Foods Market' },
        { name: 'Jewel-Osco' },
        { name: 'Aldi' }
      ],
      gasStations: [
        { name: 'Shell' },
        { name: 'BP' },
        { name: 'Marathon' }
      ],
      hospitals: [{ name: 'Edward Hospital' }],
      transport: [
        { name: 'Metra Naperville Station' },
        { name: 'Pace Bus Terminal' }
      ],
      restaurants: [
        { name: 'D. Paris Restaurant' },
        { name: 'Sauce & Bread' },
        { name: 'The Cantigny Restaurant' }
      ],
      carShowrooms: [{ name: 'Naperville Hyundai' }, { name: 'Naperville Ford' }]
    }
  },
  {
    id: 'chicago',
    name: 'Chicago',
    counts: {
      malls: 18,
      groceryStores: 420,
      gasStations: 320,
      hospitals: 62,
      transport: 1200,
      restaurants: 8400,
      carShowrooms: 140
    },
    items: {
      malls: [{ name: 'Water Tower Place' }],
      groceryStores: [{ name: 'Trader Joe\'s' }],
      gasStations: [{ name: 'Exxon' }],
      hospitals: [{ name: 'Northwestern Memorial Hospital' }],
      transport: [{ name: 'Union Station' }],
      restaurants: [{ name: 'Alinea' }],
      carShowrooms: [{ name: 'Chicago BMW' }]
    }
  },
  {
    id: 'springfield',
    name: 'Springfield',
    counts: {
      malls: 2,
      groceryStores: 15,
      gasStations: 12,
      hospitals: 3,
      transport: 6,
      restaurants: 220,
      carShowrooms: 8
    },
    items: {
      malls: [{ name: 'Capital Mall' }],
      groceryStores: [{ name: 'County Market' }],
      gasStations: [{ name: 'Casey\'s' }],
      hospitals: [{ name: 'HSHS St. John\'s Hospital' }],
      transport: [{ name: 'Greyhound Station' }],
      restaurants: [{ name: 'Obed & Isaac\'s' }],
      carShowrooms: [{ name: 'Springfield Toyota' }]
    }
  }
];

export default MOCK_CITY_POIS;
