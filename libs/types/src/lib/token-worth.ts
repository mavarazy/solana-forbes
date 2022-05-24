import { TokenInfo } from '@solana/spl-token-registry';
import { TokenPriceSource } from './token-price';

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
  source?: TokenPriceSource;
}
