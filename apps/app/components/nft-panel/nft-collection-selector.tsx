import { NftWorth } from '@forbex-nxr/types';
import { classNames } from '../utils';

interface NftCollectionSelectorProps {
  collections: Array<[string, NftWorth[]]>;
  selected: string;
  onSelect(collection: string): void;
}

export const NftCollectionSelector: React.FC<NftCollectionSelectorProps> = ({
  collections,
  selected,
  onSelect,
}) => (
  <div className="flex justify-center my-4">
    <div className="flex flex-wrap justify-center max-w-4xl">
      {collections.map(([collection, nfts]) => (
        <span
          key={collection}
          className={classNames(
            selected === collection
              ? 'bg-green-500 shadow-lg text-white'
              : 'bg-white',
            'px-5 py-1 rounded-full border border-green text-md mx-1 my-1.5 cursor-pointer flex'
          )}
          onClick={() => onSelect(collection)}
        >
          <span className="flex items-center">
            {collection} | {nfts.length}
          </span>
        </span>
      ))}
    </div>
  </div>
);
