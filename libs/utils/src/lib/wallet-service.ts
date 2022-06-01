import { Connection, PublicKey } from '@solana/web3.js';
import { NftWorth, TokenWorthSummary, WalletBalance } from '@forbex-nxr/types';
import { TokenWorthService } from './token-worth-service';
import { ProgramFlagService } from './program-flag-service';
import { NFTWorthService } from './nft-worth-service';
import { WorthUtils } from './worth-utils';
import { PriceService } from './price-service';

const getSolBalance = async (
  connection: Connection,
  accountId: string
): Promise<number> => {
  const publicKey = new PublicKey(accountId);
  const balance = await connection.getBalance(publicKey);

  return balance / Math.pow(10, 9);
};

const toWalletBalance = async (
  id: string,
  sol: number,
  nfts: NftWorth[],
  tokensWithoutNfts: TokenWorthSummary,
  program: boolean,
  original?: WalletBalance
) => {
  const solPrice = await PriceService.getSolPrice();
  const nftMints = new Set<string>(nfts.map((nft) => nft.mint));
  const tokens = {
    ...tokensWithoutNfts,
    dev: tokensWithoutNfts.dev.filter((token) => !nftMints.has(token.mint)),
    nfts,
  };

  const summary = {
    general: tokens.general.length,
    nfts: tokens.nfts.length,
    dev: tokens.dev.length,
    priced: tokens.priced.length,
  };

  const worth = await WorthUtils.getWalletWorth(solPrice, sol, tokens);

  return {
    id,
    summary,
    sol,
    tokens,
    worth,
    program,
    change: original ? worth - original.worth : 0,
  };
};

const getWalletBalance = async (
  connection: Connection,
  id: string
): Promise<WalletBalance> => {
  const [sol, tokensWithoutNfts, program] = await Promise.all([
    getSolBalance(connection, id),
    TokenWorthService.getTokenBalance(connection, id),
    ProgramFlagService.isProgram(connection, id),
  ]);

  const nfts = await NFTWorthService.getPossibleNfts(
    connection,
    tokensWithoutNfts.dev
  );

  return toWalletBalance(id, sol, nfts, tokensWithoutNfts, program);
};

const updateWalletBalance = async (
  connection: Connection,
  wallet: WalletBalance
): Promise<WalletBalance> => {
  const sol = await WalletService.getSolBalance(connection, wallet.id);
  const tokensWithoutNfts = await TokenWorthService.getTokenBalance(
    connection,
    wallet.id
  );

  const resolvedNfts = new Set(
    wallet.tokens.nfts
      .map(({ mint }) => mint)
      .concat(wallet.tokens.dev.map(({ mint }) => mint))
  );
  const allPossibleNfts = tokensWithoutNfts.dev.filter(
    (token) =>
      (token.amount === 1 || token.amount === 0) &&
      !token.usd &&
      !token.info?.name
  );
  const possibleNfts = allPossibleNfts.filter(
    (nft) => !resolvedNfts.has(nft.mint)
  );

  console.log(wallet.id, ' found all possible NFT ', allPossibleNfts.length);
  console.log(wallet.id, ' out of which potentially new ', possibleNfts.length);

  const newNfts: NftWorth[] = await NFTWorthService.getPossibleNfts(
    connection,
    possibleNfts
  );

  const nfts = await NFTWorthService.estimateNftWorth(
    wallet.tokens.nfts.concat(newNfts)
  );

  return toWalletBalance(
    wallet.id,
    sol,
    nfts,
    tokensWithoutNfts,
    wallet.program,
    wallet
  );
};

export const WalletService = {
  getSolBalance,
  getWalletBalance,
  updateWalletBalance,
};
