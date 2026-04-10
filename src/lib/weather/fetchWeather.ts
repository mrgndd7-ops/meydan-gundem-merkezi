import type { City, WeatherData } from '../../types/weather.js';

// WMO weather code → Türkçe durum metni
const CONDITION_MAP: Record<number, string> = {
  0:  'Açık',
  1:  'Çoğunlukla Açık',
  2:  'Parçalı Bulutlu',
  3:  'Bulutlu',
  45: 'Sisli',
  48: 'Kırağılı Sis',
  51: 'Hafif Çiseleme',
  53: 'Çiseleme',
  55: 'Yoğun Çiseleme',
  61: 'Hafif Yağmur',
  63: 'Yağmurlu',
  65: 'Yoğun Yağmur',
  71: 'Hafif Kar',
  73: 'Karlı',
  75: 'Yoğun Kar',
  80: 'Hafif Sağanak',
  81: 'Sağanaklı',
  82: 'Şiddetli Sağanak',
  95: 'Fırtınalı',
  96: 'Dolu ile Fırtına',
  99: 'Ağır Dolu ile Fırtına',
};

function resolveCondition(code: number): string {
  return CONDITION_MAP[code] ?? 'Bilinmiyor';
}

export async function fetchCityWeather(city: City): Promise<WeatherData> {
  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.searchParams.set('latitude', String(city.lat));
  url.searchParams.set('longitude', String(city.lon));
  url.searchParams.set('current', 'temperature_2m,weathercode,windspeed_10m');
  url.searchParams.set('wind_speed_unit', 'kmh');
  url.searchParams.set('timezone', 'Europe/Istanbul');

  const res = await fetch(url.toString(), {
    signal: AbortSignal.timeout(5000),
  });

  if (!res.ok) throw new Error('Open-Meteo error [' + res.status + '] for ' + city.name);

  const json = await res.json();
  const current = json.current;

  return {
    key: city.key,
    name: city.name,
    temperature: Math.round(current.temperature_2m),
    condition: resolveCondition(Number(current.weathercode)),
    windSpeed: Math.round(current.windspeed_10m),
    updatedAt: new Date().toISOString(),
  };
}
