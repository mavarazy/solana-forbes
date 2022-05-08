import { TokenInfo } from '@solana/spl-token-registry';

export type TokenInfoSummary = Pick<TokenInfo, 'logoURI' | 'name'>;

export interface TokenWorth {
  mint: string;
  amount: number;
  worth: number;
  info?: TokenInfoSummary;
  percent?: number;
  usd?: number;
}

export interface WalletBallance {
  id: string;
  worth: number;
  sol: number;
  top: TokenWorth[];
  summary: { nfts: number; tokens: number };
  nfts: TokenWorth[];
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
