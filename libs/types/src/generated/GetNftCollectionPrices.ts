/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import * as general from '../lib';

import { NftMarketplace } from './globalTypes';

// ====================================================
// GraphQL query operation: GetNftCollectionPrices
// ====================================================

export interface GetNftCollectionPrices_nft_collection_price {
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

export interface GetNftCollectionPrices_nft_collection_price_stats {
  count: bigint | null;
  marketplace: string | null;
}

export interface GetNftCollectionPrices {
  /**
   * fetch data from the table: "nft_collection_price"
   */
  nft_collection_price: GetNftCollectionPrices_nft_collection_price[];
  /**
   * fetch data from the table: "nft_collection_price_stats"
   */
  nft_collection_price_stats: GetNftCollectionPrices_nft_collection_price_stats[];
}
