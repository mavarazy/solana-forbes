import { Connection, PublicKey } from '@solana/web3.js';
import { Nft, Metaplex } from '@metaplex-foundation/js-next';
import { TokenWorth, NftWorth } from '@forbex-nxr/types';
import { NftCollectionWorthService } from './nft-collection-worth-service';
import { throttle } from './throttle';
import { PriceService } from './price-service';

const loadNfts = async (
  connection: Connection,
  tokens: TokenWorth[]
): Promise<NftWorth[]> => {
  const metaplex = new Metaplex(connection);
  const nfts: Array<Nft | null> = await metaplex
    .nfts()
    .findAllByMintList(tokens.map((token) => new PublicKey(token.mint)));

  const tasks = nfts
    .filter((nft) => nft !== null)
    .map((nft) => async (): Promise<NftWorth | null> => {
      if (!nft) {
        return null;
      }
      const type = nft.isPrint() ? 'print' : 'original';
      const owns =
        tokens.find((token) => token.mint === nft.mint.toString())?.amount ===
          1 || false;

      try {
        const metadata = await nft.metadataTask.run();
        if (!metadata.image) {
          return null;
        }

        const possibleNames = [
          nft.name,
          metadata.collection?.name,
          metadata.collection?.family,
          nft.symbol,
        ].filter((str): str is string => !!str);

        const worth: NftWorth = {
          info: {
            logoURI: metadata.image,
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
          worth: 0,
        };

        const nftPrice = await NftCollectionWorthService.getFloorPrice(
          possibleNames
        );

        if (nftPrice) {
          console.log('Found floor price for ', nftPrice.price, ' ', nft.name);
          worth.floorPrice = nftPrice.price;
          worth.marketplace = nftPrice.source;
          worth.worth = nftPrice.price * PriceService.getSolPrice();
        }

        return worth;
      } catch (err) {
        console.log(`Failed on ${nft.mint}`);
        return null;
      }
    });

  const nftWorth: Array<NftWorth | null> = await throttle(tasks, 500, 5);

  return await nftWorth.filter((nft): nft is NftWorth => nft !== null);
};

export const NFTService = {
  loadNfts,
};
