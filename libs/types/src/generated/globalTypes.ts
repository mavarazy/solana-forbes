/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import * as general from '../lib';

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum NftMarketplace {
  alphart = 'alphart',
  digitaleyes = 'digitaleyes',
  exchageart = 'exchageart',
  fractal = 'fractal',
  magiceden = 'magiceden',
  solanart = 'solanart',
  solsea = 'solsea',
  top = 'top',
}

/**
 * input type for inserting data into table "token_worth_summary"
 */
export interface token_worth_summary_insert_input {
  amount?: general.numeric | null;
  count?: number | null;
  decimals?: general.numeric | null;
  info?: general.jsonb | null;
  mint?: string | null;
  percent?: general.numeric | null;
  source?: string | null;
  symbol?: string | null;
  usd?: general.numeric | null;
  worth?: general.numeric | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
