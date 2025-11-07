interface PaginationProps {
  page: number;
  totalPage: number;
  onChange: (page: number) => void;
}

export default function Pagination({ page, totalPage, onChange }: PaginationProps) {
  if (totalPage <= 1) return null;

  const prevDisabled = page <= 1;
  const nextDisabled = page >= totalPage;

  return (
    <div className="mt-6 flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700">
      <button
        type="button"
        disabled={prevDisabled}
        onClick={() => onChange(page - 1)}
        className="rounded-lg px-3 py-2 font-medium disabled:cursor-not-allowed disabled:text-slate-400"
      >
        Sebelumnya
      </button>
      <p>
        Halaman <span className="font-semibold">{page}</span> / {totalPage}
      </p>
      <button
        type="button"
        disabled={nextDisabled}
        onClick={() => onChange(page + 1)}
        className="rounded-lg px-3 py-2 font-medium disabled:cursor-not-allowed disabled:text-slate-400"
      >
        Selanjutnya
      </button>
    </div>
  );
}
