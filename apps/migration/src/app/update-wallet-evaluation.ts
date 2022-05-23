import {
  GetAllWalletsUpdatedBefore,
  GetAllWalletsUpdatedBeforeVariables,
} from '@forbex-nxr/types';
import {
  hasuraClient,
  NFTService,
  PriceService,
  throttle,
  TokenWorthService,
  WalletService,
} from '@forbex-nxr/utils';
import { clusterApiUrl, Connection } from '@solana/web3.js';
import { GetAllWalletsUpdatedBeforeQuery } from './update-wallets';
import { WalletRepository } from './wallet-repository';

export const updateWalletEvaluation = async () => {
  const {
    data: { wallet },
  } = await hasuraClient.query<
    GetAllWalletsUpdatedBefore,
    GetAllWalletsUpdatedBeforeVariables
  >({
    query: GetAllWalletsUpdatedBeforeQuery,
    variables: {
      updatedBefore: new Date().toISOString(),
    },
  });

  const solPrice = await PriceService.getSolPrice();

  const connection: Connection = new Connection(
    clusterApiUrl('mainnet-beta'),
    'confirmed'
  );

  const tasks = wallet.map(({ id }) => async () => {
    const wallet = await WalletRepository.getById(id);

    const sol = await WalletService.getSolBalance(connection, id);

    const allTokens = wallet.tokens.priced
      .concat(wallet.tokens.general)
      .concat(wallet.tokens.dev);

    const summaryWithoutNfts = await TokenWorthService.evaluateTokens(
      allTokens
    );

    const nfts = await NFTService.estimateNftWorth(wallet.tokens.nfts);

    const tokens = {
      ...summaryWithoutNfts,
      nfts,
    };

    const summary = {
      priced: tokens.priced.length,
      general: tokens.general.length,
      dev: tokens.dev.length,
      nfts: tokens.nfts.length,
    };

    const totalSols = tokens.nfts.reduce(
      (sum, nft) => (nft.owns ? nft.floorPrice || 0 : 0) + sum,
      sol
    );

    const worth = tokens.priced.reduce(
      (worth, token) => worth + token.worth,
      totalSols * solPrice
    );

    const updatedWallet = await WalletRepository.updateWallet({
      ...wallet,
      sol,
      summary,
      tokens,
      worth,
    });

    console.log('Updating: done ', id);
    return updatedWallet;
  });

  console.log('Started');
  await throttle(tasks, 10, 1);
  console.log('Done');
};
