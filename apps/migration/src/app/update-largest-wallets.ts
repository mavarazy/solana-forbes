import { WalletBallance } from '@forbex-nxr/types';
import { throttle, WalletService } from '@forbex-nxr/utils';
import { AccountLayout } from '@solana/spl-token';
import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js';
import { WalletRepository } from './wallet-repository';

const getAllWalletBalance = async (
  connection: Connection,
  wallets: string[]
): Promise<WalletBallance[]> => {
  const existingWallets = await WalletRepository.fetchExistingWallets(wallets);

  const newWallets = wallets.filter(
    (topWallet) => !existingWallets.find((wallet) => wallet.id === topWallet)
  );

  console.log(`Found ${newWallets.length} new wallets`);
  const freshWallets = await throttle(
    newWallets.map((wallet, i) => async () => {
      console.log(`Extraxting ${i} wallet ${wallet}`);
      return WalletService.getWalletBalance(connection, wallet);
    }),
    1000,
    1
  );

  WalletRepository.createWalletsInBatch(freshWallets);

  return existingWallets.concat(freshWallets);
};

const getLargestWallets = async (mint: string): Promise<WalletBallance[]> => {
  try {
    const connection = new Connection(
      clusterApiUrl('mainnet-beta'),
      'confirmed'
    );
    const { value: accounts } = await connection.getTokenLargestAccounts(
      new PublicKey(mint)
    );

    const extractOwnerAccountTask = accounts.map((account) => async () => {
      const accountBuffer = await connection.getAccountInfo(account.address);
      const accountInfo = AccountLayout.decode(accountBuffer!.data);
      const owner = accountInfo.owner;
      return owner.toString();
    });

    const topWallets = await throttle(extractOwnerAccountTask, 1000, 5);
    console.log('Extracted all owners');

    return getAllWalletBalance(connection, topWallets);
  } catch (err) {
    console.error(err);
    return [];
  }
};