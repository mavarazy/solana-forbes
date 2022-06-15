export const Card = ({ children }) => (
  <div className="flex flex-1 flex-col p-4 self-center shadow-lg hover:bg-brand hover:text-white hover:shadow-xl rounded-3xl bg-white cursor-pointer relative">
    {children}
  </div>
);
