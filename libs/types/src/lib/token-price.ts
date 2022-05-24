export type TokenPriceSource = 'coin-gecko' | 'raydium';

export interface TokenPrice {
  mint: string;
  usd: number;
  decimals: number;
  name?: string;
  icon?: string;
  cap?: number;
  supply?: number;
  symbol?: string;
  source?: 'coin-gecko' | 'raydium';
}
