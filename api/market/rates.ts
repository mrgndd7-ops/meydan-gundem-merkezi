const TRUNCGIL_URL = 'https://finans.truncgil.com/v4/today.json';

function parseNum(val: string | undefined): number {
  if (!val) return 0;
  return parseFloat(val.replace(',', '.')) || 0;
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');

  try {
    const response = await fetch(TRUNCGIL_URL);
    if (!response.ok) throw new Error(`Truncgil API error: ${response.status}`);

    const data = await response.json();

    const usdBuying  = parseNum(data['USD']?.['Buying']);
    const usdSelling = parseNum(data['USD']?.['Selling']);
    const usdChange  = parseNum(data['USD']?.['Change']);

    const eurBuying  = parseNum(data['EUR']?.['Buying']);
    const eurSelling = parseNum(data['EUR']?.['Selling']);
    const eurChange  = parseNum(data['EUR']?.['Change']);

    // Truncgil altın anahtarları: "Gram Altın" veya "Gram-Altin"
    const goldKey = Object.keys(data).find(k =>
      k.toLowerCase().includes('gram') && k.toLowerCase().includes('alt')
    ) ?? 'Gram Altın';

    const goldBuying  = parseNum(data[goldKey]?.['Buying']);
    const goldSelling = parseNum(data[goldKey]?.['Selling']);
    const goldChange  = parseNum(data[goldKey]?.['Change']);

    return res.status(200).json({
      usd:  { buying: usdBuying,  selling: usdSelling,  change: usdChange  },
      eur:  { buying: eurBuying,  selling: eurSelling,  change: eurChange  },
      gold: { buying: goldBuying, selling: goldSelling, change: goldChange },
      updated: data['Update_Date'] ?? null,
    });
  } catch (err) {
    console.error('Market rates fetch failed:', err);
    return res.status(503).json({ error: 'Piyasa verisi alınamadı' });
  }
}
