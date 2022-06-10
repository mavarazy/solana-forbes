import React from 'react';
import type { NextPage } from 'next';
import { gql } from '@apollo/client';
import { hasuraClient } from '@forbex-nxr/utils';
import {
  GetNftCollectionPricesByMarketplace,
  GetNftCollectionPricesByMarketplaceVariables,
  GetNftMarketplaceStats,
  NftCollectionPrice,
  NftMarketplace,
} from '@forbex-nxr/types';
import Head from 'next/head';
import { NFTCollectionCard } from '../../../components/nft-collection-card';
import { Pagination } from '../../../components/pagination';

const ItemsPerPage = 30;

const GetNftMarketplaceStatsQuery = gql`
  query GetNftMarketplaceStats {
    nft_collection_price_stats {
      count
      marketplace
    }
  }
`;

const GetNftCollectionPricesByMarketplaceQuery = gql`
  query GetNftCollectionPricesByMarketplace(
    $marketplace: nft_marketplace_enum!
    $offset: Int
    $limit: Int
  ) {
    nft_collection_price(
      where: { marketplace: { _eq: $marketplace } }
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

  return {
    paths: nft_collection_price_stats.reduce((agg, { marketplace, count }) => {
      return agg.concat(
        Array(Math.ceil(Number(count) / ItemsPerPage))
          .fill(null)
          .map((_, page) => ({
            params: {
              marketplace,
              page: page.toString(),
            },
          }))
      );
    }, []),
    fallback: false,
  };
}

export async function getStaticProps({ params: { marketplace, page } }) {
  const {
    data: { nft_collection_price: nfts, nft_collection_price_stats },
  } = await hasuraClient.query<
    GetNftCollectionPricesByMarketplace,
    GetNftCollectionPricesByMarketplaceVariables
  >({
    query: GetNftCollectionPricesByMarketplaceQuery,
    variables: {
      marketplace: marketplace as NftMarketplace,
      offset: parseInt(page) * ItemsPerPage,
      limit: ItemsPerPage,
    },
  });

  return {
    props: {
      marketplace,
      nfts,
      page: parseInt(page),
      total: nft_collection_price_stats.find(
        (nft) => nft.marketplace === marketplace
      )?.count,
    },
    revalidate: 3600,
  };
}

const NftMarketplacePage: NextPage<{
  marketplace: string;
  page: number;
  nfts: NftCollectionPrice[];
  total: number;
}> = ({ marketplace, page, nfts, total }) => (
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
            By volume ({total})
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
        origin={`/nft/${marketplace}`}
      />
    </main>
  </>
);

export default NftMarketplacePage;
