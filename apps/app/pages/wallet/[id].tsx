import { gql } from '@apollo/client';
import {
  hasuraClient,
  NumberUtils,
  WalletBallance,
  WalletService,
} from '@forbex-nxr/utils';
import { TokenWorthCard } from '../../components/token-worth-card';
import { NextPage } from 'next';
import { AddressLink } from '../../components/address-link';
import { useRouter } from 'next/router';
import { NFTCard } from '../../components/nft-card';
import { SummaryBadge } from '../../components/summary-badge';
import { SolBadge } from '../../components/sol-badge';

const GetLargestWalletIdsQuery = gql`
  query GetLargestWallets {
    wallet(limit: 10, order_by: { worth: desc }) {
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

const loadWalletFromHasura = async (id: string) => {
  const {
    data: { wallet_by_pk: wallet },
  } = await hasuraClient.query({
    query: GetWalletByIdQuery,
    variables: { id },
  });

  return wallet ?? null;
};

const loadWalletFromSolana = async (id: string) => {
  const wallet = await WalletService.getWalletBalance(id);
  return wallet;
};

const loadWallet = async (id: string) => {
  const wallet = await loadWalletFromSolana(id);
  if (wallet) {
    return wallet;
  }
  return loadWalletFromHasura(id);
};

// This also gets called at build time
export async function getStaticProps({ params: { id } }) {
  const wallet = await loadWallet(id);
  return { props: { wallet } };
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
            <SolBadge sol={wallet.sol} />
          </div>
          <div className="self-end mt-1">
            <SummaryBadge {...wallet.summary} />
          </div>
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
      <div
        role="list"
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-40"
      >
        {wallet.nfts.map((nft) => (
          <NFTCard key={nft.mint} {...nft} />
        ))}
      </div>
    </div>
  );
};

export default Wallet;
