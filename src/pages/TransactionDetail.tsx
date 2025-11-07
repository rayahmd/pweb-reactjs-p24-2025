import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Button from "../components/Button";
import { EmptyState, ErrorState, LoadingState } from "../components/StateMessage";
import { getTransactionById } from "../services/transactionService";
import type { Transaction } from "../types/transaction";
import { formatCurrency, formatDate } from "../utils/format";

export default function TransactionDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const loadTransaction = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getTransactionById(id);
        setTransaction(data);
      } catch (err) {
        setError("Transaksi tidak ditemukan.");
      } finally {
        setLoading(false);
      }
    };

    loadTransaction();
  }, [id]);

  if (loading) {
    return <LoadingState title="Memuat transaksi" description="Sedang mengambil detail..." />;
  }

  if (error) {
    return (
      <ErrorState
        title="Tidak dapat memuat detail"
        description={error}
        action={
          <Button onClick={() => navigate(-1)}>
            Kembali
          </Button>
        }
      />
    );
  }

  if (!transaction) {
    return (
      <EmptyState
        title="Data transaksi kosong"
        description="Transaksi mungkin sudah dihapus atau tidak pernah ada."
        action={
          <Link
            to="/transactions"
            className="inline-flex items-center rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white"
          >
            Kembali ke daftar
          </Link>
        }
      />
    );
  }

  return (
    <section className="space-y-6">
      {/* HERO HEADER — konsisten dengan Transactions.tsx */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-indigo-500">
              Detail Transaksi
            </p>
            <h1 className="text-3xl font-bold text-slate-900">#{transaction.id}</h1>
            <p className="text-sm text-slate-600">
              Dibuat pada {formatDate(transaction.createdAt)}
            </p>
          </div>

          <span
            className={`inline-flex items-center rounded-full px-4 py-2 text-xs font-semibold ${
              transaction.status === "PAID"
                ? "bg-emerald-50 text-emerald-700"
                : transaction.status === "PENDING"
                ? "bg-amber-50 text-amber-700"
                : "bg-rose-50 text-rose-700"
            }`}
          >
            {transaction.status}
          </span>
        </div>
      </div>

      {/* KONTEN UTAMA — dua kolom */}
      <div className="grid gap-6 lg:grid-cols-[3fr,2fr]">
        {/* ITEM LIST CARD */}
        <div className="bg-white rounded-xl shadow-md border border-slate-200">
          <div className="border-b border-slate-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-slate-900">Item Pembelian</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {transaction.items.map((item) => (
              <div key={`${item.bookId}-${item.quantity}`} className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {item.book?.title || `Buku #${item.bookId}`}
                  </p>
                  <p className="text-xs text-slate-500">
                    {item.book?.writer ? `oleh ${item.book.writer}` : "Penulis tidak tersedia"}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    <span className="font-medium">Qty:</span> {item.quantity}
                  </p>
                </div>
                <p className="text-sm font-semibold text-slate-900">
                  {formatCurrency(item.price)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* RINGKASAN CARD */}
        <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Ringkasan Pembelian</h2>
          <dl className="space-y-3 text-sm text-slate-600">
            <div className="flex items-center justify-between">
              <dt>Total item</dt>
              <dd className="font-semibold text-slate-900">{transaction.totalAmount} buku</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt>Total harga</dt>
              <dd className="text-xl font-bold text-indigo-600">
                {formatCurrency(transaction.totalPrice)}
              </dd>
            </div>
          </dl>

          {/* TOMBOL AKSI */}
          <div className="flex flex-wrap gap-3 pt-6">
            <Link
              to="/transactions"
              className="inline-flex flex-1 items-center justify-center rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
            >
              Kembali ke daftar
            </Link>
            <Link
              to="/books"
              className="inline-flex flex-1 items-center justify-center rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Belanja lagi
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}