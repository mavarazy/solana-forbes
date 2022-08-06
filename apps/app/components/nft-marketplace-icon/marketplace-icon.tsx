import { NftMarketplace } from '@forbex-nxr/types';
import { SVGProps } from 'react';
import { ReactComponent as MagicEdenImg } from './images/magic-eden.svg';
import { ReactComponent as SolSeaImg } from './images/solsea.svg';
import { ReactComponent as ExchangeArtImg } from './images/exchange-art.svg';
import { ReactComponent as SolPortImg } from './images/solport.svg';
import { ReactComponent as SolanArtImg } from './images/solanart.svg';
import { ReactComponent as DigitalEyesImg } from './images/digitaleyes.svg';
import { ReactComponent as AlphArtImg } from './images/alphart.svg';
import { ReactComponent as FractalImg } from './images/fractal.svg';

const img: { [key in NftMarketplace]: React.FC<SVGProps<any>> } = {
  [NftMarketplace.all]: MagicEdenImg,
  [NftMarketplace.alphart]: AlphArtImg,
  [NftMarketplace.digitaleyes]: DigitalEyesImg,
  [NftMarketplace.exchageart]: ExchangeArtImg,
  [NftMarketplace.fractal]: FractalImg,
  [NftMarketplace.magiceden]: MagicEdenImg,
  [NftMarketplace.solanart]: SolanArtImg,
  [NftMarketplace.solport]: SolPortImg,
  [NftMarketplace.solsea]: SolSeaImg,
};

type MarketplaceIconProps = SVGProps<any> & {
  marketplace: NftMarketplace;
};

export const MarketplaceIcon = ({ marketplace }: MarketplaceIconProps) => {
  return img[marketplace];
};
