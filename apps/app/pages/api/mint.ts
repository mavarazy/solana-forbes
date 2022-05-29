import { Metaplex } from '@metaplex-foundation/js-next';
import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const { mint } = request.query;

  if (!mint) {
    response.status(404);
    return;
  }

  try {
    const connection = new Connection(
      clusterApiUrl('mainnet-beta'),
      'confirmed'
    );

    const nft = await new Metaplex(connection)
      .nfts()
      .findByMint(new PublicKey(mint));

    if (nft && nft.metadata.image) {
      const res = await fetch(nft.metadata.image);
      if (res.ok) {
        response.send(res.body);
      }
    } else {
      response.status(404);
    }
  } catch (err) {
    response.status(404);
  }
}
