import { Connection, PublicKey } from '@solana/web3.js';
import { NftWorth, TokenWorthSummary, WalletBallance } from '@forbex-nxr/types';
import { TokenWorthService } from './token-worth-service';
import { ProgramFlagService } from './program-flag-service';
import { PriceService } from './price-service';
import { NFTWorthService } from './nft-worth-service';

const getSolBalance = async (
  connection: Connection,
  accountId: string
): Promise<number> => {
  const publicKey = new PublicKey(accountId);
  const balance = await connection.getBalance(publicKey);

  return balance / Math.pow(10, 9);
};

const toWalletBalance = async (
  connection: Connection,
  id: string,
  sol: number,
  nfts: NftWorth[],
  tokensWithoutNfts: TokenWorthSummary
) => {
  const [solPrice, program] = await Promise.all([
    PriceService.getSolPrice(),
    ProgramFlagService.isProgram(connection, id),
  ]);

  const nftMints = new Set<string>(nfts.map((nft) => nft.mint));
  const tokens = {
    ...tokensWithoutNfts,
    dev: tokensWithoutNfts.dev.filter((token) => !nftMints.has(token.mint)),
    nfts,
  };

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

const getWalletBalance = async (
  connection: Connection,
  id: string
): Promise<WalletBallance> => {
  const [sol, tokensWithoutNfts] = await Promise.all([
    getSolBalance(connection, id),
    TokenWorthService.getTokenBalance(connection, id),
  ]);

  const possibleNfts = tokensWithoutNfts.dev.filter(
    (token) =>
      (token.amount === 1 || token.amount === 0) &&
      !token.usd &&
      !token.info?.name
  );

  const nfts = await NFTWorthService.getPossibleNfts(connection, possibleNfts);

  return toWalletBalance(connection, id, sol, nfts, tokensWithoutNfts);
};

const updateWalletBalance = async (
  connection: Connection,
  wallet: WalletBallance
): Promise<WalletBallance> => {
  const sol = await WalletService.getSolBalance(connection, wallet.id);
  const tokensWithoutNfts = await TokenWorthService.getTokenBalance(
    connection,
    wallet.id
  );

  const resolvedNfts = new Set(wallet.tokens.nfts.map(({ mint }) => mint));
  const possibleNfts = tokensWithoutNfts.dev
    .filter(
      (token) =>
        (token.amount === 1 || token.amount === 0) &&
        !token.usd &&
        !token.info?.name
    )
    .filter((nft) => !resolvedNfts.has(nft.mint));

  const newNfts = await NFTWorthService.getPossibleNfts(
    connection,
    possibleNfts
  );

  const nfts = await NFTWorthService.estimateNftWorth(
    wallet.tokens.nfts.concat(newNfts)
  );

  return toWalletBalance(connection, wallet.id, sol, nfts, tokensWithoutNfts);
};

export const WalletService = {
  getSolBalance,
  getWalletBalance,
  updateWalletBalance,
};
