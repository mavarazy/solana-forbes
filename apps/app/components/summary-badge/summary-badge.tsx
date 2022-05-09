import { TokenSummary } from '@forbex-nxr/utils';
import { TokenTypeIcon } from '../token-type-icon';

export const SummaryBadge = ({ nfts, priced, general, dev }: TokenSummary) => (
  <span className="flex justify-center border rounded-full px-3 py-0.5 bg-gray-500 text-white font-semibold">
    <TokenTypeIcon type="nfts" className="flex self-center" />
    <span className="self-center mx-2">{nfts}</span>
    <TokenTypeIcon type="priced" className="flex self-center" />
    <span className="self-center mx-2">{priced}</span>
    <TokenTypeIcon type="general" className="flex self-center" />
    <span className="self-center mx-2">{general}</span>
    <TokenTypeIcon type="dev" className="flex self-center" />
    <span className="self-center mx-2">{dev}</span>
  </span>
);
