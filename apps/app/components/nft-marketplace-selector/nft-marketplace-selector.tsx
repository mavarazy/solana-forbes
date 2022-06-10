import { NftMarketplace } from '@forbex-nxr/types';
import Link from 'next/link';

export const NftMarketplaceSelector = () => (
  <div className="flex items-center justify-center flex-wrap">
    {Object.values(NftMarketplace).map((marketplace) => (
      <Link href={`/nft/${marketplace}/0`} passHref key={marketplace}>
        <a
          className="uppercase text-sm font-bold inline-flex items-center px-4 py-2 border-brand border rounded-full m-2"
          aria-current="page"
        >
          {marketplace}
        </a>
      </Link>
    ))}
  </div>
);
