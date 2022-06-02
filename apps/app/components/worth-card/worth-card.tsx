import { WalletBalance } from '@forbex-nxr/types';
import React from 'react';
import { SummaryBadge } from '../summary-badge';
import { SolBadge } from '../sol-badge';
import { ProgramIcon } from '../program-icon';
import { classNames, NumberUtils } from '../utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/pro-solid-svg-icons';

interface WorthCardProps {
  wallet: Pick<
    WalletBalance,
    'id' | 'sol' | 'summary' | 'worth' | 'program' | 'change'
  >;
  rank?: number;
}

export const WorthCard = ({
  rank,
  wallet: { id, sol, summary, worth, program, change },
}: WorthCardProps) => (
  <div className="flex flex-1 flex-col rounded-xl self-center relative shadow-2xl sm:py-6 bg-white hover:bg-indigo-500 hover:text-white cursor-pointer">
    <div className="flex flex-1 flex-col my-8">
      <span className="absolute lg:text-xl sm:text-sm text-[8px] top-4 left-4 bg-green-600 font-bold px-2 sm:px-4 py-0.5 rounded-full shadow-lg text-white">
        <ProgramIcon program={program} />
        {rank && <span className="ml-1 sm:ml-2"># {rank}</span>}
      </span>
      {change !== 0 && (
        <span
          className={classNames(
            change > 0 ? 'bg-green-600' : 'bg-red-600',
            'absolute sm:text-sm text-[8px] bottom-4 left-4 font-bold px-2 py-0.5 rounded-full shadow-lg text-white'
          )}
        >
          <FontAwesomeIcon
            icon={change > 0 ? faPlus : faMinus}
            className="mr-1"
          />
          {Math.round(Math.abs(change)).toLocaleString()}
        </span>
      )}
      <span className="flex flex-1 flex-col text-[8px] sm:text-xs absolute top-4 right-4 gap-1">
        <div className="flex self-end">
          <SolBadge sol={sol} />
        </div>
      </span>
      <span className="flex flex-1 flex-col text-xs absolute bottom-4 right-4 gap-1">
        <div className="flex self-end">
          <SummaryBadge {...summary} />
        </div>
      </span>
      <div className="flex flex-col text-xl md:text-4xl self-center mt-2 font-bold px-2 justify-center items-center cursor-pointer">
        <span className="flex flex-1 justify-center">
          <span className="uppercase">
            {Math.round(worth).toLocaleString()}
          </span>
        </span>
        <span className="flex text-[8px] sm:text-base md:text-xl font-bold truncate">
          {id}
        </span>
      </div>
    </div>
  </div>
);
