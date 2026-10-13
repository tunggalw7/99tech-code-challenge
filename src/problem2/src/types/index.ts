export interface Token {
  currency: string;
  name: string;
  price: number;
  date?: string;
  iconUrl: string;
  balance: number;
}

export interface RawPriceItem {
  currency: string;
  date: string;
  price: number;
}

export interface SwapSettings {
  slippage: number; // in percentage, e.g. 0.5
  deadlineMinutes: number;
}

export interface SwapTransaction {
  id: string;
  fromToken: Token;
  toToken: Token;
  fromAmount: number;
  toAmount: number;
  rate: number;
  txHash: string;
  timestamp: Date;
}
