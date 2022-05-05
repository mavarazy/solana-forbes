import { AccountLayout } from '@solana/spl-token';
import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js';
import { throttle } from './throttle';
import { WalletBallance } from './types';
import { WalletService } from './wallet-service';

const getLargestWallets = async (token: string): Promise<WalletBallance[]> => {
  try {
    const connection = new Connection(
      clusterApiUrl('mainnet-beta'),
      'confirmed'
    );
    const { value: accounts } = await connection.getTokenLargestAccounts(
      new PublicKey(token)
    );

    const extractOwnerAccountTask = accounts.map((account) => async () => {
      const accountBuffer = await connection.getAccountInfo(account.address);
      const accountInfo = AccountLayout.decode(accountBuffer!.data);
      const owner = accountInfo.owner;
      return owner.toString();
    });

    const topWallets = await throttle(extractOwnerAccountTask, 1000, 5);
    console.log('Extracted all owners');

    return WalletService.getAllWalletBalance(topWallets);
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const TokenService = {
  getLargestWallets,
};
