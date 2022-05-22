import { createContext, useContext } from 'react';

export type GlobalContextType = {
  onError: (error: unknown) => void;
};

export const GlobalContext = createContext<GlobalContextType>({
  onError: (_: unknown) => null,
});

export const useGlobalState = () => useContext(GlobalContext);
