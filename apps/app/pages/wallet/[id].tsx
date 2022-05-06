import { gql } from '@apollo/client';
import { hasuraClient, WalletBallance } from '@forbex-nxr/utils';
import { TokenWelth } from '../../components/token-worth-card';
import { NextPage } from 'next';

const GetLargestWalletIdsQuery = gql`
  query GetLargestWallets {
    wallet(limit: 750, order_by: { worth: desc }) {
      id
    }
  }
`;

const GetWalletByIdQuery = gql`
  query GetWalletById($id: String = "") {
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
  return { paths, fallback: false };
}

// This also gets called at build time
export async function getStaticProps({ params }) {
  // params contains the post `id`.
  // If the route is like /posts/1, then params.id is 1
  const {
    data: { wallet_by_pk },
  } = await hasuraClient.query({
    query: GetWalletByIdQuery,
    variables: params,
  });

  // Pass post data to the page via props
  return { props: { wallet: wallet_by_pk } };
}

interface WalletProps {
  wallet: WalletBallance;
}

const Wallet: NextPage = ({ wallet }: WalletProps) => {
  return (
    <>
      <div>{wallet.worth}</div>
      {wallet.tokens.map((token) => (
        <TokenWelth key={token.mint} {...token} />
      ))}
    </>
  );
};

export default Wallet;
