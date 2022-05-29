import { WalletBallance } from '@forbex-nxr/types';
import { NextPage } from 'next';
import { WalletService } from '@forbex-nxr/utils';
import { useEffect, useState } from 'react';
import { clusterApiUrl, Connection } from '@solana/web3.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/pro-light-svg-icons';
import { WalletPage } from '../../components/wallet-page';

// This function gets called at build time
export async function getStaticPaths() {
  return { paths: [], fallback: true };
}

// This also gets called at build time
export async function getStaticProps({ params: { id } }) {
  return { props: { id } };
}

interface WalletProps {
  id: string;
}

const Wallet: NextPage<WalletProps> = ({ id }) => {
  const [wallet, setWallet] = useState<WalletBallance>({
    id,
    worth: 0,
    sol: 0,
    summary: {},
    tokens: {
      priced: [],
      general: [],
      dev: [],
      nfts: [],
    },
    program: true,
  });
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setLoading(true);

      const connection = new Connection(
        clusterApiUrl('mainnet-beta'),
        'confirmed'
      );
      WalletService.getWalletBalance(connection, id)
        .then(setWallet)
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex flex-1 justify-center items-center">
        <FontAwesomeIcon
          icon={faSpinner}
          spin
          className="h-24 w-24 text-brand"
        />
      </div>
    );
  }

  return <WalletPage {...wallet} />;
};

export default Wallet;
