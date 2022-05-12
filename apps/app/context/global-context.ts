import { createContext, useContext } from 'react';
import { TokenInfo } from '@solana/spl-token-registry';
import { WalletBallance } from '@forbex-nxr/types';

export type PriceMap = { [key in string]: { usd: number; decimals: number } };

export interface AppState {
  currentToken: TokenInfo;
  tokens: TokenInfo[];
  wallets: { [key in string]: WalletBallance };
}

export const DefaultToken: TokenInfo = {
  chainId: 101,
  address: 'HKfs24UEDQpHS5hUyKYkHd9q7GY5UQ679q2bokeL2whu',
  symbol: 'Test Token',
  name: 'Fake Token',
  decimals: 6,
  logoURI:
    'https://thumbor.forbes.com/thumbor/400x0/smart/https%3A%2F%2Fspecials-images.forbesimg.com%2Fimageserve%2F5fb2dd653912b249a1647b2e%2F960x0.jpg%3FcropX1%3D0%26cropX2%3D400%26cropY1%3D0%26cropY2%3D400',
  extensions: {
    coingeckoId: 'tiny',
  },
};

export type GlobalContextType = {
  state: AppState;

  onError: (error: unknown) => void;
};

export const GlobalContext = createContext<GlobalContextType>({
  state: {
    currentToken: DefaultToken,
    tokens: [],
    wallets: {},
  },

  onError: (_: unknown) => null,
});

export const useGlobalState = () => useContext(GlobalContext);
