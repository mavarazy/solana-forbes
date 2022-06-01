/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import * as general from '../lib';

// ====================================================
// GraphQL query operation: GetWalletById
// ====================================================

export interface GetWalletById_wallet_by_pk {
  id: string;
  sol: general.numeric;
  worth: general.numeric;
  tokens: general.TokenWorthSummary;
  summary: general.TokenSummary;
  program: boolean;
  change: general.numeric;
}

export interface GetWalletById {
  /**
   * fetch data from the table: "wallet" using primary key columns
   */
  wallet_by_pk: GetWalletById_wallet_by_pk | null;
}

export interface GetWalletByIdVariables {
  id: string;
}
