import { useQuery } from '@tanstack/react-query';

export interface MarketItem {
  buying: number;
  selling: number;
  change: number;
}

export interface MarketData {
  usd: MarketItem | null;
  eur: MarketItem | null;
  gbp: MarketItem | null;
  gold: MarketItem | null;
  updatedAt: string;
}

async function fetchMarketData(): Promise<MarketData> {
  const url = ;
  const res = await fetch(url, {
    headers: {
      Authorization: ,
      apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    },
  });
  if (!res.ok) throw new Error('Market data fetch failed');
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
