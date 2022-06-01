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

export interface WalletBalance {
  id: string;
  worth: number;
  sol: number;
  summary: TokenSummary;
  tokens: TokenWorthSummary;
  program: boolean;
  change: number;
}
