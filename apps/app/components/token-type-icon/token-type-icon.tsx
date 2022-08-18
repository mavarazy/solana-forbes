import { TokenType } from '@solana-forbes/types';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  faCode,
  faDollarCircle,
  faGenderless,
  faHexagonVerticalNft,
} from '@fortawesome/pro-light-svg-icons';
import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from '@fortawesome/react-fontawesome';

const IconMap: { [key in TokenType]: IconDefinition } = {
  nfts: faHexagonVerticalNft,
  priced: faDollarCircle,
  general: faGenderless,
  dev: faCode,
};

type TokenTypeIconProps = { type: TokenType } & Omit<
  FontAwesomeIconProps,
  'icon'
>;

export const TokenTypeIcon = (props: TokenTypeIconProps) => {
  const { type, ...rest } = props;
  return <FontAwesomeIcon icon={IconMap[type]} {...rest} />;
};
