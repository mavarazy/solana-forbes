import { gql } from '@apollo/client';

export const GetLargestWalletsQuery = gql`
  query GetLargestWallets {
    wallet(order_by: { worth: desc }, limit: 150) {
      id
      sol
      summary
      worth
      program
      change
    }
  }
`;
