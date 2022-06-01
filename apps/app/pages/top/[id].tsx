import { gql } from '@apollo/client';
import {
  GetLargestWalletWithFlag,
  GetLargestWalletWithFlagVariables,
  WalletBalance,
} from '@forbex-nxr/types';
import { hasuraClient } from '@forbex-nxr/utils';
import { GetLargestWalletWithFlagQuery } from '../../utils/get-largest-wallet';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { WalletPage } from '../../components/wallet-page';

const GetWalletByIdQuery = gql`
  query GetWalletById($id: String!) {
    wallet_by_pk(id: $id) {
      id
      sol
      worth
      tokens
      summary
      program
      change
    }
  }
`;

// This function gets called at build time
export async function getStaticPaths() {
  const machineWallets = await hasuraClient.query<
    GetLargestWalletWithFlag,
    GetLargestWalletWithFlagVariables
  >({ query: GetLargestWalletWithFlagQuery, variables: { program: true } });

  const personWallets = await hasuraClient.query<
    GetLargestWalletWithFlag,
    GetLargestWalletWithFlagVariables
  >({ query: GetLargestWalletWithFlagQuery, variables: { program: false } });

  // Get the paths we want to pre-render based on posts
  const paths = machineWallets.data.wallet
    .concat(personWallets.data.wallet)
    .map((params) => ({
      params: params,
    }));

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: true };
}

const loadWallet = async (id: string) => {
  const {
    data: { wallet_by_pk: wallet },
  } = await hasuraClient.query({
    query: GetWalletByIdQuery,
    variables: { id },
  });
  if (wallet) {
    return wallet;
  }
};

// This also gets called at build time
export async function getStaticProps({ params: { id } }) {
  const wallet = await loadWallet(id);
  if (wallet) {
    return { props: { wallet }, revalidate: 3600 };
  }
  return {
    redirect: {
      destination: `/wallet/${id}`,
      permanent: false,
    },
  };
}

interface TopProps {
  wallet: WalletBalance;
}

const Top: NextPage<TopProps> = ({ wallet }) => {
  const router = useRouter();

  if (router.isFallback || !wallet) {
    return (
      <div className="flex flex-1 justify-center items-center">
        <div className="text-4xl font-bold">Loading...</div>
      </div>
    );
  }

  return <WalletPage {...wallet} />;
};

export default Top;
