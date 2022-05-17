import { TokenInfoSummary } from './token-worth';

export type NftType = 'original' | 'print';

export interface NftWorth {
  type: NftType;
  mint: string;
  info: TokenInfoSummary;
  floorPrice?: number;
  collection?: {
    name: string | null;
    family: string | null;
    symbol: string | null;
  };
  owns: boolean;
}
