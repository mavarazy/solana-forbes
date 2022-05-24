import {
  GetAllWalletsUpdatedBefore,
  GetAllWalletsUpdatedBeforeVariables,
} from '@forbex-nxr/types';
import { hasuraClient, throttle } from '@forbex-nxr/utils';
import { readdir, writeFile } from 'fs/promises';
import { GetAllWalletsUpdatedBeforeQuery } from './update-wallets';
import { WalletRepository } from './wallet-repository';
import * as mime from 'mime-types';
import { existsSync } from 'fs';

async function download(mint: string, url: string) {
  const response = await fetch(url);
  console.log(`Checking `, mint);
  if (!response.ok)
    throw new Error(`unexpected response ${response.statusText}`);

  const type = mime.extension(response.headers.get('Content-Type'));
  const urlType = url.substring(url.lastIndexOf('.') + 1);

  const data = await (await response.blob()).arrayBuffer();
  const fileName = `./assets/${mint}.${type !== 'bin' ? type : urlType}`;

  if (existsSync(fileName)) {
    return;
  }

  await writeFile(fileName, Buffer.from(data));
}

export const loadImages = async () => {
  const {
    data: { wallet },
  } = await hasuraClient.query<
    GetAllWalletsUpdatedBefore,
    GetAllWalletsUpdatedBeforeVariables
  >({
    query: GetAllWalletsUpdatedBeforeQuery,
    variables: {
      updatedBefore: new Date(Date.now()).toISOString(),
    },
  });

  const tasks = wallet.map(({ id }) => async () => {
    const wallet = await WalletRepository.getById(id);
    const images = wallet.tokens.general
      .map((token) =>
        token.info?.logoURI
          ? { mint: token.mint, url: token.info.logoURI }
          : null
      )
      .concat(
        wallet.tokens.priced.map((token) =>
          token.info?.logoURI
            ? { mint: token.mint, url: token.info.logoURI }
            : null
        )
      )
      .concat(
        wallet.tokens.nfts.map((nft) =>
          nft.info?.logoURI ? { mint: nft.mint, url: nft.info.logoURI } : null
        )
      )
      .filter((token) => token !== null);

    return images;
  });

  const images = await throttle(tasks, 1, 20);

  const savedMints = new Set(
    (await readdir('./assets')).map((path) =>
      path.substring(path.lastIndexOf('/') + 1, path.lastIndexOf('.'))
    )
  );

  const allImages = Array.from(
    new Set(images.reduce((agg, images) => agg.concat(images), []))
  ).filter((file) => !savedMints.has(file.mint));

  console.log('Got total of ', allImages.length);

  const downloadImageTasks = allImages.map(({ mint, url }) => async () => {
    try {
      await download(mint, url);
    } catch (err) {
      console.log(err);
    }
  });

  await throttle(downloadImageTasks, 1, 20);
};
