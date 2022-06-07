import React from 'react';
import type { NextPage } from 'next';
import { gql } from '@apollo/client';
import { hasuraClient } from '@forbex-nxr/utils';
import { GetNftCollectionPrice, NftCollectionPrice } from '@forbex-nxr/types';
import Head from 'next/head';
import { NFTCollectionCard } from '../../components/nft-collection-card';
import { NFTCard } from '../../components/nft-panel/nft-card';

const GetNftCollectionPricesQuery = gql`
  query GetNftCollectionPrices {
    nft_collection_price(order_by: { price: desc }, limit: 30) {
      id
      name
      price
      source
      website
      symbol
      thumbnail
    }
  }
`;

export async function getStaticProps(context) {
  const {
    data: { nft_collection_price: nfts },
  } = await hasuraClient.query<GetNftCollectionPrice>({
    query: GetNftCollectionPricesQuery,
  });

  return {
    props: {
      nfts,
    },
    revalidate: 3600,
  };
}

const TopNft: NextPage<{
  nfts: NftCollectionPrice[];
}> = ({ nfts }) => (
  <>
    <Head>
      <title>Top nft collections</title>
    </Head>
    <main className="flex flex-1 flex-col">
      <div className="flex flex-1 m-2 sm:m-4 justify-center items-center">
        <div className="max-w-5xl flex flex-col flex-1 self-start">
          <h1 className="text-3xl mt-3 tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
            <span className="xl:inline ml-2">Top</span>{' '}
            <span className="text-brand xl:inline">NFT</span>
          </h1>
          <h1 className="text-xl ml-3 sm:ml-5 mb-3 tracking-tight font-extrabold text-brand">
            By floor price
          </h1>
        </div>
      </div>
      <div className="flex flex-1 m-2 sm:m-4 justify-center items-center">
        <div className="max-w-5xl flex flex-col flex-1">
          <div
            role="list"
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {nfts.map((nft) => (
              <NFTCollectionCard
                key={nft.id}
                {...nft}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  </>
);

export default TopNft;
