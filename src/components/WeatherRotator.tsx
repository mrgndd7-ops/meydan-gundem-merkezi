import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Cloud } from 'lucide-react';
import type { WeatherSummaryResponse } from '@/types/weather';

const INTERVAL_MS = 4000;

async function fetchWeatherSummary(): Promise<WeatherSummaryResponse> {
  const res = await fetch('/api/weather/summary');
  if (!res.ok) throw new Error('Weather fetch failed');
  return res.json();
}

const WeatherRotator = () => {
  const [index, setIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['weather-summary'],
    queryFn: fetchWeatherSummary,
    staleTime: 10 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000,
    retry: 1,
  });

  const cities = data?.cities ?? [];

  useEffect(() => {
    if (cities.length < 2) return;

    // Önceki interval'i temizle (memory leak önleme)
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % cities.length);
    }, INTERVAL_MS);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [cities.length]);

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 text-xs">
        <Cloud className="w-3.5 h-3.5 opacity-50" />
        <span className="opacity-50">Yükleniyor...</span>
      </div>
    );
  }

  if (isError || cities.length === 0) {
    return (
      <div className="flex items-center space-x-2 text-xs">
        <Cloud className="w-3.5 h-3.5" />
        <span>—</span>
      </div>
    );
  }

  const city = cities[index];

  return (
    <div className="flex items-center space-x-1.5 text-xs">
      <Cloud className="w-3.5 h-3.5 shrink-0" />
      <span className="font-medium">{city.name}</span>
      <span>{city.temperature}°C</span>
      <span className="hidden xl:inline text-on-surface-variant/60">· {city.condition}</span>
    </div>
  );
};

export default WeatherRotator;
