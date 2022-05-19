/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import * as general from '../lib';

// ====================================================
// GraphQL mutation operation: UpdateCoin
// ====================================================

export interface UpdateCoin_update_coin_by_pk {
  mint: string;
  decimals: number;
  cap: general.numeric;
  supply: general.numeric;
  coingeckoId: string | null;
  usd: general.numeric;
}

export interface UpdateCoin {
  /**
   * update single row of the table: "coin"
   */
  update_coin_by_pk: UpdateCoin_update_coin_by_pk | null;
}

export interface UpdateCoinVariables {
  mint: string;
  decimals: number;
  usd: general.numeric;
  cap: general.numeric;
  supply: general.numeric;
  coingeckoId?: string | null;
}
