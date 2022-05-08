import { gql } from '@apollo/client';
import {
  hasuraClient,
  NumberUtils,
  TokenWorth,
  WalletBallance,
} from '@forbex-nxr/utils';
import { TokenWorthCard } from '../../components/token-worth-card';
import { NextPage } from 'next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHexagonVerticalNftSlanted } from '@fortawesome/pro-light-svg-icons';
import { AddressLink } from '../../components/address-link';
import { TokenListProvider } from '@solana/spl-token-registry';
import { useRouter } from 'next/router';

const GetLargestWalletIdsQuery = gql`
  query GetLargestWallets {
    wallet(limit: 50, order_by: { worth: desc }) {
      id
    }
  }
`;

const GetWalletByIdQuery = gql`
  query GetWalletById($id: String!) {
    wallet_by_pk(id: $id) {
      id
      sol
      tokens
      top
      worth
    }
  }
`;

// This function gets called at build time
export async function getStaticPaths() {
  // Call an external API endpoint to get posts
  const {
    data: { wallet },
  } = await hasuraClient.query({ query: GetLargestWalletIdsQuery });

  // Get the paths we want to pre-render based on posts
  const paths = wallet.map((params) => ({
    params: params,
  }));

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: true };
}

// This also gets called at build time
export async function getStaticProps({ params }) {
  const {
    data: { wallet_by_pk: wallet },
  } = await hasuraClient.query({
    query: GetWalletByIdQuery,
    variables: params,
  });

  const resolvedTokens = await new TokenListProvider().resolve();

  const tokenMap = resolvedTokens
    .getList()
    .reduce(
      (agg, tokenInfo) =>
        Object.assign(agg, { [tokenInfo.address]: tokenInfo }),
      {}
    );

  const walletWithTokenInfo = Object.assign(
    { ...wallet },
    {
      top: wallet.top.map((token) =>
        tokenMap[token.mint] ? { ...token, info: tokenMap[token.mint] } : token
      ),
      tokens: wallet.tokens
        .map((token) =>
          tokenMap[token.mint]
            ? { ...token, info: tokenMap[token.mint] }
            : token
        )
        .sort((a: TokenWorth, b: TokenWorth) => {
          if (a.worth === b.worth) {
            if (b.info && a.info) {
              return a.info.name.localeCompare(b.info.name);
            } else if (b.info) {
              return 1;
            } else if (a.info) {
              return -1;
            } else {
              return 0;
            }
          }
          return b.worth - a.worth;
        }),
    }
  );

  // Pass post data to the page via props
  return { props: { wallet: walletWithTokenInfo } };
}

interface WalletProps {
  wallet: WalletBallance;
}

const Wallet: NextPage = (props: WalletProps) => {
  const router = useRouter();
  const { wallet } = props;

  if (router.isFallback) {
    return <div>Loading...</div>;
  }
  return (
    <div className="m-10 relative">
      <div className="flex flex-1 flex-col my-8">
        <span className="flex flex-1 flex-col text-xs absolute top-2 right-2">
          <div className="self-end">
            <span className="flex border rounded-full px-2 py-0.5 shadow-lg bg-green-600 text-white font-bold">
              {wallet.sol.toLocaleString()} SOL
            </span>
          </div>
          {wallet.nfts > 0 && (
            <div className="self-end mt-1">
              <span className="flex justify-center border rounded-full px-2 py-0.5 bg-gray-500 text-white font-semibold">
                <FontAwesomeIcon
                  icon={faHexagonVerticalNftSlanted}
                  className="flex self-center"
                />
                <span className="self-center ml-1">
                  {wallet.nfts.toLocaleString()}
                </span>
              </span>
            </div>
          )}
        </span>
        <AddressLink address={wallet.id}>
          <div className="flex flex-col text-5xl self-center mt-2 font-bold text-gray-900 px-2 justify-center items-center hover:text-indigo-500 cursor-pointer">
            <span className="flex flex-1 justify-center">
              <span>{NumberUtils.asHuman(wallet.worth)}</span>
            </span>
            <span className="flex text-xl mt-2 font-bold">{wallet.id}</span>
          </div>
        </AddressLink>
      </div>
      <div
        role="list"
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {wallet.tokens.map((token) => (
          <TokenWorthCard key={token.mint} {...token} />
        ))}
      </div>
    </div>
  );
};

export default Wallet;
