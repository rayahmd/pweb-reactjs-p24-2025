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
    { bookId: searchParams.get("bookId") || "", quantity: 1 },
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
    setItems((prev) => [...prev, { bookId: "", quantity: 1 }]);
  };

  const updateItem = (index: number, changes: Partial<CheckoutItem>) => {
    setItems((prev) => prev.map((item, idx) => (idx === index ? { ...item, ...changes } : item)));
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const summary = useMemo(() => {
    const enriched = items
      .map((item) => {
        const book = books.find((b) => String(b.id) === item.bookId);
        return { ...item, book };
      })
      .filter((item) => item.book && item.quantity > 0);

    const totalAmount = enriched.reduce((acc, item) => acc + item.quantity, 0);
    const totalPrice = enriched.reduce(
      (acc, item) => acc + item.quantity * (item.book?.price ?? 0),
      0,
    );

    return { enriched, totalAmount, totalPrice };
  }, [items, books]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setFormError(null);

    const payloadItems = items
      .filter((item) => item.bookId && item.quantity > 0)
      .map((item) => ({
        bookId: Number(item.bookId),
        quantity: Number(item.quantity),
      }));

    if (payloadItems.length === 0) {
      setFormError("Pilih minimal satu buku dengan jumlah lebih dari 0.");
      return;
    }

    setSubmitting(true);
    try {
      const transaction = await createTransaction({ items: payloadItems });
      navigate(`/transactions/${transaction.id}`);
    } catch (err) {
      setFormError("Gagal membuat transaksi. Coba lagi.");
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
      <header>
        <p className="text-sm font-semibold uppercase tracking-wider text-indigo-500">Checkout</p>
        <h1 className="text-3xl font-bold text-slate-900">Buat Transaksi Baru</h1>
        <p className="text-sm text-slate-500">
          Pilih satu atau lebih buku dan tentukan jumlah yang ingin Anda beli atau pinjam.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="grid gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow lg:grid-cols-[3fr,2fr]"
      >
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="rounded-2xl border border-slate-100 p-4">
              <div className="flex items-start justify-between">
                <p className="text-sm font-semibold text-slate-500">Item #{index + 1}</p>
                {items.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="text-xs font-semibold text-rose-500 hover:text-rose-600"
                  >
                    Hapus
                  </button>
                ) : null}
              </div>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <SelectField
                  label="Buku"
                  value={item.bookId}
                  onChange={(event) => updateItem(index, { bookId: event.target.value })}
                  options={[
                    { label: "Pilih buku", value: "" },
                    ...books.map((book) => ({
                      label: `${book.title} — ${formatCurrency(book.price)}`,
                      value: String(book.id),
                    })),
                  ]}
                  required
                />
                <InputField
                  label="Jumlah"
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(event) => updateItem(index, { quantity: Number(event.target.value) })}
                  required
                />
              </div>
            </div>
          ))}

          <Button type="button" variant="ghost" onClick={addItem} className="border border-dashed border-slate-300 text-slate-700">
            + Tambah Item
          </Button>
        </div>

        <aside className="space-y-4 rounded-2xl border border-slate-100 bg-slate-50 p-5">
          <h2 className="text-lg font-semibold text-slate-900">Ringkasan</h2>
          <dl className="space-y-2 text-sm text-slate-600">
            <div className="flex items-center justify-between">
              <dt>Total item</dt>
              <dd className="font-semibold text-slate-900">{summary.totalAmount} buku</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt>Estimasi harga</dt>
              <dd className="text-xl font-bold text-indigo-600">
                {formatCurrency(summary.totalPrice)}
              </dd>
            </div>
          </dl>

          {formError ? <p className="text-sm font-semibold text-rose-500">{formError}</p> : null}

          <Button type="submit" loading={submitting} disabled={summary.totalAmount === 0}>
            Proses Transaksi
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate(-1)}
            disabled={submitting}
            className="border border-slate-200 text-slate-700"
          >
            Batalkan
          </Button>
        </aside>
      </form>
    </section>
  );
}
