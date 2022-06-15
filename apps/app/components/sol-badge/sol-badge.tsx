import { Badge } from '../badge';

export const SolBadge: React.FC<{ sol: number }> = ({ sol }) => (
  <Badge>{sol.toLocaleString()} SOL</Badge>
);
