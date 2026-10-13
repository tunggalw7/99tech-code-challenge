import { Token, RawPriceItem } from '../types';

const PRICES_API_URL = 'https://interview.switcheo.com/prices.json';
const ICON_BASE_URL = 'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens';

// Realistic initial mock balances for testing
const INITIAL_BALANCES: Record<string, number> = {
  ETH: 4.25,
  USDC: 5800.5,
  BUSD: 1250.0,
  ATOM: 180.25,
  OSMO: 750.0,
  SWTH: 25000.0,
  GMX: 14.5,
  LUNA: 320.0,
  KUJI: 500.0,
  USD: 2000.0,
};

const TOKEN_NAMES: Record<string, string> = {
  ETH: 'Ethereum',
  USDC: 'USD Coin',
  BUSD: 'Binance USD',
  ATOM: 'Cosmos Hub',
  OSMO: 'Osmosis',
  SWTH: 'Carbon Protocol',
  GMX: 'GMX Token',
  LUNA: 'Terra Luna',
  KUJI: 'Kujira',
  USD: 'US Dollar',
  BLUR: 'Blur',
  bNEO: 'Burger NEO',
  IBCX: 'ION Dao IBCX',
  IRIS: 'IRISnet',
  RATOM: 'StaFi Staked ATOM',
  STRD: 'Stride',
  EVMOS: 'Evmos',
  OKB: 'OKB Token',
  OKT: 'OKT Chain',
  USC: 'Carbon USC',
};

// Fallback tokens if network fails
const FALLBACK_TOKENS: RawPriceItem[] = [
  { currency: 'ETH', price: 1645.93, date: new Date().toISOString() },
  { currency: 'USDC', price: 1.0, date: new Date().toISOString() },
  { currency: 'BUSD', price: 0.999, date: new Date().toISOString() },
  { currency: 'ATOM', price: 7.18, date: new Date().toISOString() },
  { currency: 'OSMO', price: 0.38, date: new Date().toISOString() },
  { currency: 'SWTH', price: 0.0041, date: new Date().toISOString() },
  { currency: 'GMX', price: 36.35, date: new Date().toISOString() },
  { currency: 'LUNA', price: 0.41, date: new Date().toISOString() },
  { currency: 'KUJI', price: 0.675, date: new Date().toISOString() },
  { currency: 'USD', price: 1.0, date: new Date().toISOString() },
];

export async function fetchTokenPrices(): Promise<Token[]> {
  let rawList: RawPriceItem[] = [];

  try {
    const res = await fetch(PRICES_API_URL);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    rawList = await res.json();
  } catch (err) {
    console.warn('Failed to fetch live prices, falling back to local dataset:', err);
    rawList = FALLBACK_TOKENS;
  }

  // De-duplicate items: keep the latest price for each currency
  const tokenMap = new Map<string, RawPriceItem>();

  for (const item of rawList) {
    if (!item.currency || typeof item.price !== 'number' || item.price <= 0) continue;
    const existing = tokenMap.get(item.currency);
    if (!existing) {
      tokenMap.set(item.currency, item);
    } else {
      const existingDate = new Date(existing.date).getTime();
      const newDate = new Date(item.date).getTime();
      if (newDate >= existingDate) {
        tokenMap.set(item.currency, item);
      }
    }
  }

  const tokens: Token[] = Array.from(tokenMap.values()).map((item) => {
    const balance = INITIAL_BALANCES[item.currency] ?? (Math.random() > 0.6 ? parseFloat((Math.random() * 50).toFixed(2)) : 0);
    return {
      currency: item.currency,
      name: TOKEN_NAMES[item.currency] || item.currency,
      price: item.price,
      date: item.date,
      iconUrl: `${ICON_BASE_URL}/${item.currency}.svg`,
      balance,
    };
  });

  // Sort popular tokens to top
  const priorityOrder = ['ETH', 'USDC', 'BUSD', 'ATOM', 'OSMO', 'SWTH', 'GMX'];
  tokens.sort((a, b) => {
    const idxA = priorityOrder.indexOf(a.currency);
    const idxB = priorityOrder.indexOf(b.currency);
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    return a.currency.localeCompare(b.currency);
  });

  return tokens;
}
