import { Connection, PublicKey } from '@solana/web3.js';
import { Nft, Metaplex } from '@metaplex-foundation/js-next';
import { TokenWorth, NftWorth } from '@forbex-nxr/types';
import { NftCollectionWorthService } from './nft-collection-worth-service';
import { throttle } from './throttle';

const loadNfts = async (
  connection: Connection,
  tokens: TokenWorth[]
): Promise<NftWorth[]> => {
  const metaplex = new Metaplex(connection);
  const nfts: Array<Nft | null> = await metaplex
    .nfts()
    .findAllByMintList(tokens.map((token) => new PublicKey(token.mint)));

  const tasks = nfts.map((nft, i) => async (): Promise<NftWorth | null> => {
    if (!nft) {
      return null;
    }
    const type = nft.isPrint() ? 'print' : 'original';
    const owns = tokens[i].amount === 1;

    try {
      const metadata = await nft.metadataTask.run();
      const possibleNames = [
        nft.name,
        metadata.collection?.name,
        metadata.collection?.family,
      ].filter((str): str is string => !!str);

      const floorPrice = await NftCollectionWorthService.getFloorPrice(
        possibleNames
      );

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
        floorPrice,
      };
    } catch (err) {
      console.log(`Failed on ${nft.mint}`);
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
  });

  const nftWorth: Array<NftWorth | null> = await throttle(tasks, 500, 1);

  return await nftWorth.filter((nft): nft is NftWorth => nft !== null);
};

export const NFTService = {
  loadNfts,
};
