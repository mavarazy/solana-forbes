import { Connection, PublicKey } from '@solana/web3.js';
import { Nft, Metaplex } from '@metaplex-foundation/js-next';
import { TokenWorth, NftWorth } from '@forbex-nxr/types';
import { NftCollectionWorthService } from './nft-collection-worth-service';
import { throttle } from './throttle';
import { PriceService } from './price-service';

const estimateNftWorth = async (nfts: NftWorth[]): Promise<NftWorth[]> => {
  const allPossibleNames = nfts.reduce((names: Set<string>, nft: NftWorth) => {
    names.add(nft.info.name);
    if (nft.collection?.name) {
      names.add(nft.collection.name);
    }
    if (nft.collection?.symbol) {
      names.add(nft.collection.symbol);
    }
    if (nft.collection?.family) {
      names.add(nft.collection.family);
    }
    return names;
  }, new Set<string>());

  const priceMap = await NftCollectionWorthService.getFloorPriceMap(
    Array.from(allPossibleNames)
  );

  return nfts.map((nft) => {
    const nftPrice =
      priceMap.get(nft.info.name) ||
      priceMap.get(nft.collection?.name || '') ||
      priceMap.get(nft.collection?.family || '') ||
      priceMap.get(nft.collection?.symbol || '');
    if (nftPrice) {
      console.log('Found floor price for ', nftPrice.price, ' ', nft.info.name);
      nft.floorPrice = nftPrice.price;
      nft.marketplace = nftPrice.source;
      nft.worth = nftPrice.price * PriceService.getSolPrice();
    }
    return nft;
  });
};

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

        return worth;
      } catch (err) {
        console.log(`Failed on ${nft.mint}`);
        return null;
      }
    });

  const nftWorth: Array<NftWorth> = (await throttle(tasks, 500, 5)).filter(
    (nft): nft is NftWorth => nft !== null
  );

  return estimateNftWorth(nftWorth);
};

export const NFTService = {
  loadNfts,
};
