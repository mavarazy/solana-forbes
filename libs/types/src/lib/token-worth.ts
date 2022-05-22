import { TokenInfo } from '@solana/spl-token-registry';

export type TokenInfoSummary = Pick<TokenInfo, 'logoURI' | 'name'>;

export interface TokenWorth {
  mint: string;
  amount: number;
  decimals: number;
  worth: number;
  info?: TokenInfoSummary;
  percent?: number;
  usd?: number;
  symbol?: string;
  source?: 'coingeckoId' | 'raydium';
}
