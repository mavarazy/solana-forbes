import { TokenSummary } from '@solana-forbes/types';
import { Badge } from '../badge';
import { TokenTypeIcon } from '../token-type-icon';

const formatNumber = (num: number) => {
  if (num > 1000) {
    return `${Math.round(num / 1000)}K`;
  }
  return `${num}`;
};

export const SummaryBadge = ({ nfts, priced, general, dev }: TokenSummary) => (
  <Badge>
    {nfts > 0 && (
      <>
        <TokenTypeIcon type="nfts" className="flex self-center" />
        <span className="self-center mx-1">{formatNumber(nfts)}</span>
      </>
    )}
    {priced > 0 && (
      <>
        <TokenTypeIcon type="priced" className="flex self-center" />
        <span className="self-center mx-1">{formatNumber(priced)}</span>
      </>
    )}
    {general > 0 && (
      <>
        <TokenTypeIcon type="general" className="flex self-center" />
        <span className="self-center mx-1">{formatNumber(general)}</span>
      </>
    )}
    {dev > 0 && (
      <>
        <TokenTypeIcon type="dev" className="flex self-center" />
        <span className="self-center mx-1">{formatNumber(dev)}</span>
      </>
    )}
  </Badge>
);
