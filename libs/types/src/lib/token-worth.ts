import { TokenInfo } from '@solana/spl-token-registry';

export type TokenInfoSummary = Pick<TokenInfo, 'logoURI' | 'name'> & {
  decimals?: number;
};

export interface TokenWorth {
  mint: string;
  amount: number;
  worth: number;
  info?: TokenInfoSummary;
  percent?: number;
  usd?: number;
}
