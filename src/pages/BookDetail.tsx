import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Button from "../components/Button";
import { EmptyState, ErrorState, LoadingState } from "../components/StateMessage";
import { useAuth } from "../context/AuthContext";
import { getBookById } from "../services/bookService";
import type { Book } from "../types/book";
import { formatCurrency, formatDate } from "../utils/format";

export default function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const loadBook = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getBookById(id);
        setBook(data);
      } catch (err) {
        setError("Buku tidak ditemukan atau terjadi kesalahan server.");
      } finally {
        setLoading(false);
      }
    };

    loadBook();
  }, [id]);

  if (loading) {
    return <LoadingState title="Memuat detail buku" description="Sedang mengambil data..." />;
  }

  if (error) {
    return (
      <ErrorState
        title="Tidak dapat memuat detail"
        description={error}
        action={
          <Button variant="primary" onClick={() => navigate(-1)}>
            Kembali
          </Button>
        }
      />
    );
  }

  if (!book) {
    return (
      <EmptyState
        title="Data buku kosong"
        description="Buku tidak tersedia atau telah dihapus."
        action={
          <Button variant="primary" onClick={() => navigate("/books")}>
            Lihat Buku Lain
          </Button>
        }
      />
    );
  }

  return (
    <section className="grid gap-10 lg:grid-cols-[2fr,1fr]">
      <div className="space-y-6">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow">
          <img
            src={book.coverUrl || `https://source.unsplash.com/900x900/?book&sig=${book.id}`}
            alt={book.title}
            className="h-96 w-full object-cover"
          />
        </div>

        <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-indigo-500">
              {book.genre?.name || "Tanpa Genre"}
            </p>
            <h1 className="text-4xl font-bold text-slate-900">{book.title}</h1>
            <p className="text-lg text-slate-500">oleh {book.writer}</p>
          </div>

          <p className="text-slate-700">{book.description || "Belum ada deskripsi untuk buku ini."}</p>

          <dl className="grid gap-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600 sm:grid-cols-2">
            <div>
              <dt className="font-semibold text-slate-800">Penerbit</dt>
              <dd>{book.publisher || "-"}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-800">Tahun Terbit</dt>
              <dd>{book.publicationYear ?? "-"}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-800">ISBN</dt>
              <dd>{book.isbn || "-"}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-800">Kondisi</dt>
              <dd>{book.condition || "-"}</dd>
            </div>
          </dl>
        </div>
      </div>

      <aside className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">Harga</p>
        <p className="text-4xl font-bold text-indigo-600">{formatCurrency(book.price)}</p>
        <p className="text-sm text-slate-500">
          Stok tersedia: <span className="font-semibold text-slate-800">{book.stock}</span> buku
        </p>
        <p className="text-sm text-slate-500">Terakhir diperbarui {formatDate(book.updatedAt)}</p>

        <div className="space-y-3 pt-4">
          <Link
            to={`/checkout?bookId=${book.id}`}
            className="block rounded-2xl bg-indigo-600 px-4 py-3 text-center font-semibold text-white transition hover:bg-indigo-700"
          >
            Beli / Pinjam Buku
          </Link>
          {token ? (
            <Link
              to="/transactions"
              className="block rounded-2xl border border-slate-200 px-4 py-3 text-center font-semibold text-slate-700 transition hover:border-slate-300"
            >
              Lihat Riwayat Transaksi
            </Link>
          ) : (
            <Link
              to="/login"
              className="block rounded-2xl border border-slate-200 px-4 py-3 text-center font-semibold text-slate-700 transition hover:border-slate-300"
            >
              Login untuk mengelola
            </Link>
          )}
        </div>
      </aside>
    </section>
  );
}
