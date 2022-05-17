import { gql } from '@apollo/client';
import {
  GetNftCollectionPrices,
  NftCollectionPrice,
  NftWorth,
} from '@forbex-nxr/types';
import { hasuraClient } from '@forbex-nxr/utils';

const GetAllNftsQuery = gql`
  query GetAllNfts {
    wallet(order_by: { worth: desc }, limit: 500) {
      tokens(path: "nfts")
    }
  }
`;

const GetNftCollectionPricesQuery = gql`
  query GetNftCollectionPrices {
    nft_collection_price {
      id
      name
      website
      source
      symbol
      price
    }
  }
`;

const matchById = (
  nfts: NftWorth[],
  nftPrices: NftCollectionPrice[]
): number => {
  const nftByMint: { [key in string]: NftWorth } = nfts.reduce(
    (agg, nft) => Object.assign(agg, { [nft.mint]: nft }),
    {}
  );

  const nftPriceIds = new Set(nftPrices.map(({ id }) => id));
  const matchedByMint = Object.keys(nftByMint).filter((mint) =>
    nftPriceIds.has(mint)
  );
  return matchedByMint.length;
};

const matchByText = (
  nfts: NftWorth[],
  nftPrices: NftCollectionPrice[]
): number => {
  const nftByText: { [key in string]: NftWorth } = nfts.reduce(
    (agg, nft) =>
      nft.collection?.symbol
        ? Object.assign(agg, {
            // [nft.collection.symbol.toLowerCase().trim()]: nft,
            [nft.collection.family?.toLowerCase().trim()]: nft,
            [nft.collection.name?.toLowerCase().trim()]: nft,
          })
        : agg,
    {}
  );

  const nftPriceSymbols = new Set(
    // nftPrices
    //   .map(({ symbol }) => (symbol ? symbol.toLowerCase().trim() : ''))
    //   .concat(
    nftPrices.map(({ name }) => (name ? name.toLowerCase().trim() : ''))
    // )
  );

  const matchedBySymbol = Object.keys(nftByText).filter((text) =>
    nftPriceSymbols.has(text)
  );

  return matchedBySymbol.length;
};

export const matchNftCollections = async () => {
  const {
    data: { wallet },
  } = await hasuraClient.query({ query: GetAllNftsQuery });
  const nfts: NftWorth[] = wallet.reduce(
    (agg, { tokens }) => agg.concat(tokens),
    []
  );

  console.log('Extracted ', nfts.length);
  const {
    data: { nft_collection_price: nftPrices },
  } = await hasuraClient.query<GetNftCollectionPrices>({
    query: GetNftCollectionPricesQuery,
  });
  console.log('Prices for ', nftPrices.length);

  console.log('Out of whome');
  console.log('   Matched by mint: ', matchById(nfts, nftPrices));
  console.log('   Matched by text: ', matchByText(nfts, nftPrices));

  // const nftBySymbol: { [key in string]: NftWorth } = nfts.reduce((agg, nft) => {
  //   if (nft?.collection?.family) {
  //     agg[nft.collection.family.toLowerCase().trim()] = nft;
  //   }
  // }, {});
};
