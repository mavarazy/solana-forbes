import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js';
import { Metaplex } from '@metaplex-foundation/js-next';

const loadNfts = async (mint: string): Promise<void> => {
  const connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');

  const mintAddress = new PublicKey(mint);
  const nft = await new Metaplex(connection).nfts().findNftByMint(mintAddress);
  console.log(nft);
};

export const NFTService = {
  loadNfts,
};
