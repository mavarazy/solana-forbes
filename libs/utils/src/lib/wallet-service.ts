import { Connection, PublicKey } from '@solana/web3.js';
import { WalletBallance } from '@forbex-nxr/types';
import { TokenWorthService } from './token-worth-service';
import { ProgramFlagService } from './program-flag-service';
import { PriceService } from './price-service';

const getSolBalance = async (
  connection: Connection,
  accountId: string
): Promise<number> => {
  const publicKey = new PublicKey(accountId);
  const balance = await connection.getBalance(publicKey);

  return balance / Math.pow(10, 9);
};

const getWalletBalance = async (
  connection: Connection,
  id: string
): Promise<WalletBallance> => {
  // TODO this can be executed in parallel
  const [sol, tokens, program, solPrice] = await Promise.all([
    getSolBalance(connection, id),
    TokenWorthService.getTokenBalance(connection, id),
    ProgramFlagService.isProgram(connection, id),
    PriceService.getSolPrice(),
  ]);

  const totalSols = tokens.nfts.reduce(
    (sum, nft) => (nft.owns ? nft.floorPrice || 0 : 0) + sum,
    sol
  );

  return {
    id,
    summary: {
      general: tokens.general.length,
      nfts: tokens.nfts.length,
      dev: tokens.dev.length,
      priced: tokens.priced.length,
    },
    sol,
    tokens,
    worth: tokens.priced.reduce(
      (worth, token) => worth + token.worth,
      totalSols * solPrice
    ),
    program,
  };
};

export const WalletService = {
  getSolBalance,
  getWalletBalance,
};
