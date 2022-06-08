import { NftCollectionPrice } from '@forbex-nxr/types';
import { io } from 'socket.io-client';

const getAllSolSeaCollections = async () =>
  new Promise((resolve, reject) => {
    const socket = io('wss://api.all.art/socket.io/?EIO=3');

    socket.on('connect', () => {
      console.log(socket.id);
    });

    socket.on('disconnect', () => {
      console.log(socket.connected);
      reject();
    });

    socket.on('connect_error', (...args) => {
      console.log('Connection error ', args);
      reject();
      socket.close();
    });

    socket.onAny((eventName, ...args) => {
      console.log(eventName);
      console.log(args);
      resolve([]);
    });

    socket.emit('find', 'collections', {
      visible: true,
      $limit: 21,
      $skip: 0,
      $sort: { createdAt: -1 },
      verified: true,
      $populate: ['headerImage', 'iconImage'],
    });
  });

export const getSolSeaCollections = async (): Promise<NftCollectionPrice[]> => {
  await getAllSolSeaCollections();
  return [];
};
