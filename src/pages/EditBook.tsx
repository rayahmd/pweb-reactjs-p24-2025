import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/Button";
import InputField from "../components/form/InputField";
import SelectField from "../components/form/SelectField";
import TextareaField from "../components/form/TextareaField";
import { ErrorState, LoadingState } from "../components/StateMessage";
import { getBookById } from "../services/bookService";
import { updateBook } from "../services/bookService";

const conditionOptions = [
  { label: "Baru", value: "NEW" },
  { label: "Seperti Baru", value: "LIKE_NEW" },
  { label: "Baik", value: "GOOD" },
  { label: "Cukup", value: "FAIR" },
];

const currentYear = new Date().getFullYear();

export default function EditBook() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loadingData, setLoadingData] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [form, setForm] = useState({
    description: "",
    price: "",
    stock: "",
    condition: "GOOD",
    publisher: "",
    publicationYear: "",
    isbn: "",
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      
      setLoadingData(true);
      setFetchError(null);
      try {
        const bookData = await getBookById(id);
        
        setForm({
          description: bookData.description || "",
          price: String(bookData.price),
          stock: String(bookData.stock_quantity ?? bookData.stock),
          condition: bookData.condition || "GOOD",
          publisher: bookData.publisher || "",
          publicationYear: String(bookData.publicationYear ?? bookData.publication_year ?? ""),
          isbn: bookData.isbn || "",
        });
      } catch (err) {
        setFetchError("Gagal memuat data buku. Coba refresh halaman.");
      } finally {
        setLoadingData(false);
      }
    };

    loadData();
  }, [id]);

  const validate = () => {
    const errors: Record<string, string> = {};
    
    if (form.price && Number(form.price) < 0) {
      errors.price = "Harga tidak boleh negatif";
    }
    if (form.stock && Number(form.stock) < 0) {
      errors.stock = "Stok tidak boleh negatif";
    }
    if (form.publicationYear) {
      const year = Number(form.publicationYear);
      if (year > currentYear) {
        errors.publicationYear = `Tahun terbit tidak boleh lebih dari ${currentYear}`;
      }
      if (year < 1000) {
        errors.publicationYear = "Tahun terbit tidak valid";
      }
    }
    
    return errors;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    
    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    if (!id) return;

    setSubmitting(true);
    setFormError(null);
    try {
      await updateBook(id, {
        description: form.description || undefined,
        price: form.price ? Number(form.price) : undefined,
        stock: form.stock ? Number(form.stock) : undefined,
        condition: form.condition as "NEW" | "LIKE_NEW" | "GOOD" | "FAIR",
        publisher: form.publisher || undefined,
        publicationYear: form.publicationYear ? Number(form.publicationYear) : undefined,
        isbn: form.isbn || undefined,
      });
      navigate(`/books/${id}`);
    } catch (err: any) {
      setFormError(err?.response?.data?.message || "Gagal mengupdate buku. Pastikan data valid lalu coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingData) {
    return <LoadingState title="Memuat data buku" description="Mengambil informasi buku..." />;
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

  return (
    <section className="space-y-6">
      <header>
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-500">Manajemen Buku</p>
        <h1 className="text-3xl font-bold text-slate-900">Edit Buku</h1>
        <p className="text-sm text-slate-500">Perbarui informasi buku yang tersedia.</p>
      </header>

      <form onSubmit={handleSubmit} className="grid gap-6 rounded-3xl border border-slate-200 bg-white p-8 shadow">
        <div className="grid gap-6 md:grid-cols-2">
          <InputField
            label="Harga (IDR)"
            type="number"
            min={0}
            value={form.price}
            onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))}
            error={fieldErrors.price}
          />
          <InputField
            label="Stok"
            type="number"
            min={0}
            value={form.stock}
            onChange={(event) => setForm((prev) => ({ ...prev, stock: event.target.value }))}
            error={fieldErrors.stock}
          />
          <SelectField
            label="Kondisi Buku"
            value={form.condition}
            onChange={(event) => setForm((prev) => ({ ...prev, condition: event.target.value }))}
            options={conditionOptions}
          />
          <InputField
            label="Penerbit"
            value={form.publisher}
            onChange={(event) => setForm((prev) => ({ ...prev, publisher: event.target.value }))}
          />
          <InputField
            label="Tahun Terbit"
            type="number"
            min={1000}
            max={currentYear}
            value={form.publicationYear}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, publicationYear: event.target.value }))
            }
            error={fieldErrors.publicationYear}
          />
          <InputField
            label="ISBN"
            value={form.isbn}
            onChange={(event) => setForm((prev) => ({ ...prev, isbn: event.target.value }))}
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
            Simpan Perubahan
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
