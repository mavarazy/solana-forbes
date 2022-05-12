import { AccountLayout } from '@solana/spl-token';
import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js';
import { WalletBallance } from '@forbex-nxr/types';
import { throttle } from './throttle';
import { WalletRepository } from './wallet-repository';
import { TokenWorthService } from './token-worth-service';
import { ProgramFlagService } from './program-flag-service';
import { PriceService } from './price-service';

const getSolBalance = async (
  connection: Connection,
  accountId: string
): Promise<bigint> => {
  const publicKey = new PublicKey(accountId);
  const balance = await connection.getBalance(publicKey);

  return BigInt(balance);
};

const getWalletBalance = async (id: string): Promise<WalletBallance> => {
  const connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');

  // TODO this can be executed in parallel
  const [sol, tokens, program] = await Promise.all([
    getSolBalance(connection, id).then((sol) => Number(sol) / Math.pow(10, 9)),
    TokenWorthService.getTokenBalance(connection, id),
    ProgramFlagService.isProgram(connection, id),
  ]);

  return {
    id,
    summary: {
      general: tokens.general.length,
      nfts: tokens.nfts.length,
      dev: tokens.dev.length,
      priced: tokens.priced.length,
    },
    sol,
    top: tokens.priced.slice(0, 3),
    tokens,
    worth: tokens.priced.reduce(
      (worth, token) => worth + token.worth,
      sol * PriceService.getSolPrice()
    ),
    program,
  };
};

const getAllWalletBalance = async (
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
      return WalletService.getWalletBalance(wallet);
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

    return WalletService.getAllWalletBalance(topWallets);
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const WalletService = {
  getWalletBalance,
  getLargestWallets,
  getAllWalletBalance,
};
