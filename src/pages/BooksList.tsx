import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import BookCard from "../components/BookCard";
import Pagination from "../components/Pagination";
import { EmptyState, ErrorState, LoadingState } from "../components/StateMessage";
import { useAuth } from "../context/AuthContext";
import { deleteBook, getBooks, getGenres } from "../services/bookService";
import type { Book, BookFilters, Genre } from "../types/book";
import type { PaginationMeta } from "../types/common";

const conditionOptions = [
  { label: "Semua kondisi", value: "ALL" },
  { label: "Baru", value: "NEW" },
  { label: "Seperti Baru", value: "LIKE_NEW" },
  { label: "Baik", value: "GOOD" },
  { label: "Cukup", value: "FAIR" },
];

const sortOptions = [
  { label: "Judul", value: "title" },
  { label: "Tanggal Terbit", value: "publishDate" },
];

export default function BooksList() {
  const { token } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [filters, setFilters] = useState<BookFilters>({
    search: "",
    condition: "ALL",
    page: 1,
    limit: 9,
    sortBy: "title",
    sortOrder: "asc",
  });
  const [genreFilter, setGenreFilter] = useState<string>("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    const loadGenres = async () => {
      try {
        const data = await getGenres();
        setGenres(data);
      } catch (err) {
        console.error(err);
      }
    };
    loadGenres();
  }, []);

  useEffect(() => {
    const loadBooks = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getBooks({
          ...filters,
          genreId: genreFilter === "ALL" ? undefined : Number(genreFilter),
          condition: filters.condition === "ALL" ? undefined : filters.condition,
        });
        setBooks(response.data);
        setMeta(response.meta);
      } catch (err) {
        setError("Gagal memuat daftar buku. Coba muat ulang halaman.");
      } finally {
        setLoading(false);
      }
    };

    loadBooks();
  }, [filters, genreFilter]);

  const updateFilters = (changes: Partial<BookFilters>) => {
    setFilters((prev) => ({
      ...prev,
      ...changes,
      page: changes.page ?? 1,
    }));
  };

  const refresh = () => {
    setFilters((prev) => ({ ...prev }));
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Hapus buku ini? Tindakan tidak dapat dibatalkan.")) {
      return;
    }
    try {
      setDeletingId(id);
      await deleteBook(id);
      setBooks((prev) => prev.filter((book) => book.id !== id));
    } catch (err) {
      alert("Gagal menghapus buku. Silakan coba lagi.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-500">
            Katalog Buku
          </p>
          <h1 className="text-3xl font-bold text-slate-900">Daftar Buku</h1>
          <p className="text-sm text-slate-500">
            Cari, filter, dan kelola buku pada perpustakaan IT Literature Shop.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            className="hidden items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900 sm:inline-flex"
            onClick={() => {
              setGenreFilter("ALL");
              updateFilters({
                search: "",
                condition: "ALL",
                sortBy: "title",
                sortOrder: "asc",
                page: 1,
              });
            }}
          >
            Reset Filter
          </button>
          <Link
            to="/books/add"
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white shadow transition ${
              token ? "bg-indigo-600 hover:bg-indigo-700" : "bg-slate-400"
            }`}
          >
            + Tambah Buku
          </Link>
        </div>
      </header>

      <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow sm:grid-cols-2 lg:grid-cols-5">
        <label className="flex flex-col gap-1 text-xs font-semibold text-slate-500 sm:col-span-2">
          Kata kunci
          <input
            type="search"
            placeholder="Cari judul atau penulis"
            value={filters.search}
            onChange={(event) => updateFilters({ search: event.target.value })}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          />
        </label>

        <label className="flex flex-col gap-1 text-xs font-semibold text-slate-500">
          Kondisi
          <select
            value={filters.condition}
            onChange={(event) =>
              updateFilters({ condition: event.target.value as BookFilters["condition"] })
            }
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          >
            {conditionOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-xs font-semibold text-slate-500">
          Genre
          <select
            value={genreFilter}
            onChange={(event) => setGenreFilter(event.target.value)}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          >
            <option value="ALL">Semua genre</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-xs font-semibold text-slate-500">
          Urutkan
          <select
            value={filters.sortBy}
            onChange={(event) => updateFilters({ sortBy: event.target.value as BookFilters["sortBy"] })}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-xs font-semibold text-slate-500">
          Urutan data
          <select
            value={filters.sortOrder}
            onChange={(event) =>
              updateFilters({ sortOrder: event.target.value as BookFilters["sortOrder"] })
            }
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          >
            <option value="asc">A - Z / Terlama</option>
            <option value="desc">Z - A / Terbaru</option>
          </select>
        </label>
      </div>

      {loading ? (
        <LoadingState title="Memuat buku" description="Mohon tunggu sebentar..." />
      ) : error ? (
        <ErrorState
          title="Tidak dapat memuat data"
          description={error}
          action={
            <Button variant="primary" onClick={refresh}>
              Coba Lagi
            </Button>
          }
        />
      ) : books.length === 0 ? (
        <EmptyState
          title="Belum ada buku"
          description="Silakan tambah buku baru atau ubah filter pencarian."
          action={
            token ? (
              <Link
                to="/books/add"
                className="inline-flex items-center rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white"
              >
                Tambah Buku Pertama
              </Link>
            ) : null
          }
        />
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((book) => (
              <div key={book.id} className="relative">
                <BookCard book={book} />
                {token ? (
                  <div className="absolute right-4 top-4 flex gap-2">
                    <Button
                      variant="ghost"
                      className="border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-rose-600"
                      onClick={(event) => {
                        event.preventDefault();
                        handleDelete(book.id);
                      }}
                      disabled={deletingId === book.id}
                    >
                      {deletingId === book.id ? "Menghapus..." : "Hapus"}
                    </Button>
                  </div>
                ) : null}
              </div>
            ))}
          </div>

          {meta ? (
            <Pagination
              page={meta.page}
              totalPage={meta.totalPage}
              onChange={(page) => updateFilters({ page })}
            />
          ) : null}
        </>
      )}
    </section>
  );
}
