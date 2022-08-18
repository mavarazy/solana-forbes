/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import * as general from '../lib';

// ====================================================
// GraphQL mutation operation: UpdateNftCollection
// ====================================================

export interface UpdateNftCollection_update_nft_collection_by_pk {
  id: string;
  name: string;
  symbol: string | null;
  website: string;
  thumbnail: string;
  supply: number;
}

export interface UpdateNftCollection {
  /**
   * update single row of the table: "nft_collection"
   */
  update_nft_collection_by_pk: UpdateNftCollection_update_nft_collection_by_pk | null;
}

export interface UpdateNftCollectionVariables {
  id: string;
  name?: string | null;
  symbol?: string | null;
  website?: string | null;
  thumbnail?: string | null;
  parent?: string | null;
}
