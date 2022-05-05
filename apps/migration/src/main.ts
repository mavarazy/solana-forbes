import { gql } from '@apollo/client';
import {
  hasuraClient,
  PriceService,
  throttle,
  TokenService,
  TokenWorth,
} from '@forbex-nxr/utils';
import { TokenListProvider } from '@solana/spl-token-registry';

const loadLatest = async () => {
  const resolvedTokens = await new TokenListProvider().resolve();
  const tokens = resolvedTokens.filterByClusterSlug('mainnet-beta').getList();

  tokens.sort((a, b) => a.name.localeCompare(b.name));

  const tasks = tokens.map((token, i) => async () => {
    console.log('Switching to ', i, ' ', token.name);
    return await TokenService.getLargestWallets(token.address);
  });

  throttle(tasks, 0.5, 1);
};

const GetAllWalletsQuery = gql`
  query GetAllWallets {
    wallet(where: { top: { _lt: "[]" } }, order_by: { worth: desc }) {
      id
      worth
    }
  }
`;

const GetWalletByIdQuery = gql`
  query GetWalletById($id: String!) {
    wallet_by_pk(id: $id) {
      id
      sol
      tokens
    }
  }
`;

const UpdateWalletTopByIdQuery = gql`
  mutation UpdateWalletTopById($id: String!, $top: jsonb!) {
    update_wallet_by_pk(pk_columns: { id: $id }, _set: { top: $top }) {
      id
    }
  }
`;

const updateTop = async () => {
  const {
    data: { wallet },
  } = await hasuraClient.query({ query: GetAllWalletsQuery });

  const tasks = wallet.map(({ id }) => async () => {
    console.log('Updating: start ', id);
    const {
      data: { wallet_by_pk: wallet },
    } = await hasuraClient.query({
      query: GetWalletByIdQuery,
      variables: { id },
    });

    const solTokenWallet: TokenWorth = {
      amount: wallet.sol,
      mint: 'So11111111111111111111111111111111111111112',
      worth: wallet.sol * PriceService.getSolWorth(wallet.sol),
      usd: PriceService.getSolPrice().usd,
    };

    const allTokens: TokenWorth[] = wallet.tokens
      .concat([solTokenWallet])
      .sort((a, b) => b.worth - a.worth);

    await hasuraClient.mutate({
      mutation: UpdateWalletTopByIdQuery,
      variables: {
        id,
        top: allTokens.slice(0, 3),
      },
    });

    console.log('Updating: done ', id);
  });

  console.log('Started');
  await throttle(tasks, 1, 10);
  console.log('Done');
};

updateTop();
