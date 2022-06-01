import { library } from '@fortawesome/fontawesome-svg-core';
import { faUserRobot, faUserSecret } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

library.add(faUserRobot, faUserSecret);

export const ProgramIcon = ({ program }: { program: boolean }) => (
  <FontAwesomeIcon
    icon={program ? faUserRobot : faUserSecret}
    className="text-white"
  />
);
