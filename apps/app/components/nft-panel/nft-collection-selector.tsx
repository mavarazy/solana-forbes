import { TokenTypeIcon } from '../token-type-icon';
import { classNames } from '../utils';

interface NftCollectionSelectorProps {
  collections: Array<{ name: string; length: number; priced: boolean }>;
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
      {collections.map(({ name, length, priced }) => (
        <span
          key={name}
          className={classNames(
            selected === name
              ? 'bg-green-500 shadow-lg text-white'
              : 'bg-white',
            'px-5 py-1 rounded-full border border-green text-md mx-1 my-1.5 cursor-pointer flex'
          )}
          onClick={() => onSelect(name)}
        >
          {priced && (
            <span className="flex items-center pr-2">
              <TokenTypeIcon type="priced" />
            </span>
          )}
          <span className="flex items-center">
            {name} | {length}
          </span>
        </span>
      ))}
    </div>
  </div>
);
