import { getAlphArtCollections } from './alpha-art-collection';
import { getDigitalEyesCollections } from './digitaleye-collection';
import { getExchagenArtCollections } from './exchange-art-collection';
import { getFractalCollections } from './fractal-collection';
import { getMagicEdenPrices } from './magic-eden-collection';
import { getSolanaArtCollections } from './solana-art-collection';
import { getSolPortCollections } from './solport-collection';
import { getSolSeaCollections } from './solsea-collection';
import { NftCollectionRepository } from './nft-collection-repository';

export const updateNftCollectionPrice = async () => {
  console.log('Nft collection price update start');

  await Promise.all([
    getMagicEdenPrices()
      .catch(() => [])
      .then(NftCollectionRepository.updateInBatch),
    getFractalCollections()
      .catch(() => [])
      .then(NftCollectionRepository.updateInBatch),
    getAlphArtCollections()
      .catch(() => [])
      .then(NftCollectionRepository.updateInBatch),
    getDigitalEyesCollections()
      .catch(() => [])
      .then(NftCollectionRepository.updateInBatch),
    getExchagenArtCollections()
      .catch(() => [])
      .then(NftCollectionRepository.updateInBatch),
    getSolanaArtCollections()
      .catch(() => [])
      .then(NftCollectionRepository.updateInBatch),
    getSolSeaCollections()
      .catch(() => [])
      .then(NftCollectionRepository.updateInBatch),
    getSolPortCollections()
      .catch(() => [])
      .then(NftCollectionRepository.updateInBatch),
  ]);

  console.log('Nft collection price update finished');
};
