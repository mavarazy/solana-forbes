/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import * as general from '../lib';

// ====================================================
// GraphQL mutation operation: InsertWallet
// ====================================================

export interface InsertWallet_insert_wallet_one {
  id: string;
  tokens: general.TokenWorthSummary;
  worth: general.numeric;
  sol: general.numeric;
  summary: general.TokenSummary;
  program: boolean;
}

export interface InsertWallet {
  /**
   * insert a single row into the table: "wallet"
   */
  insert_wallet_one: InsertWallet_insert_wallet_one | null;
}

export interface InsertWalletVariables {
  id: string;
  sol: general.numeric;
  summary: general.TokenSummary;
  tokens: general.TokenWorthSummary;
  worth: general.numeric;
  program: boolean;
}
