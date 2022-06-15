interface BadgeProps {
  children: React.ReactNode;
}

export const Badge = ({ children }: BadgeProps) => (
  <span className="flex justify-center text-xs rounded-full px-2 py-0.5 bg-gray-500 text-white font-semibold">
    {children}
  </span>
);
