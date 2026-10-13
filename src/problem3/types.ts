export type Blockchain = 'Osmosis' | 'Ethereum' | 'Arbitrum' | 'Zilliqa' | 'Neo' | string;

export interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: Blockchain;
}

export interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
  usdValue: number;
}

export interface Prices {
  [currency: string]: number | undefined;
}

export interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
  // Common Box / container props
}
