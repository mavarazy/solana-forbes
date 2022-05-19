/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import * as general from '../lib';

// ====================================================
// GraphQL mutation operation: InsertCoin
// ====================================================

export interface InsertCoin_insert_coin_one {
  mint: string;
  decimals: number;
  cap: general.numeric;
  supply: general.numeric;
  coingeckoId: string | null;
  usd: general.numeric;
}

export interface InsertCoin {
  /**
   * insert a single row into the table: "coin"
   */
  insert_coin_one: InsertCoin_insert_coin_one | null;
}

export interface InsertCoinVariables {
  mint: string;
  decimals: number;
  usd: general.numeric;
  cap: general.numeric;
  supply: general.numeric;
  coingeckoId?: string | null;
}
