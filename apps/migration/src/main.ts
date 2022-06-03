// import { updateTokenToSupply } from './app/price/update-token-to-supply';
// import { loadImages } from './app/load-images';
// import { exportNftCollectionPrice } from './app/export-nft-collection-price';
// import { updateNftCollectionPrice } from './app/nft-collection';
// import { updateTokenWorthSummary } from './app/update-token-worth-summary';
import { updateTokenWorthSummary } from './app/update-token-worth-summary';
import { updateWalletEvaluation } from './app/update-wallet-evaluation';
// import { updateWalletEvaluation } from './app/update-wallet-evaluation';

const execute = async () => {
  try {
    // await updateNftCollectionPrice();
    // await exportNftCollectionPrice();
    await updateWalletEvaluation();
    await updateTokenWorthSummary();
  } catch (err) {
    console.error(err);
  }
  console.log('Done');
};

execute();
// updateNftCollectionPrice();

// exportNftCollectionPrice();

// updateTokenWorthSummary().then(() => console.log('Done'));
// updateTokenToSupply();
// updateWalletEvaluation();

// updateNftCollectionPrice().then(() => console.log('Done'));
