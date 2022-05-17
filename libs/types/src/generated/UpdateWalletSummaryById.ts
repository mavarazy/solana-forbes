/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import * as general from '../lib';

// ====================================================
// GraphQL mutation operation: UpdateWalletSummaryById
// ====================================================

export interface UpdateWalletSummaryById_update_wallet_by_pk {
  id: string;
}

export interface UpdateWalletSummaryById {
  /**
   * update single row of the table: "wallet"
   */
  update_wallet_by_pk: UpdateWalletSummaryById_update_wallet_by_pk | null;
}

export interface UpdateWalletSummaryByIdVariables {
  id: string;
  summary: general.TokenSummary;
  tokens: general.TokenWorthSummary;
}
