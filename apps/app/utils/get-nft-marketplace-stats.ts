import { gql } from '@apollo/client';

export const GetNftMarketplaceStatsQuery = gql`
  query GetNftMarketplaceStats {
    nft_collection_price_stats {
      count
      marketplace
    }
  }
`;
