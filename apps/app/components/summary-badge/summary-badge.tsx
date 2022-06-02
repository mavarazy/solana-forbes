import { TokenSummary } from '@forbex-nxr/types';
import { TokenTypeIcon } from '../token-type-icon';

export const SummaryBadge = ({ nfts, priced, general, dev }: TokenSummary) => (
  <span className="flex justify-center text-[8px] sm:text-base rounded-full px-1 sm:px-3 sm:py-0.5 bg-gray-500 text-white font-semibold">
    {nfts > 0 && (
      <>
        <TokenTypeIcon type="nfts" className="flex self-center" />
        <span className="self-center mx-1 sm:mx-2">{nfts}</span>
      </>
    )}
    {priced > 0 && (
      <>
        <TokenTypeIcon type="priced" className="flex self-center" />
        <span className="self-center mx-1 sm:mx-2">{priced}</span>
      </>
    )}
    {general > 0 && (
      <>
        <TokenTypeIcon type="general" className="flex self-center" />
        <span className="self-center mx-1 sm:mx-2">{general}</span>
      </>
    )}
    {dev > 0 && (
      <>
        <TokenTypeIcon type="dev" className="flex self-center" />
        <span className="self-center mx-1 sm:mx-2">{dev}</span>
      </>
    )}
  </span>
);
