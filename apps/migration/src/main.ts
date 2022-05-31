// import { updateTokenToSupply } from './app/price/update-token-to-supply';
// import { loadImages } from './app/load-images';
// import { updateWalletEvaluation } from './app/update-wallet-evaluation';
// import { updateNftCollectionPrice } from './app/nft-collection';
// import { exportNftCollectionPrice } from './app/load-nft-collection-price';
// import { updateNftCollectionPrice } from './app/nft-collection';
// import { updateLargestWallets } from './app/update-largest-wallets';
import { updateTokenWorthSummary } from './app/update-token-worth-summary';
// import { updateWalletEvaluation } from './app/update-wallet-evaluation';

// updateNftCollectionPrice();

// exportNftCollectionPrice();

updateTokenWorthSummary().then(() => console.log('Done'));
// updateTokenToSupply();
// updateWalletEvaluation();
// loadImages().then(() => console.log('Done'));

// updateNftCollectionPrice().then(() => console.log('Done'));
