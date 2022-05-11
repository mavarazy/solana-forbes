import { Connection, PublicKey } from '@solana/web3.js';
import { NftWorth, TokenWorth } from './types';
import { Nft } from '@metaplex-foundation/js-next';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Metaplex = require('@metaplex-foundation/js-next').Metaplex;

const loadNfts = async (
  connection: Connection,
  tokens: TokenWorth[]
): Promise<NftWorth[]> => {
  const metaplex = new Metaplex(connection);
  const nfts: Array<Nft | null> = await metaplex
    .nfts()
    .findNftsByMintList(tokens.map((token) => new PublicKey(token.mint)));

  const nftWorth: Array<NftWorth | null> = await Promise.all(
    nfts.map(async (nft, i) => {
      if (!nft) {
        return null;
      }
      const type = nft.isPrint() ? 'print' : 'original';
      const owns = tokens[i].amount === 1;
      try {
        const metadata = await nft.metadataTask.run();
        return {
          info: {
            logoURI: metadata.image ?? 'https://via.placeholder.com/200',
            name: nft.name ?? metadata.name ?? 'Unknown',
          },
          collection: {
            name: metadata.collection?.name ?? null,
            family: metadata.collection?.family ?? null,
            symbol: metadata.symbol ?? null,
          },
          type,
          owns,
          mint: nft.mint.toString(),
        };
      } catch (err) {
        return {
          info: {
            logoURI: 'https://via.placeholder.com/200',
            name: nft.name ?? 'Broken',
          },
          type,
          owns,
          mint: nft.mint.toString(),
        };
      }
    })
  );

  return await nftWorth.filter((nft): nft is NftWorth => nft !== null);
};

export const NFTService = {
  loadNfts,
};
