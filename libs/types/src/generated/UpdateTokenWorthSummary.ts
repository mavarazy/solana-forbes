/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import * as general from '../lib';

import { token_worth_summary_insert_input } from './globalTypes';

// ====================================================
// GraphQL mutation operation: UpdateTokenWorthSummary
// ====================================================

export interface UpdateTokenWorthSummary_delete_token_worth_summary_returning {
  mint: string;
}

export interface UpdateTokenWorthSummary_delete_token_worth_summary {
  /**
   * data from the rows affected by the mutation
   */
  returning: UpdateTokenWorthSummary_delete_token_worth_summary_returning[];
}

export interface UpdateTokenWorthSummary_insert_token_worth_summary_returning {
  mint: string;
}

export interface UpdateTokenWorthSummary_insert_token_worth_summary {
  /**
   * data from the rows affected by the mutation
   */
  returning: UpdateTokenWorthSummary_insert_token_worth_summary_returning[];
}

export interface UpdateTokenWorthSummary {
  /**
   * delete data from the table: "token_worth_summary"
   */
  delete_token_worth_summary: UpdateTokenWorthSummary_delete_token_worth_summary | null;
  /**
   * insert data into the table: "token_worth_summary"
   */
  insert_token_worth_summary: UpdateTokenWorthSummary_insert_token_worth_summary | null;
}

export interface UpdateTokenWorthSummaryVariables {
  objects: token_worth_summary_insert_input[];
}
