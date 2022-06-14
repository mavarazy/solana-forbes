/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import * as general from '../lib';

import { NftMarketplace } from './globalTypes';

// ====================================================
// GraphQL query operation: GetAllNftCollectionPrices
// ====================================================

export interface GetAllNftCollectionPrices_nft_collection_price {
  id: string;
  name: string;
  price: general.numeric;
  marketplace: NftMarketplace;
  website: string | null;
  symbol: string | null;
  thumbnail: string | null;
  parent: string | null;
  volume: general.numeric | null;
  supply: general.numeric | null;
}

export interface GetAllNftCollectionPrices_nft_collection_price_stats {
  count: bigint | null;
  marketplace: string | null;
}

export interface GetAllNftCollectionPrices {
  /**
   * fetch data from the table: "nft_collection_price"
   */
  nft_collection_price: GetAllNftCollectionPrices_nft_collection_price[];
  /**
   * fetch data from the table: "nft_collection_price_stats"
   */
  nft_collection_price_stats: GetAllNftCollectionPrices_nft_collection_price_stats[];
}

export interface GetAllNftCollectionPricesVariables {
  offset?: number | null;
  limit?: number | null;
}
