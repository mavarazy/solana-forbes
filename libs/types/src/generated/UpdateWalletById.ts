/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import * as general from '../lib';

// ====================================================
// GraphQL mutation operation: UpdateWalletById
// ====================================================

export interface UpdateWalletById_update_wallet_by_pk {
  id: string;
  tokens: general.TokenWorthSummary;
  program: boolean;
  worth: general.numeric;
  sol: general.numeric;
  summary: general.TokenSummary;
  change: general.numeric;
}

export interface UpdateWalletById {
  /**
   * update single row of the table: "wallet"
   */
  update_wallet_by_pk: UpdateWalletById_update_wallet_by_pk | null;
}

export interface UpdateWalletByIdVariables {
  id: string;
  sol: general.numeric;
  summary: general.TokenSummary;
  tokens: general.TokenWorthSummary;
  worth: general.numeric;
  change: general.numeric;
  program: boolean;
}
