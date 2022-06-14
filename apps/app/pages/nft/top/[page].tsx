import React from 'react';
import type { NextPage } from 'next';
import { gql } from '@apollo/client';
import { hasuraClient } from '@forbex-nxr/utils';
import {
  GetNftCollectionPrices,
  GetNftCollectionPricesVariables,
  GetNftMarketplaceStats,
  NftCollectionPrice,
  NftMarketplace,
} from '@forbex-nxr/types';
import Head from 'next/head';
import { NFTCollectionCard } from '../../../components/nft-collection-card';
import { Pagination } from '../../../components/pagination';
import { GetNftMarketplaceStatsQuery } from '../../../utils/get-nft-marketplace-stats';
import { NftMarketplaceSelector } from '../../../components/nft-marketplace-selector';

const ItemsPerPage = 30;

const GetNftCollectionPricesQuery = gql`
  query GetNftCollectionPrices($offset: Int, $limit: Int) {
    nft_collection_price(
      order_by: { volume: desc }
      offset: $offset
      limit: $limit
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
    nft_collection_price_stats {
      count
      marketplace
    }
  }
`;

export async function getStaticPaths() {
  const {
    data: { nft_collection_price_stats },
  } = await hasuraClient.query<GetNftMarketplaceStats>({
    query: GetNftMarketplaceStatsQuery,
  });

  const total = nft_collection_price_stats.reduce(
    (sum: number, { count }) => sum + Number(count),
    0
  );

  return {
    paths: Array(Math.ceil(Number(total) / ItemsPerPage))
      .fill(null)
      .map((_, page) => ({
        params: {
          page: page.toString(),
        },
      })),
    fallback: false,
  };
}

export async function getStaticProps({ params: { page } }) {
  const {
    data: { nft_collection_price: nfts, nft_collection_price_stats },
  } = await hasuraClient.query<
    GetNftCollectionPrices,
    GetNftCollectionPricesVariables
  >({
    query: GetNftCollectionPricesQuery,
    variables: {
      offset: parseInt(page) * ItemsPerPage,
      limit: ItemsPerPage,
    },
  });

  return {
    props: {
      nfts,
      page: parseInt(page),
      stats: nft_collection_price_stats,
    },
    revalidate: 3600,
  };
}

const NftMarketplacePage: NextPage<{
  page: number;
  nfts: NftCollectionPrice[];
  stats: Array<{ marketplace: NftMarketplace; count: BigInt }>;
}> = ({ page, nfts, stats }) => {
  const total = stats.reduce((sum, { count }) => sum + Number(count), 0);

  return (
    <>
      <Head>
        <title>Top nft collections - page {page + 1}</title>
      </Head>
      <main className="flex flex-1 flex-col">
        <NftMarketplaceSelector stats={stats} selected={NftMarketplace.top} />
        <div className="flex flex-1 m-2 sm:m-4 justify-center items-center">
          <div className="max-w-5xl flex flex-col flex-1 self-start">
            <h1 className="text-3xl mt-3 tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
              <span className="xl:inline ml-2">Top</span>{' '}
              <span className="text-brand xl:inline">NFT</span>
            </h1>
            <h1 className="text-xl ml-3 sm:ml-5 mb-3 tracking-tight font-extrabold text-brand">
              {total} collections by volume
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
        <Pagination
          page={page}
          pageSize={ItemsPerPage}
          total={total}
          origin="/nft/top"
        />
      </main>
    </>
  );
};

export default NftMarketplacePage;
