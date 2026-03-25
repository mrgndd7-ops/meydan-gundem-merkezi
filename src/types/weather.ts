export interface City {
  key: string;
  name: string;
  lat: number;
  lon: number;
}

export interface WeatherData {
  key: string;
  name: string;
  temperature: number;
  condition: string;
  windSpeed: number;
  updatedAt: string;
}

export interface WeatherSummaryResponse {
  cities: WeatherData[];
  source: string;
}
