import { gql } from '@apollo/client';
import { TokenSummary, TokenWorthSummary } from '@forbex-nxr/types';
import {
  hasuraClient,
  NFTService,
  throttle,
  WalletRepository,
} from '@forbex-nxr/utils';
import { clusterApiUrl, Connection } from '@solana/web3.js';

const connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');

const GetWalletWithoutSummaryQuery = gql`
  query GetWalletWithoutSummary {
    wallet(where: { summary: { _is_null: true } }) {
      id
    }
  }
`;

const UpdateWalletSummaryByIdQuery = gql`
  mutation UpdateWalletSummaryById(
    $id: String!
    $summary: jsonb!
    $tokens: jsonb!
  ) {
    update_wallet_by_pk(
      pk_columns: { id: $id }
      _set: { summary: $summary, tokens: $tokens }
    ) {
      id
    }
  }
`;

export const updateSummary = async () => {
  const {
    data: { wallet },
  } = await hasuraClient.query({ query: GetWalletWithoutSummaryQuery });

  const tasks = wallet.map(({ id }) => async () => {
    try {
      const { tokens } = await WalletRepository.getById(id);

      const nfts = await NFTService.loadNfts(
        connection,
        tokens.filter(
          (token) => (token.amount === 1 || token.amount === 0) && !token.usd
        )
      );

      const ftTokens = tokens.filter(
        (token) => !nfts.some((nft) => token.mint === nft.mint)
      );

      const priced = ftTokens.filter((token) => token.worth > 0);
      const general = ftTokens.filter(
        (token) => token.worth === 0 && token.info && !token.usd
      );

      const dev = ftTokens.filter((token) => token.worth === 0 && !token.info);

      const summary: TokenSummary = {
        general: general.length,
        nfts: nfts.length,
        priced: priced.length,
        dev: dev.length,
      };

      const allTokens: TokenWorthSummary = {
        dev,
        general,
        nfts,
        priced,
      };

      console.log('Updating: start ', id);
      await hasuraClient.mutate({
        mutation: UpdateWalletSummaryByIdQuery,
        variables: {
          id,
          tokens: allTokens,
          summary,
        },
      });

      console.log('Updating: done ', id);
    } catch (err) {
      console.log(err);
    }
  });

  console.log('Started');
  await throttle(tasks, 250, 1);
  console.log('Done');
};
