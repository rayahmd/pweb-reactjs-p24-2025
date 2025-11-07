import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import BookCard from "../components/BookCard";
import { EmptyState, ErrorState, LoadingState } from "../components/StateMessage";
import { getBooks } from "../services/bookService";
import type { Book } from "../types/book";

export default function Home() {
  const [highlightBooks, setHighlightBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadHighlight = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getBooks({ limit: 3, page: 1, sortOrder: "desc" });
      setHighlightBooks(response.data);
    } catch (err) {
      setError("Gagal memuat buku unggulan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHighlight();
  }, []);

  return (
    <div className="space-y-16">
      <section className="rounded-4xl border border-slate-200 bg-linear-to-br from-indigo-50 via-white to-slate-50 p-8 shadow-lg lg:flex lg:items-center lg:gap-12 lg:p-12">
        <div className="space-y-6">
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-500">
            IT Literature Shop
          </p>
          <h1 className="text-4xl font-bold text-slate-900 sm:text-5xl">
            Perpustakaan Digital &amp; Toko Buku untuk Developer Indonesia
          </h1>
          <p className="text-lg text-slate-600">
            Jelajahi ribuan buku teknologi, kelola koleksi perpustakaan, dan lakukan transaksi
            pembelian dalam satu platform terpadu yang terintegrasi dengan REST API buatanmu sendiri.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/books"
              className="inline-flex items-center rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow transition hover:bg-indigo-700"
            >
              Lihat Semua Buku
            </Link>
            <Link
              to="/transactions"
              className="inline-flex items-center rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300"
            >
              Riwayat Transaksi
            </Link>
          </div>
        </div>

      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-500">
              Buku Unggulan
            </p>
            <h2 className="text-3xl font-bold text-slate-900">Bacaan pilihan minggu ini</h2>
          </div>
          <Link
            to="/books"
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300"
          >
            Jelajahi Semua
          </Link>
        </div>

        {loading ? (
          <LoadingState title="Memuat buku unggulan" />
        ) : error ? (
          <ErrorState
            title="Oops!"
            description={error}
            action={
              <Button onClick={loadHighlight}>
                Muat Ulang
              </Button>
            }
          />
        ) : highlightBooks.length === 0 ? (
          <EmptyState
            title="Belum ada buku unggulan"
            description="Tambahkan buku baru di halaman manajemen buku."
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {highlightBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
