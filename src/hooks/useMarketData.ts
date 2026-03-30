import { useQuery } from '@tanstack/react-query';

export interface MarketItem {
  buying: number;
  selling: number;
  change: number;
}

export interface MarketData {
  usd: MarketItem;
  eur: MarketItem;
  gold: MarketItem;
  updated: string | null;
}

async function fetchMarketData(): Promise<MarketData> {
  const res = await fetch('/api/market/rates');
  if (!res.ok) throw new Error('Market rates fetch failed');
  return res.json();
}

export function useMarketData() {
  return useQuery({
    queryKey: ['market-data'],
    queryFn: fetchMarketData,
    staleTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
    retry: 2,
  });
}
