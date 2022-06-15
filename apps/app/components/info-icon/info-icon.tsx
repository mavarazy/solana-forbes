import { faInfoCircle } from '@fortawesome/pro-light-svg-icons';
import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from '@fortawesome/react-fontawesome';

export const InfoIcon = (props: Omit<FontAwesomeIconProps, 'icon'>) => (
  <FontAwesomeIcon icon={faInfoCircle} {...props} />
);
