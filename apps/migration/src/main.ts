import { updateNftCollectionPrice } from './app/nft-collection';
import { updateWalletEvaluation } from './app/update-wallet-evaluation';

updateNftCollectionPrice().then(() => updateWalletEvaluation());
