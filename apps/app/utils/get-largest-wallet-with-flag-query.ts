import { gql } from '@apollo/client';

export const GetLargestWalletWithFlagQuery = gql`
  query GetLargestWalletWithFlag($program: Boolean) {
    wallet(
      where: { program: { _eq: $program } }
      order_by: { worth: desc }
      limit: 150
    ) {
      id
      sol
      summary
      worth
      program
      change
    }
  }
`;
