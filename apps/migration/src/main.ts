import { updateNftCollectionPrice } from './app/nft-collection';
// import { updateTokenWorthSummary } from './app/update-token-worth-summary';
import { updateWalletEvaluation } from './app/update-wallet-evaluation';

const execute = async () => {
  try {
    await updateWalletEvaluation();
    await updateTokenWorthSummary();
    await updateNftCollectionPrice();
  } catch (err) {
    console.error(err);
  }
  console.log('Done');
};

execute().then(() => {
  console.log('Exit');
  process.exit(0);
});
