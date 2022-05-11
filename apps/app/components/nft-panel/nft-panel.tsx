import { NftWorth } from '@forbex-nxr/utils';
import { NFTCard } from '../nft-card';
import React, { useMemo } from 'react';
import { TokenTypeIcon } from '../token-type-icon';

interface TokenPanelProps {
  name: string;
  nfts: NftWorth[];
}

export const NftPanel = ({ nfts, name }: TokenPanelProps) => {
  const nftsByCollection = useMemo(
    () =>
      nfts.reduce((agg: { [key in string]: NftWorth[] }, nft) => {
        const collection =
          (nft.collection?.family.trim() ?? nft.collection?.name.trim()) ||
          'Non collectable';

        if (agg[collection]) {
          agg[collection].push(nft);
        } else {
          agg[collection] = [nft];
        }

        return agg;
      }, {}),
    [nfts]
  );

  if (nfts.length === 0) {
    return null;
  }

  return (
    <>
      <span className="flex text-xl md:text-4xl my-2 md:my-10">
        <TokenTypeIcon
          type="nfts"
          className="flex m-4 h-8 w-8 md:h-16 md:w-16"
        />
        <span className="flex self-center">
          {name} ({nfts.length})
        </span>
      </span>
      {Object.entries(nftsByCollection).map(([collection, nfts]) => (
        <React.Fragment key={collection}>
          <span className="flex text-xl m-4 md:text-4xl my-2 md:my-10">
            {collection || 'Collection'}
          </span>
          <div
            key={collection}
            role="list"
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {nfts.map((nft) => (
              <NFTCard key={nft.mint} {...nft} />
            ))}
          </div>
        </React.Fragment>
      ))}
    </>
  );
};
