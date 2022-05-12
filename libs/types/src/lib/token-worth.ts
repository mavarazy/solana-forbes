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

export type NftType = 'original' | 'print';

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
