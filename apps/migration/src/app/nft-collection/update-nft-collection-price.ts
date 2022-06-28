import { getAlphArtCollections } from './alpha-art-collection';
import { getDigitalEyesCollections } from './digitaleye-collection';
import { getExchagenArtCollections } from './exchange-art-collection';
import { getFractalCollections } from './fractal-collection';
import { getMagicEdenPrices } from './magic-eden-collection';
import { getSolanaArtCollections } from './solana-art-collection';
import { getSolPortCollections } from './solport-collection';
import { getSolSeaCollections } from './solsea-collection';
import { NftCollectionPrice } from '@forbex-nxr/types';
import { NftCollectionRepository } from './nft-collection-repository';

export const updateNftCollectionPrice = async () => {
  console.log('Nft collection price update start');
  const prices = await Promise.all([
    getMagicEdenPrices(),
    getFractalCollections(),
    getAlphArtCollections(),
    getDigitalEyesCollections(),
    getExchagenArtCollections(),
    getSolanaArtCollections(),
    getSolSeaCollections(),
    getSolPortCollections(),
  ]);

  const allCollections: NftCollectionPrice[] = prices.reduce(
    (agg: NftCollectionPrice[], prices) => agg.concat(prices),
    []
  );

  await NftCollectionRepository.updateInBatch(allCollections);
  console.log('Nft collection price update finished');
};
