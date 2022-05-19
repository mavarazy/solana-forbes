import { gql } from '@apollo/client';
import {
  GetCoinIds,
  InsertCoin,
  TokenPrice,
  UpdateCoin,
} from '@forbex-nxr/types';
import { hasuraClient, PriceService, throttle } from '@forbex-nxr/utils';
import { TokenListProvider } from '@solana/spl-token-registry';
import { clusterApiUrl, Connection } from '@solana/web3.js';

const GetCoinIdsQuery = gql`
  query GetCoinIds {
    coin {
      mint
    }
  }
`;

const UpdateCoinQuery = gql`
  mutation UpdateCoin(
    $mint: String!
    $decimals: Int!
    $usd: numeric!
    $cap: numeric!
    $supply: numeric!
    $coingeckoId: String
  ) {
    update_coin_by_pk(
      pk_columns: { mint: $mint }
      _set: {
        decimals: $decimals
        usd: $usd
        cap: $cap
        supply: $supply
        coingeckoId: $coingeckoId
      }
    ) {
      mint
      decimals
      cap
      supply
      coingeckoId
      usd
    }
  }
`;

const InsertCoinQuery = gql`
  mutation InsertCoin(
    $mint: String!
    $decimals: Int!
    $usd: numeric!
    $cap: numeric!
    $supply: numeric!
    $coingeckoId: String
  ) {
    insert_coin_one(
      object: {
        mint: $mint
        decimals: $decimals
        usd: $usd
        cap: $cap
        supply: $supply
        coingeckoId: $coingeckoId
      }
    ) {
      mint
      decimals
      cap
      supply
      coingeckoId
      usd
    }
  }
`;

const updateCoin = async (
  coin: TokenPrice,
  isNew: boolean
): Promise<TokenPrice> => {
  if (isNew) {
    const {
      data: { update_coin_by_pk },
    } = await hasuraClient.mutate<UpdateCoin>({
      mutation: UpdateCoinQuery,
      variables: coin,
    });

    return update_coin_by_pk;
  } else {
    const {
      data: { insert_coin_one },
    } = await hasuraClient.mutate<InsertCoin>({
      mutation: InsertCoinQuery,
      variables: coin,
    });
    return insert_coin_one;
  }
};

export const updateAllCoins = async () => {
  const {
    data: { coin },
  } = await hasuraClient.query<GetCoinIds>({
    query: GetCoinIdsQuery,
  });

  const mints = new Set(coin.map(({ mint }) => mint));

  const resolvedTokens = await new TokenListProvider().resolve();
  const tasks = resolvedTokens
    .filterByClusterSlug('mainnet-beta')
    .getList()
    .map((token) => async () => {
      const connection = new Connection(
        clusterApiUrl('mainnet-beta'),
        'confirmed'
      );
      let tokenPrice: TokenPrice | null = null;
      if (token.extensions?.coingeckoId) {
        tokenPrice = await PriceService.loadTokenPrice(
          connection,
          token.extensions.coingeckoId,
          token.address
        );
      }
      if (!tokenPrice) {
        try {
          const mint = await PriceService.getTokenMint(
            connection,
            token.address
          );

          tokenPrice = {
            mint: token.address,
            decimals: mint.decimals,
            usd: 0,
            cap: 0,
            supply: 0,
          };
        } catch (err) {
          console.log('Error fetching mint ', token.address);
        }
      }
      if (!tokenPrice) {
        tokenPrice = {
          mint: token.address,
          decimals: token.decimals,
          usd: 0,
          cap: 0,
          supply: 0,
        };
      }
      return updateCoin(tokenPrice, mints.has(token.address));
    });

  const prices = await throttle(tasks, 1000, 1);

  const priceMap = prices.reduce((agg, price) =>
    price === null ? agg : Object.assign(agg, { [price.mint]: price })
  );

  console.log(JSON.stringify(priceMap));
};
