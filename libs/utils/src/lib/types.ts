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
  top: TokenWorth[];
  tokens: TokenWorth[];
}

export interface TokenPrice {
  mint: string;
  usd: number;
  cap: number;
  decimals: number;
  supply: number;
}

export type PriceMap = {
  [key in string]: { usd: number; cap: number; decimals: number };
};
