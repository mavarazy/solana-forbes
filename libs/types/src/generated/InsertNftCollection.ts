/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import * as general from '../lib';

// ====================================================
// GraphQL mutation operation: InsertNftCollection
// ====================================================

export interface InsertNftCollection_insert_nft_collection_one {
  id: string;
  name: string;
  website: string;
  thumbnail: string;
  supply: number;
}

export interface InsertNftCollection {
  /**
   * insert a single row into the table: "nft_collection"
   */
  insert_nft_collection_one: InsertNftCollection_insert_nft_collection_one | null;
}

export interface InsertNftCollectionVariables {
  id: string;
  name?: string | null;
  symbol?: string | null;
  website?: string | null;
  thumbnail?: string | null;
  parent?: string | null;
}
