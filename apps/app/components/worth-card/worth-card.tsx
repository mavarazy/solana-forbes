import { WalletBallance } from '@forbex-nxr/utils';
import React from 'react';
import { SummaryBadge } from '../summary-badge';
import { SolBadge } from '../sol-badge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserRobot, faUserSecret } from '@fortawesome/pro-light-svg-icons';

interface WorthCardProps {
  wallet: Omit<WalletBallance, 'tokens'>;
  rank?: number;
}

export const WorthCard = ({
  rank,
  wallet: { id, sol, summary, worth, program },
}: WorthCardProps) => (
  <div className="flex flex-1 flex-col rounded-xl self-center relative shadow-xl p-10 bg-white hover:bg-indigo-500 hover:text-white cursor-pointer">
    <div className="flex flex-1 flex-col my-8">
      {rank && (
        <span className="absolute top-4 left-4 bg-green-600 font-bold px-4 py-0.5 rounded-full shadow-lg text-white">
          # {rank}
        </span>
      )}
      <span>
        <FontAwesomeIcon
          icon={program ? faUserRobot : faUserSecret}
          className="absolute bottom-4 right-4 h-6 w-6 p-2 bg-gray-500 text-white shadow-xl rounded-full"
        />
      </span>
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
          <span>{Math.round(worth).toLocaleString()}</span>
        </span>
        <span className="flex text-xl font-bold">{id}</span>
      </div>
    </div>
  </div>
);
