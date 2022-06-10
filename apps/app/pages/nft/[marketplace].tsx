import React from 'react';
import type { NextPage } from 'next';
import { gql } from '@apollo/client';
import { hasuraClient } from '@forbex-nxr/utils';
import {
  GetNftCollectionPricesByMarketplace,
  GetNftCollectionPricesByMarketplaceVariables,
  NftCollectionPrice,
  NftMarketplace,
} from '@forbex-nxr/types';
import Head from 'next/head';
import { NFTCollectionCard } from '../../components/nft-collection-card';

const GetNftCollectionPricesByMarketplaceQuery = gql`
  query GetNftCollectionPricesByMarketplace(
    $marketplace: nft_marketplace_enum!
  ) {
    nft_collection_price(
      where: { marketplace: { _eq: $marketplace } }
      order_by: { volume: desc }
    ) {
      id
      name
      price
      marketplace
      website
      symbol
      thumbnail
      parent
      volume
      supply
    }
  }
`;

export async function getStaticPaths() {
  return {
    paths: Object.values(NftMarketplace).map((marketplace) => ({
      params: { marketplace },
    })),
    fallback: false,
  };
}

export async function getStaticProps({ params: { marketplace } }) {
  const {
    data: { nft_collection_price: nfts },
  } = await hasuraClient.query<
    GetNftCollectionPricesByMarketplace,
    GetNftCollectionPricesByMarketplaceVariables
  >({
    query: GetNftCollectionPricesByMarketplaceQuery,
    variables: { marketplace: marketplace as NftMarketplace },
  });

  return {
    props: {
      marketplace,
      nfts,
    },
    revalidate: 3600,
  };
}

const Home: NextPage<{
  marketplace: string;
  nfts: NftCollectionPrice[];
}> = ({ marketplace, nfts }) => (
  <>
    <Head>
      <title>NFT {marketplace} collections</title>
    </Head>
    <main className="flex flex-1 flex-col">
      <div className="flex flex-1 m-2 sm:m-4 justify-center items-center">
        <div className="max-w-5xl flex flex-col flex-1 self-start">
          <h1 className="text-3xl mt-3 tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
            <span className="xl:inline ml-2">{marketplace}</span>&nbsp;
            <span className="text-brand">collections</span>
          </h1>
          <h1 className="text-xl ml-3 sm:ml-5 mb-3 tracking-tight font-extrabold text-brand">
            By floor price ({nfts.length})
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
              <NFTCollectionCard key={nft.id} {...nft} />
            ))}
          </div>
        </div>
      </div>
    </main>
  </>
);

export default Home;
