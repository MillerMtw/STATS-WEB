
export interface CountryStat {
  name: string;
  count: number;
  percentage: number;
}

export interface StatsData {
  online: number;
  today: number;
  newUsers: number;
  allTime: number;
  countries: CountryStat[];
  lastUpdated: string;
}

export interface HistoricalPoint {
  time: string;
  value: number;
  secondary: number;
}
