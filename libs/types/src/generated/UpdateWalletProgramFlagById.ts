/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import * as general from '../lib';

// ====================================================
// GraphQL mutation operation: UpdateWalletProgramFlagById
// ====================================================

export interface UpdateWalletProgramFlagById_update_wallet_by_pk {
  id: string;
}

export interface UpdateWalletProgramFlagById {
  /**
   * update single row of the table: "wallet"
   */
  update_wallet_by_pk: UpdateWalletProgramFlagById_update_wallet_by_pk | null;
}

export interface UpdateWalletProgramFlagByIdVariables {
  id: string;
  program: boolean;
}
