import { getMint } from '@solana/spl-token';
import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js';
import { Metaplex } from '@metaplex-foundation/js-next';
import { TokenWorth } from './types';

const loadNfts = async (tokens: TokenWorth[]): Promise<TokenWorth[]> => {
  const connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');
  const checkedTokens: Array<TokenWorth | null> = await Promise.all(
    tokens.map(async (token) => {
      const mintAddress = new PublicKey(token.mint);
      const mintData = await getMint(connection, mintAddress);
      if (mintData.supply === BigInt(1)) {
        const nft = await new Metaplex(connection)
          .nfts()
          .findNftByMint(mintAddress);
        console.log(nft);
        return token;
      }
      return null;
    })
  );
  return checkedTokens.filter((token): token is TokenWorth => token !== null);
};

export const NFTService = {
  loadNfts,
};
