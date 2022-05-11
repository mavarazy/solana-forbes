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

type NftType = 'original' | 'print';

export interface NftWorth {
  type: NftType;
  mint: string;
  info: TokenInfoSummary;
  collection?: {
    name: string | null;
    family: string | null;
    symbol: string | null;
  };
  owns: boolean;
}

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
