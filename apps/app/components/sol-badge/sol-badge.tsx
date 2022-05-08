export const SolBadge: React.FC<{ sol: number }> = ({ sol }) => (
  <span className="flex border rounded-full px-2 py-0.5 shadow-lg bg-green-600 text-white font-bold">
    {sol.toLocaleString()} SOL
  </span>
);
