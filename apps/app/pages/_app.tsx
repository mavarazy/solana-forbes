import React, { useEffect, useReducer, useRef } from 'react';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import {
  WalletBallance,
  GlobalContext,
  AppState,
  DefaultToken,
} from '../context';
import { Layout } from '../components/layout';
import { Notification, NotificationProps } from '../components/notification';
import { TokenInfo, TokenListProvider } from '@solana/spl-token-registry';
import { TokenService, throttle } from '@forbex-nxr/utils';

type AppAction =
  | {
      type: 'SET_CURRENT_TOKEN';
      payload: TokenInfo;
    }
  | {
      type: 'SET_OFFICIAL_TOKENS';
      payload: { tokens: TokenInfo[] };
    }
  | {
      type: 'APPEND_WALLETS';
      payload: WalletBallance[];
    };

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_CURRENT_TOKEN': {
      return {
        ...state,
        currentToken: action.payload,
      };
    }
    case 'SET_OFFICIAL_TOKENS': {
      console.log('Updating official tokens ', action.payload.tokens.length);
      return {
        ...state,
        wallets: {},
        currentToken: action.payload.tokens[0] ?? DefaultToken,
        ...action.payload,
      };
    }
    case 'APPEND_WALLETS': {
      const walletMap = action.payload.reduce(
        (agg, wallet) => Object.assign(agg, { [wallet.id]: wallet }),
        {}
      );
      return {
        ...state,
        wallets: Object.assign({}, state.wallets, walletMap),
      };
    }
    default:
      throw new Error();
  }
}

function MyApp({ Component, pageProps }: AppProps) {
  const notificationRef = useRef<NotificationProps>(null);

  const [state, dispatch] = useReducer(reducer, {
    currentToken: DefaultToken,
    tokens: [],
    wallets: {},
  });

  useEffect(() => {
    new TokenListProvider().resolve().then((resolvedTokens) => {
      const tokens = resolvedTokens
        .filterByClusterSlug('mainnet-beta')
        .getList()
        .filter((token) => token.extensions?.coingeckoId);

      tokens.sort((a, b) => a.name.localeCompare(b.name));

      dispatch({
        type: 'SET_OFFICIAL_TOKENS',
        payload: { tokens },
      });
    });
  }, []);

  useEffect(() => {
    const tasks = state.tokens.map((token) => async () => {
      dispatch({ type: 'SET_CURRENT_TOKEN', payload: token });

      const wallets = await TokenService.getLargestWallets(token.address);
      dispatch({ type: 'APPEND_WALLETS', payload: wallets });
      return wallets;
    });

    throttle(tasks, 0.5, 1);
  }, [state.tokens]);

  return (
    <GlobalContext.Provider
      value={{
        state,
        onError: (error) => notificationRef.current?.error(error),
      }}
    >
      <Layout>
        <Component {...pageProps} />
      </Layout>
      <Notification ref={notificationRef} />
    </GlobalContext.Provider>
  );
}
export default MyApp;
