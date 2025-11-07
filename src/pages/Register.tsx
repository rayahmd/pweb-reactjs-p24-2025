import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import InputField from "../components/form/InputField";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.name || !form.email || !form.password) {
      setError("Semua field wajib diisi.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await register(form);
      navigate("/books");
    } catch (err) {
      setError("Registrasi gagal. Pastikan email belum terdaftar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-lg"
      >
        <p className="text-sm font-semibold uppercase tracking-wider text-emerald-500">
          Bergabung sekarang
        </p>
        <h1 className="text-3xl font-bold text-slate-900">Daftar akun baru</h1>
        <p className="text-sm text-slate-500">Bangun katalog dan transaksi buku Anda.</p>

        <div className="mt-6 space-y-4">
          <InputField
            label="Nama Lengkap"
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            required
          />
          <InputField
            label="Email"
            type="email"
            value={form.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
            required
          />
          <InputField
            label="Password"
            type="password"
            value={form.password}
            onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
            required
          />
        </div>

        {error ? <p className="mt-3 text-sm font-semibold text-rose-500">{error}</p> : null}

        <Button type="submit" loading={loading} className="mt-6 w-full">
          Daftar
        </Button>

        <p className="mt-4 text-center text-sm text-slate-500">
          Sudah punya akun?{" "}
          <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-800">
            Masuk
          </Link>
        </p>
      </form>
    </div>
  );
}
