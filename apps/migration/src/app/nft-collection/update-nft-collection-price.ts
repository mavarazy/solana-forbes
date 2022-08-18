import { getAlphArtCollections } from './alpha-art-collection';
import { getDigitalEyesCollections } from './digitaleye-collection';
import { getExchagenArtCollections } from './exchange-art-collection';
import { getFractalCollections } from './fractal-collection';
import { getMagicEdenPrices } from './magic-eden-collection';
import { getSolanaArtCollections } from './solana-art-collection';
import { getSolPortCollections } from './solport-collection';
import { getSolSeaCollections } from './solsea-collection';
import { NftCollectionPriceRepository } from './repository/nft-collection-price-repository';

export const updateNftCollectionPrice = async () => {
  console.log('Nft collection price update start');

  await Promise.all([
    getMagicEdenPrices()
      .catch(() => [])
      .then(NftCollectionPriceRepository.updateInBatch),
    getFractalCollections()
      .catch(() => [])
      .then(NftCollectionPriceRepository.updateInBatch),
    getAlphArtCollections()
      .catch(() => [])
      .then(NftCollectionPriceRepository.updateInBatch),
    getDigitalEyesCollections()
      .catch(() => [])
      .then(NftCollectionPriceRepository.updateInBatch),
    getExchagenArtCollections()
      .catch(() => [])
      .then(NftCollectionPriceRepository.updateInBatch),
    getSolanaArtCollections()
      .catch(() => [])
      .then(NftCollectionPriceRepository.updateInBatch),
    getSolSeaCollections()
      .catch(() => [])
      .then(NftCollectionPriceRepository.updateInBatch),
    getSolPortCollections()
      .catch(() => [])
      .then(NftCollectionPriceRepository.updateInBatch),
  ]);

  console.log('Nft collection price update finished');
};
