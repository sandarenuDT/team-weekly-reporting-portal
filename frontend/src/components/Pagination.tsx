interface Props {
  page: number; // 0-indexed
  totalPages: number;
  onChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onChange }: Props) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between mt-4">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 0}
        className="text-sm text-gray-600 disabled:text-gray-300 disabled:cursor-not-allowed"
      >
        ← Previous
      </button>
      <span className="text-sm text-gray-500">
        Page {page + 1} of {totalPages}
      </span>
      <button
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages - 1}
        className="text-sm text-gray-600 disabled:text-gray-300 disabled:cursor-not-allowed"
      >
        Next →
      </button>
    </div>
  );
}