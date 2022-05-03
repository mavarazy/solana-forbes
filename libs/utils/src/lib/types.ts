export interface TokenWorth {
  mint: string;
  amount: number;
  worth: number;
  usd?: number;
}

export interface WalletBallance {
  id: string;
  worth: number;
  sol: number;
  tokens: TokenWorth[];
}

export type PriceMap = { [key in string]: { usd: number; decimals: number } };
