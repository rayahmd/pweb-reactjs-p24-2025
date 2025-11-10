import { Link } from "react-router-dom";
import type { Book } from "../types/book";
import { formatCurrency } from "../utils/format";

interface Props {
  book: Book;
}

export default function BookCard({ book }: Props) {
  const genreName = typeof book.genre === 'string' ? book.genre : book.genre?.name || 'Unknown';
  const stockDisplay = book.stock_quantity ?? book.stock ?? 0;
  const writer = book.writer || (book as any).author || 'Unknown Author';
  
  return (
    <Link
      to={`/books/${book.id}`}
      className="group flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative h-48 w-full overflow-hidden rounded-t-2xl bg-slate-100">
        <img
          src={
            book.coverUrl ||
            `https://source.unsplash.com/600x800/?books&sig=${book.id}`
          }
          alt={book.title}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-indigo-600 shadow">
          {genreName}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            {writer}
          </p>
          <h3 className="text-lg font-semibold text-slate-900">{book.title}</h3>
        </div>
        <div className="mt-auto flex items-center justify-between text-sm text-slate-500">
          <span>{book.condition || 'GOOD'}</span>
          <span>Stok: {stockDisplay}</span>
        </div>
        <p className="text-lg font-bold text-indigo-600">
          {formatCurrency(book.price)}
        </p>
      </div>
    </Link>
  );
}
