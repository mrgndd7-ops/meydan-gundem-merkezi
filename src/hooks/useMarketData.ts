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
}

async function fetchMarketData(): Promise<MarketData> {
  const [ratesRes, goldRes] = await Promise.all([
    fetch('https://open.er-api.com/v6/latest/USD'),
    fetch('https://api.coinbase.com/v2/prices/XAU-USD/spot'),
  ]);

  if (!ratesRes.ok) throw new Error('Rates fetch failed');
  if (!goldRes.ok) throw new Error('Gold fetch failed');

  const rates = await ratesRes.json();
  const goldData = await goldRes.json();

  const usdTry: number = rates.rates?.TRY ?? 0;
  const eurUsd: number = rates.rates?.EUR ?? 1;
  const eurTry = usdTry / eurUsd;

  const xauUsd: number = parseFloat(goldData.data?.amount ?? '0');
  const gramGoldTry = (xauUsd / 31.1035) * usdTry;

  return {
    usd: { buying: usdTry * 0.998, selling: usdTry, change: 0 },
    eur: { buying: eurTry * 0.998, selling: eurTry, change: 0 },
    gold: { buying: gramGoldTry * 0.998, selling: gramGoldTry, change: 0 },
  };
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
