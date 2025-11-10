import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Button from "../components/Button";
import SelectField from "../components/form/SelectField";
import InputField from "../components/form/InputField";
import { EmptyState, ErrorState, LoadingState } from "../components/StateMessage";
import { getBooks } from "../services/bookService";
import { createTransaction } from "../services/transactionService";
import type { Book } from "../types/book";
import { formatCurrency } from "../utils/format";

interface CheckoutItem {
  id: string; // ✅ tambahkan id unik
  bookId: string;
  quantity: number;
}

export default function Checkout() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [items, setItems] = useState<CheckoutItem[]>([
    { 
      id: "init", 
      bookId: searchParams.get("bookId") || "", 
      quantity: 1 
    },
  ]);

  useEffect(() => {
    const loadBooks = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getBooks({ limit: 100, page: 1 });
        setBooks(response.data);
      } catch (err) {
        setError("Gagal memuat daftar buku.");
      } finally {
        setLoading(false);
      }
    };

    loadBooks();
  }, []);

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      { id: Date.now().toString(), bookId: "", quantity: 1 } // ✅ id unik
    ]);
  };

  const updateItem = (index: number, changes: Partial<CheckoutItem>) => {
    setItems((prev) => 
      prev.map((item, idx) => idx === index ? { ...item, ...changes } : item)
    );
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  // ✅ Tambahkan validasi stok
  const summary = useMemo(() => {
    const enriched = items
      .map((item) => {
        const book = books.find((b) => String(b.id) === item.bookId);
        const bookStock = book?.stock_quantity ?? book?.stock ?? 0;
        const isInStock = book ? item.quantity <= bookStock : true;
        return { ...item, book, isInStock };
      })
      .filter((item) => item.book && item.quantity > 0);

    const totalAmount = enriched.reduce((acc, item) => acc + item.quantity, 0);
    const totalPrice = enriched.reduce(
      (acc, item) => {
        const price = Number(item.book?.price) || 0;
        const quantity = Number(item.quantity) || 0;
        return acc + (quantity * price);
      },
      0
    );
    const hasStockError = enriched.some(item => !item.isInStock);

    return { enriched, totalAmount, totalPrice, hasStockError };
  }, [items, books]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setFormError(null);

    // ✅ Validasi stok
    if (summary.hasStockError) {
      setFormError("Beberapa buku melebihi stok yang tersedia.");
      return;
    }

    const payloadItems = items
      .filter((item) => item.bookId && item.quantity > 0)
      .map((item) => ({
        book_id: item.bookId,
        quantity: Number(item.quantity),
      }));

    if (payloadItems.length === 0) {
      setFormError("Pilih minimal satu buku dengan jumlah lebih dari 0.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await createTransaction({ items: payloadItems });
      navigate(`/transactions/${response.data.id}`);
    } catch (err: any) {
      setFormError(err?.response?.data?.message || "Gagal membuat transaksi. Coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingState title="Menyiapkan checkout" description="Mengambil daftar buku..." />;
  }

  if (error) {
    return (
      <ErrorState
        title="Checkout tidak tersedia"
        description={error}
        action={
          <Button onClick={() => window.location.reload()}>
            Muat ulang
          </Button>
        }
      />
    );
  }

  if (books.length === 0) {
    return (
      <EmptyState
        title="Belum ada buku"
        description="Tambahkan buku terlebih dahulu sebelum melakukan transaksi."
      />
    );
  }

  return (
    <section className="space-y-6">
      {/* HERO HEADER — konsisten */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-slate-900">Buat Transaksi Baru</h1>
        <p className="text-sm text-slate-600 mt-2">
          Pilih satu atau lebih buku dan tentukan jumlah yang ingin Anda beli.
        </p>
      </div>

      {/* FORM & RINGKASAN */}
      <form
        onSubmit={handleSubmit}
        className="grid gap-6 lg:grid-cols-[3fr,2fr]"
      >
        {/* FORM INPUT — CARD */}
        <div className="bg-white rounded-xl shadow-md border border-slate-200 p-5">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Pilih Buku</h2>
          
          <div className="space-y-4">
            {items.map((item, index) => {
              const book = books.find(b => String(b.id) === item.bookId);
              return (
                <div key={item.id} className="rounded-lg border border-slate-200 p-4 bg-slate-50">
                  <div className="flex items-start justify-between mb-3">
                    <p className="text-sm font-semibold text-indigo-600">Item #{index + 1}</p>
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="text-xs font-semibold text-rose-500 hover:text-rose-600"
                      >
                        Hapus
                      </button>
                    )}
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <SelectField
                      label="Buku"
                      value={item.bookId}
                      onChange={(e) => updateItem(index, { bookId: e.target.value })}
                      options={[
                        { label: "Pilih buku", value: "" },
                        ...books.map((book) => ({
                          label: `${book.title} — ${formatCurrency(book.price)}`,
                          value: String(book.id),
                          disabled: items.some(i => i.bookId === String(book.id) && i.id !== item.id),
                        })),
                      ]}
                      className="rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                      required
                    />

                    <InputField
                      label="Jumlah"
                      type="number"
                      min={1}
                      max={book?.stock || 100}
                      value={item.quantity}
                      onChange={(e) => updateItem(index, { quantity: Number(e.target.value) })}
                      className="rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                      required
                    />
                  </div>

                  {/* ✅ UI warning stok */}
                  {book && item.quantity > book.stock && (
                    <p className="mt-2 text-xs text-rose-500 flex items-center gap-1">
                      ⚠️ Stok hanya <span className="font-mono">{book.stock}</span>
                    </p>
                  )}
                  {book && item.quantity <= book.stock && book.stock > 0 && (
                    <p className="mt-2 text-xs text-emerald-600">
                      Tersedia: <span className="font-mono">{book.stock}</span> buku
                    </p>
                  )}
                </div>
              );
            })}

            <Button
              type="button"
              variant="secondary"
              onClick={addItem}
              className="w-full border-dashed border-slate-300 text-slate-700"
            >
              + Tambah Item
            </Button>
          </div>
        </div>

        {/* RINGKASAN — CARD */}
        <div className="bg-white rounded-xl shadow-md border border-slate-200 p-5">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Ringkasan Pembelian</h2>
          
          {/* Item Pembelian */}
          <div className="mb-4 space-y-3">
            <h3 className="text-sm font-semibold text-slate-700">Item Pembelian</h3>
            {summary.enriched.length === 0 ? (
              <p className="text-sm text-slate-500 italic">Belum ada buku dipilih</p>
            ) : (
              <div className="space-y-2">
                {summary.enriched.map((item) => {
                  const writer = item.book?.writer || (item.book as any)?.author || 'Penulis tidak tersedia';
                  const price = item.book?.price || 0;
                  const subtotal = item.quantity * price;
                  
                  return (
                    <div key={item.id} className="text-sm border-b border-slate-100 pb-2">
                      <div className="font-semibold text-slate-900">{item.book?.title}</div>
                      <div className="text-slate-600 text-xs">{writer}</div>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-slate-500">Qty: {item.quantity}</span>
                        <span className="font-semibold text-slate-900">{formatCurrency(subtotal)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="border-t border-slate-200 pt-4">
            <dl className="space-y-2 text-sm text-slate-600">
              <div className="flex items-center justify-between">
                <dt>Total item</dt>
                <dd className="font-semibold text-slate-900">{summary.totalAmount} buku</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt>Total harga</dt>
                <dd className="text-xl font-bold text-indigo-600">
                  {formatCurrency(summary.totalPrice)}
                </dd>
              </div>
            </dl>
          </div>

          {/* ERROR MESSAGE */}
          {formError && (
            <p className="mt-4 text-sm text-rose-500 font-medium">{formError}</p>
          )}

          {/* TOMBOL */}
          <div className="mt-6 space-y-3">
            <Button 
              type="submit" 
              loading={submitting}
              disabled={summary.totalAmount === 0 || summary.hasStockError}
              className="w-full"
            >
              Proses Transaksi
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(-1)}
              disabled={submitting}
              className="w-full"
            >
              Batalkan
            </Button>
          </div>
        </div>
      </form>
    </section>
  );
}