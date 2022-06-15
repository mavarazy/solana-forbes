import { faSpinner, faWallet } from '@fortawesome/pro-light-svg-icons';
import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from '@fortawesome/react-fontawesome';

export const WalletIcon = ({
  isSubmitting,
  ...rest
}: { isSubmitting: boolean } & Omit<FontAwesomeIconProps, 'icon'>) => (
  <FontAwesomeIcon
    icon={isSubmitting ? faSpinner : faWallet}
    spin={isSubmitting}
    {...rest}
  />
);
