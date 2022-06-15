import { faUserRobot, faUserSecret } from '@fortawesome/pro-light-svg-icons';
import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from '@fortawesome/react-fontawesome';

export const ProgramIcon = ({
  program,
  ...rest
}: { program: boolean } & Omit<FontAwesomeIconProps, 'icon'>) => (
  <FontAwesomeIcon icon={program ? faUserRobot : faUserSecret} {...rest} />
);
