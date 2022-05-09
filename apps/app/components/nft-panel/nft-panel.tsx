import { NftWorth } from '@forbex-nxr/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHexagonVerticalNft } from '@fortawesome/pro-light-svg-icons';
import { NFTCard } from '../nft-card';
import React, { useMemo } from 'react';

interface TokenPanelProps {
  name: string;
  nfts: NftWorth[];
}

export const NftPanel = ({ nfts, name }: TokenPanelProps) => {
  const nftsByCollection = useMemo(
    () =>
      nfts.reduce((agg: { [key in string]: NftWorth[] }, nft) => {
        const collection =
          nft.collection?.family ?? nft.collection?.name ?? 'Non collectable';

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
      <span className="flex text-4xl my-10">
        <FontAwesomeIcon
          icon={faHexagonVerticalNft}
          className="m-4 h-16 w-16 flex"
        />
        <span className="flex self-center">
          {name} ({nfts.length})
        </span>
      </span>
      {Object.entries(nftsByCollection).map(([collection, nfts]) => (
        <React.Fragment key={collection}>
          <span className="flex self-center text-3xl my-10 font-bold">
            {collection}
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
