import { NftWorth } from '@forbex-nxr/utils';
import { NFTCard } from '../nft-card';
import React, { useMemo, useState } from 'react';
import { TokenTypeIcon } from '../token-type-icon';
import { NftCollectionSelector } from './nft-collection-selector';

interface TokenPanelProps {
  name: string;
  nfts: NftWorth[];
}

export const NftPanel = ({ nfts, name }: TokenPanelProps) => {
  const nftsByCollection = useMemo(
    () =>
      nfts.reduce((agg: { [key in string]: NftWorth[] }, nft) => {
        const collection =
          (nft.collection?.family?.trim() ?? nft.collection?.name?.trim()) ||
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

  const [selected, setSelected] = useState(Object.keys(nftsByCollection)[0]);

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
      <NftCollectionSelector
        collections={Object.entries(nftsByCollection)}
        selected={selected}
        onSelect={setSelected}
      />
      <div
        role="list"
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {nftsByCollection[selected].map((nft) => (
          <NFTCard key={nft.mint} {...nft} />
        ))}
      </div>
    </>
  );
};
