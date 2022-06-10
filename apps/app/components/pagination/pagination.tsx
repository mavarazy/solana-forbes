import Link from 'next/link';

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  origin: string;
}

export const Pagination = ({
  page,
  pageSize,
  total,
  origin,
}: PaginationProps) => {
  const offset = page * pageSize;
  const totalPages = Math.ceil(total / pageSize);

  return (
    <nav
      className="flex flex-col px-4 py-3 items-center justify-between sm:px-6"
      aria-label="Pagination"
    >
      <div className="flex-1 flex justify-center sm:justify-end border-2 rounded-md divide-x-2 divide-brand border-brand">
        <Link href={`${origin}/${Math.max(0, page - 1)}`}>
          <button
            className="inline-flex items-center px-4 py-2 text-sm disabled:text-gray-300 font-medium enabled:hover:bg-brand enabled:hover:text-white"
            disabled={page === 0}
          >
            Previous
          </button>
        </Link>
        <Link href={`${origin}/${page + 1}`}>
          <button
            className="relative inline-flex items-center px-4 py-2 text-sm disabled:text-gray-300 font-medium enabled:hover:bg-brand enabled:hover:text-white"
            disabled={page + 1 === totalPages}
          >
            Next
          </button>
        </Link>
      </div>
      <div className="flex my-2">
        <p className="text-xs">
          Showing <span className="font-medium">{offset + 1}</span> to{' '}
          <span className="font-medium">
            {Math.min(offset + pageSize, total)}
          </span>{' '}
          of <span className="font-medium">{total}</span>
        </p>
      </div>
    </nav>
  );
};
