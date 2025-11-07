import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Button from "../components/Button";
import { EmptyState, ErrorState, LoadingState } from "../components/StateMessage";
import { getTransactionById } from "../services/transactionService";
import type { Transaction } from "../types/transaction";
import { formatCurrency, formatDate } from "../utils/format";

export default function TransactionDetail() {
  const { id } = useParams();
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
            className="inline-flex items-center rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white"
          >
            Kembali ke daftar
          </Link>
        }
      />
    );
  }

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-500">
            Detail Transaksi
          </p>
          <h1 className="text-3xl font-bold text-slate-900">#{transaction.id}</h1>
          <p className="text-sm text-slate-500">Dibuat pada {formatDate(transaction.createdAt)}</p>
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
      </header>

      <div className="grid gap-6 lg:grid-cols-[3fr,2fr]">
        <div className="rounded-3xl border border-slate-200 bg-white shadow">
          <h2 className="border-b border-slate-100 px-6 py-4 text-lg font-semibold text-slate-900">
            Item Pembelian
          </h2>
          <div className="divide-y divide-slate-100">
            {transaction.items.map((item) => (
              <div key={item.id ?? item.bookId} className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {item.book?.title || `Buku #${item.bookId}`}
                  </p>
                  <p className="text-xs text-slate-500">
                    {item.book?.writer ? `oleh ${item.book.writer}` : "Tanpa penulis"}
                  </p>
                  <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-semibold text-slate-900">
                  {formatCurrency(item.price)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow">
          <h2 className="text-lg font-semibold text-slate-900">Ringkasan Pembayaran</h2>
          <dl className="space-y-3 text-sm text-slate-600">
            <div className="flex items-center justify-between">
              <dt>Total item</dt>
              <dd className="font-semibold text-slate-900">{transaction.totalAmount} buku</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt>Total harga</dt>
              <dd className="text-lg font-bold text-indigo-600">
                {formatCurrency(transaction.totalPrice)}
              </dd>
            </div>
          </dl>

          <div className="flex flex-wrap gap-3 pt-4">
            <Link
              to="/transactions"
              className="inline-flex flex-1 items-center justify-center rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300"
            >
              Kembali ke daftar
            </Link>
            <Link
              to="/books"
              className="inline-flex flex-1 items-center justify-center rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Belanja lagi
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
