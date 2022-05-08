import {
  faCoinFront,
  faHexagonVerticalNftSlanted,
} from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const SummaryBadge = ({ nfts, tokens }) => (
  <span className="flex justify-center border rounded-full px-3 py-0.5 bg-gray-500 text-white font-semibold">
    <FontAwesomeIcon
      icon={faHexagonVerticalNftSlanted}
      className="flex self-center"
    />
    <span className="self-center ml-1">{nfts.toLocaleString()}</span>

    <FontAwesomeIcon icon={faCoinFront} className="flex self-center ml-2" />
    <span className="self-center ml-1">{tokens.toLocaleString()}</span>
  </span>
);
