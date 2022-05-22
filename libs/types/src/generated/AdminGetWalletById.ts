/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import * as general from '../lib';

// ====================================================
// GraphQL query operation: AdminGetWalletById
// ====================================================

export interface AdminGetWalletById_wallet_by_pk {
  id: string;
  sol: general.numeric;
  worth: general.numeric;
  tokens: general.TokenWorthSummary;
  summary: general.TokenSummary;
  program: boolean;
}

export interface AdminGetWalletById {
  /**
   * fetch data from the table: "wallet" using primary key columns
   */
  wallet_by_pk: AdminGetWalletById_wallet_by_pk | null;
}

export interface AdminGetWalletByIdVariables {
  id: string;
}
