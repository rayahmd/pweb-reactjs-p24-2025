import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import Pagination from "../components/Pagination";
import { EmptyState, ErrorState, LoadingState } from "../components/StateMessage";
import { getTransactions } from "../services/transactionService";
import type { Transaction } from "../types/transaction";
import type { PaginationMeta } from "../types/common";
import { formatCurrency, formatDate } from "../utils/format";

const sortOptions = [
  { label: "ID Transaksi", value: "id" },
  { label: "Jumlah Item", value: "totalAmount" },
  { label: "Total Harga", value: "totalPrice" },
];

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [filters, setFilters] = useState({
    search: "",
    sortBy: "id",
    sortOrder: "desc",
    page: 1,
    limit: 6,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTransactions = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getTransactions({
          ...filters,
          search: filters.search || undefined,
        });
        setTransactions(response.data);
        setMeta(response.meta || null);
      } catch (err) {
        setError("Gagal memuat transaksi. Pastikan Anda sudah login.");
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, [filters]);

  const updateFilters = (changes: Partial<typeof filters>) => {
    setFilters((prev) => ({
      ...prev,
      ...changes,
      page: changes.page ?? 1,
    }));
  };

  return (
    <section className="space-y-6">
      {/* HERO HEADER — mirip homepage */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Riwayat Transaksi</h1>
        <p className="text-sm text-slate-600 mt-2">
          Pantau semua pembelian buku IT Anda dalam satu tempat terintegrasi.
        </p>
        <div className="flex gap-3 mt-4">
          <Link
            to="/books"
            className="inline-flex items-center rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Lihat Semua Buku
          </Link>
          <Link
            to="/checkout"
            className="inline-flex items-center rounded-xl border border-indigo-600 px-5 py-2 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50"
          >
            Buat Transaksi Baru
          </Link>
        </div>
      </div>

      {/* FILTER CARD — mirip homepage card */}
      <div className="grid gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
        <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-indigo-500 sm:col-span-2">
          Cari berdasarkan ID transaksi
          <input
            type="search"
            placeholder="Misal: TRX-1023"
            value={filters.search}
            onChange={(event) => updateFilters({ search: event.target.value })}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          />
        </label>

        <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-indigo-500">
          Urutkan menurut
          <select
            value={filters.sortBy}
            onChange={(event) => updateFilters({ sortBy: event.target.value })}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-indigo-500">
          Urutan data
          <select
            value={filters.sortOrder}
            onChange={(event) => updateFilters({ sortOrder: event.target.value })}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          >
            <option value="desc">Terbaru</option>
            <option value="asc">Terlama</option>
          </select>
        </label>
      </div>

      {/* LIST TRANSAKSI */}
      {loading ? (
        <LoadingState title="Memuat transaksi" description="Menyiapkan data riwayat..." />
      ) : error ? (
        <ErrorState
          title="Tidak dapat memuat transaksi"
          description={error}
          action={
            <Button onClick={() => setFilters((prev) => ({ ...prev }))}>
              Coba Lagi
            </Button>
          }
        />
      ) : transactions.length === 0 ? (
        <EmptyState
          title="Belum ada transaksi"
          description="Mulai transaksi pertama Anda dan catatan akan muncul di sini."
          action={
            <Link
              to="/checkout"
              className="inline-flex items-center rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white"
            >
              Buat Transaksi
            </Link>
          }
        />
      ) : (
        <>
          <div className="overflow-hidden rounded-xl border border-slate-200 shadow">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr className="text-left text-xs font-semibold uppercase tracking-wider text-indigo-500">
                  <th className="px-6 py-3">ID</th>
                  <th className="px-6 py-3">Tanggal</th>
                  <th className="px-6 py-3">Jumlah Item</th>
                  <th className="px-6 py-3">Total Harga</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white text-sm text-slate-700">
                {transactions.map((transaction) => {
                  // Hitung ulang total dari items
                  const calculatedTotal = transaction.items?.reduce((sum, item) => {
                    const price = Number(item.price) || 0;
                    const quantity = Number(item.quantity) || 0;
                    return sum + (price * quantity);
                  }, 0) || 0;

                  const totalItems = transaction.items?.reduce((sum, item) => {
                    return sum + (Number(item.quantity) || 0);
                  }, 0) || 0;

                  return (
                    <tr key={transaction.id} className="hover:bg-slate-50/60">
                      <td className="px-6 py-4 font-semibold text-slate-900">#{transaction.id}</td>
                      <td className="px-6 py-4">{formatDate(transaction.createdAt)}</td>
                      <td className="px-6 py-4">{totalItems} buku</td>
                      <td className="px-6 py-4 font-semibold text-slate-900">
                        {formatCurrency(calculatedTotal)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            transaction.status === "PAID"
                              ? "bg-emerald-50 text-emerald-700"
                              : transaction.status === "PENDING"
                                ? "bg-amber-50 text-amber-700"
                                : "bg-rose-50 text-rose-700"
                          }`}
                        >
                          {transaction.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          to={`/transactions/${transaction.id}`}
                          className="text-sm font-semibold text-indigo-600 hover:text-indigo-800"
                        >
                          Detail
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {meta && (
            <Pagination
              page={meta.page}
              totalPage={meta.totalPage}
              onChange={(page) => updateFilters({ page })}
            />
          )}
        </>
      )}
    </section>
  );
}