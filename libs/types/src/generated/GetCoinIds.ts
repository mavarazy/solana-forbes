/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import * as general from '../lib';

// ====================================================
// GraphQL query operation: GetCoinIds
// ====================================================

export interface GetCoinIds_coin {
  mint: string;
}

export interface GetCoinIds {
  /**
   * fetch data from the table: "coin"
   */
  coin: GetCoinIds_coin[];
}
