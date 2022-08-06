/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import * as general from '../lib';

import { NftMarketplace } from './globalTypes';

// ====================================================
// GraphQL mutation operation: InsertNftCollectionPrice
// ====================================================

export interface InsertNftCollectionPrice_insert_nft_collection_price_one {
  id: string;
  name: string;
  price: general.numeric;
  marketplace: NftMarketplace;
  marketplaceUrl: string | null;
  website: string | null;
  thumbnail: string | null;
  volume: general.numeric | null;
  supply: general.numeric | null;
}

export interface InsertNftCollectionPrice_insert_nft_collection_price_change_one {
  id: general.uuid;
}

export interface InsertNftCollectionPrice {
  /**
   * insert a single row into the table: "nft_collection_price"
   */
  insert_nft_collection_price_one: InsertNftCollectionPrice_insert_nft_collection_price_one | null;
  /**
   * insert a single row into the table: "nft_collection_price_change"
   */
  insert_nft_collection_price_change_one: InsertNftCollectionPrice_insert_nft_collection_price_change_one | null;
}

export interface InsertNftCollectionPriceVariables {
  id: string;
  name?: string | null;
  symbol?: string | null;
  marketplace: NftMarketplace;
  marketplaceUrl?: string | null;
  website?: string | null;
  thumbnail?: string | null;
  parent?: string | null;
  price: general.numeric;
  volume?: general.numeric | null;
  supply?: general.numeric | null;
  date: general.date;
}
