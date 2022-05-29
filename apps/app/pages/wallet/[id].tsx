import { NftWorth, TokenWorthSummary, WalletBalance } from '@forbex-nxr/types';
import { NextPage } from 'next';
import {
  NFTWorthService,
  PriceService,
  ProgramFlagService,
  TokenWorthService,
  WalletService,
  WorthUtils,
} from '@forbex-nxr/utils';
import { Reducer, useEffect, useReducer, useState } from 'react';
import { clusterApiUrl, Connection } from '@solana/web3.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/pro-light-svg-icons';
import { WalletPage } from '../../components/wallet-page';

// This function gets called at build time
export async function getStaticPaths() {
  return { paths: [], fallback: true };
}

// This also gets called at build time
export async function getStaticProps({ params: { id } }) {
  return { props: { id } };
}

type WalletActions =
  | {
      type: 'SET_ID';
      payload: string;
    }
  | {
      type: 'SET_SOL';
      payload: number;
    }
  | {
      type: 'SET_TOKENS';
      payload: TokenWorthSummary;
    }
  | {
      type: 'SET_NFTS';
      payload: NftWorth[];
    }
  | {
      type: 'SET_PROGRAM';
      payload: boolean;
    };

type PageActions =
  | WalletActions
  | {
      type: 'SET_SOL_PRICE';
      payload: number;
    };

interface PageState {
  wallet: WalletBalance;
  solPrice: number;
}

const walletReducer: Reducer<WalletBalance, PageActions> = (
  state: WalletBalance,
  action: WalletActions
) => {
  switch (action.type) {
    case 'SET_ID': {
      return {
        ...state,
        id: action.payload,
      };
    }
    case 'SET_SOL': {
      return {
        ...state,
        sol: action.payload,
      };
    }
    case 'SET_NFTS': {
      const nftMints = new Set(action.payload.map(({ mint }) => mint));

      const tokens: TokenWorthSummary = {
        ...state.tokens,
        dev: state.tokens.dev.filter((dev) => !nftMints.has(dev.mint)),
        nfts: action.payload,
      };

      return {
        ...state,
        summary: {
          priced: tokens.priced.length,
          general: tokens.general.length,
          dev: tokens.dev.length,
          nfts: tokens.nfts.length,
        },
        tokens: tokens,
      };
    }
    case 'SET_TOKENS': {
      return {
        ...state,
        summary: {
          priced: action.payload.priced.length,
          general: action.payload.general.length,
          dev: action.payload.dev.length,
          nfts: action.payload.nfts.length,
        },
        tokens: action.payload,
      };
    }
    case 'SET_PROGRAM': {
      return {
        ...state,
        program: action.payload,
      };
    }
    default:
      return state;
  }
};

const pageReducer: Reducer<PageState, PageActions> = (
  state: PageState,
  action: PageActions
) => {
  if (action.type === 'SET_SOL_PRICE') {
    const solPrice = action.payload;
    return {
      solPrice: action.payload,
      wallet: {
        ...state.wallet,
        worth: WorthUtils.getWalletWorth(
          solPrice,
          state.wallet.sol,
          state.wallet.tokens
        ),
      },
    };
  } else {
    const wallet = walletReducer(state.wallet, action);
    return {
      solPrice: state.solPrice,
      wallet: {
        ...wallet,
        worth: WorthUtils.getWalletWorth(
          state.solPrice,
          wallet.sol,
          wallet.tokens
        ),
      },
    };
  }
};

interface WalletProps {
  id: string;
}

const Wallet: NextPage<WalletProps> = ({ id }) => {
  const [state, dispatch] = useReducer(pageReducer, {
    wallet: {
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
    },
    solPrice: 45,
  });

  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setLoading(true);

      dispatch({ type: 'SET_ID', payload: id });

      const connection = new Connection(
        clusterApiUrl('mainnet-beta'),
        'confirmed'
      );

      Promise.all([
        PriceService.getSolPrice().then((solPrice) =>
          dispatch({ type: 'SET_SOL_PRICE', payload: solPrice })
        ),

        WalletService.getSolBalance(connection, id).then((sol) => {
          dispatch({ type: 'SET_SOL', payload: sol });
        }),
        TokenWorthService.getTokenBalance(connection, id).then((tokens) => {
          dispatch({ type: 'SET_TOKENS', payload: tokens });
          return NFTWorthService.getPossibleNfts(connection, tokens.dev).then(
            (nfts) => {
              dispatch({ type: 'SET_NFTS', payload: nfts });
            }
          );
        }),
        ProgramFlagService.isProgram(connection, id).then((isProgram) => {
          dispatch({ type: 'SET_PROGRAM', payload: isProgram });
        }),
      ]).then(() => {
        setLoading(false);
      });
    }
  }, [id]);

  return (
    <>
      {isLoading && (
        <FontAwesomeIcon
          icon={faCircleNotch}
          spin
          className="h-24 w-24 m-12 text-brand self-center flex"
        />
      )}
      <WalletPage {...state.wallet} />
    </>
  );
};

export default Wallet;
