import { WalletBalance } from '@solana-forbes/types';
import React from 'react';
import { SummaryBadge } from '../summary-badge';
import { SolBadge } from '../sol-badge';
import { ProgramIcon } from '../program-icon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/pro-solid-svg-icons';
import { Badge } from '../badge';
import { Card } from '../card';

interface WalletWorthCardProps {
  wallet: Pick<
    WalletBalance,
    'id' | 'sol' | 'summary' | 'worth' | 'program' | 'change'
  >;
  rank?: number;
}

export const WalletWorthCard = ({
  rank,
  wallet: { id, sol, summary, worth, program, change },
}: WalletWorthCardProps) => (
  <Card>
    <div className="flex flex-1 flex-col my-8">
      <span className="absolute top-4 left-4">
        <Badge>
          <ProgramIcon program={program} className="flex self-center" />
          {rank && <span className="ml-1"># {rank}</span>}
        </Badge>
      </span>
      {change !== 0 && (
        <span className="absolute bottom-4 left-4">
          <Badge>
            <FontAwesomeIcon
              icon={change > 0 ? faPlus : faMinus}
              className="mr-1 flex self-center"
            />
            {Math.round(Math.abs(change)).toLocaleString()}
          </Badge>
        </span>
      )}
      <div className="absolute top-4 right-4">
        <SolBadge sol={sol} />
      </div>
      <div className="absolute bottom-4 right-4">
        <SummaryBadge {...summary} />
      </div>
      <div className="flex flex-col text-xl md:text-2xl self-center mt-2 font-bold px-2 justify-center items-center cursor-pointer">
        <span className="flex flex-1 justify-center">
          <span className="uppercase">
            {Math.round(worth).toLocaleString()}
          </span>
        </span>
        <span className="flex sm:text-base font-bold truncate">
          {id && `${id.substring(0, 8)}...${id.substring(id.length - 8)}`}
        </span>
      </div>
    </div>
  </Card>
);
