import { NumberUtils, WalletBallance } from '@forbex-nxr/utils';
import React from 'react';
import { SummaryBadge } from '../summary-badge';
import { SolBadge } from '../sol-badge';

interface WorthCardProps {
  wallet: Pick<WalletBallance, 'id' | 'sol' | 'summary' | 'worth'>;
  rank?: number;
}

export const WorthCard = ({
  rank,
  wallet: { id, sol, summary, worth },
}: WorthCardProps) => (
  <div className="flex flex-1 flex-col rounded-xl self-center relative shadow-xl p-10 bg-white hover:bg-indigo-500 hover:text-white cursor-pointer">
    <div className="flex flex-1 flex-col my-8">
      {rank && (
        <span className="absolute top-2 left-2 bg-green-600 font-bold px-4 py-0.5 rounded-full shadow-lg text-white">
          # {rank}
        </span>
      )}
      <span className="flex flex-1 flex-col text-xs absolute top-4 right-4 gap-1">
        <div className="flex self-end">
          <SolBadge sol={sol} />
        </div>
        <div className="flex self-end">
          <SummaryBadge {...summary} />
        </div>
      </span>
      <div className="flex flex-col text-4xl self-center mt-2 font-bold px-2 justify-center items-center cursor-pointer">
        <span className="flex flex-1 justify-center">
          <span>{NumberUtils.asHuman(worth)}</span>
        </span>
        <span className="flex text-xl font-bold">{id}</span>
      </div>
    </div>
  </div>
);
