import { NftWorth } from './nft-worth';
import { TokenWorth } from './token-worth';

export type TokenWorthSummary = {
  priced: TokenWorth[];
  general: TokenWorth[];
  dev: TokenWorth[];
  nfts: NftWorth[];
};

export type TokenType = keyof TokenWorthSummary;

export type TokenSummary = Partial<{ [key in TokenType]: number }>;

export interface WalletBallance {
  id: string;
  worth: number;
  sol: number;
  top: TokenWorth[];
  summary: TokenSummary;
  tokens: TokenWorthSummary;
  program: boolean;
}

export interface TokenPrice {
  mint: string;
  usd: number;
  cap: number;
  decimals: number;
  supply: number;
  coingeckoId: string;
}

export type PriceMap = {
  [key in string]: {
    usd: number;
    cap: number;
    decimals: number;
    coingeckoId: string;
  };
};
