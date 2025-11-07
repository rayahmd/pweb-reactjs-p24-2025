import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import InputField from "../components/form/InputField";
import SelectField from "../components/form/SelectField";
import TextareaField from "../components/form/TextareaField";
import { EmptyState, ErrorState, LoadingState } from "../components/StateMessage";
import { createBook, getGenres } from "../services/bookService";
import type { Genre } from "../types/book";

const conditionOptions = [
  { label: "Baru", value: "NEW" },
  { label: "Seperti Baru", value: "LIKE_NEW" },
  { label: "Baik", value: "GOOD" },
  { label: "Cukup", value: "FAIR" },
];

export default function AddBook() {
  const navigate = useNavigate();
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loadingGenres, setLoadingGenres] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    writer: "",
    publisher: "",
    price: "",
    stock: "",
    genreId: "",
    condition: "NEW",
    publicationYear: "",
    publishDate: "",
    isbn: "",
    coverUrl: "",
    description: "",
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadGenres = async () => {
      setLoadingGenres(true);
      setFetchError(null);
      try {
        const data = await getGenres();
        setGenres(data);
      } catch (err) {
        setFetchError("Gagal memuat genre. Coba refresh halaman.");
      } finally {
        setLoadingGenres(false);
      }
    };

    loadGenres();
  }, []);

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!form.title.trim()) errors.title = "Judul wajib diisi";
    if (!form.writer.trim()) errors.writer = "Penulis wajib diisi";
    if (!form.price) errors.price = "Harga wajib diisi";
    if (!form.stock) errors.stock = "Stok wajib diisi";
    if (!form.genreId) errors.genreId = "Genre wajib dipilih";
    return errors;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);
    setFormError(null);
    try {
      await createBook({
        title: form.title,
        writer: form.writer,
        publisher: form.publisher,
        price: Number(form.price),
        stock: Number(form.stock),
        genreId: Number(form.genreId),
        condition: form.condition as "NEW" | "LIKE_NEW" | "GOOD" | "FAIR",
        publicationYear: form.publicationYear ? Number(form.publicationYear) : undefined,
        publishDate: form.publishDate || undefined,
        isbn: form.isbn || undefined,
        coverUrl: form.coverUrl || undefined,
        description: form.description || undefined,
      });
      navigate("/books");
    } catch (err) {
      setFormError("Gagal menyimpan buku. Pastikan data valid lalu coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingGenres) {
    return <LoadingState title="Menyiapkan form" description="Mengambil daftar genre..." />;
  }

  if (fetchError) {
    return (
      <ErrorState
        title="Tidak dapat menampilkan form"
        description={fetchError}
        action={
          <Button onClick={() => window.location.reload()}>
            Muat Ulang
          </Button>
        }
      />
    );
  }

  if (genres.length === 0) {
    return (
      <EmptyState
        title="Belum ada genre"
        description="Tambahkan data genre melalui API sebelum membuat buku."
      />
    );
  }

  return (
    <section className="space-y-6">
      <header>
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-500">Manajemen Buku</p>
        <h1 className="text-3xl font-bold text-slate-900">Tambah Buku Baru</h1>
        <p className="text-sm text-slate-500">Lengkapi data berikut untuk menambahkan koleksi buku.</p>
      </header>

      <form onSubmit={handleSubmit} className="grid gap-6 rounded-3xl border border-slate-200 bg-white p-8 shadow">
        <div className="grid gap-6 md:grid-cols-2">
          <InputField
            label="Judul Buku"
            value={form.title}
            onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
            error={fieldErrors.title}
            required
          />
          <InputField
            label="Penulis"
            value={form.writer}
            onChange={(event) => setForm((prev) => ({ ...prev, writer: event.target.value }))}
            error={fieldErrors.writer}
            required
          />
          <InputField
            label="Penerbit"
            value={form.publisher}
            onChange={(event) => setForm((prev) => ({ ...prev, publisher: event.target.value }))}
          />
          <InputField
            label="ISBN"
            value={form.isbn}
            onChange={(event) => setForm((prev) => ({ ...prev, isbn: event.target.value }))}
          />
          <InputField
            label="Harga (IDR)"
            type="number"
            min={0}
            value={form.price}
            onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))}
            error={fieldErrors.price}
            required
          />
          <InputField
            label="Stok"
            type="number"
            min={0}
            value={form.stock}
            onChange={(event) => setForm((prev) => ({ ...prev, stock: event.target.value }))}
            error={fieldErrors.stock}
            required
          />
          <SelectField
            label="Genre"
            value={form.genreId}
            onChange={(event) => setForm((prev) => ({ ...prev, genreId: event.target.value }))}
            options={[
              { label: "Pilih genre", value: "" },
              ...genres.map((genre) => ({ label: genre.name, value: String(genre.id) })),
            ]}
            error={fieldErrors.genreId}
            required
          />
          <SelectField
            label="Kondisi Buku"
            value={form.condition}
            onChange={(event) => setForm((prev) => ({ ...prev, condition: event.target.value }))}
            options={conditionOptions}
          />
          <InputField
            label="Tahun Terbit"
            type="number"
            value={form.publicationYear}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, publicationYear: event.target.value }))
            }
          />
          <InputField
            label="Tanggal Publish"
            type="date"
            value={form.publishDate}
            onChange={(event) => setForm((prev) => ({ ...prev, publishDate: event.target.value }))}
          />
          <InputField
            label="URL Sampul"
            type="url"
            value={form.coverUrl}
            onChange={(event) => setForm((prev) => ({ ...prev, coverUrl: event.target.value }))}
          />
        </div>

        <TextareaField
          label="Deskripsi"
          rows={5}
          value={form.description}
          onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
        />

        {formError ? <p className="text-sm font-semibold text-rose-500">{formError}</p> : null}

        <div className="flex flex-wrap gap-3">
          <Button type="submit" loading={submitting}>
            Simpan Buku
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate(-1)}
            disabled={submitting}
            className="border border-slate-200 text-slate-700"
          >
            Batal
          </Button>
        </div>
      </form>
    </section>
  );
}
