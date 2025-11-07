import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import InputField from "../components/form/InputField";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.email || !form.password) {
      setError("Email dan password wajib diisi.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await login(form);
      const redirectPath = (location.state as { from?: Location })?.from?.pathname || "/books";
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError("Login gagal. Periksa kredensial Anda.");
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
        <p className="text-sm font-semibold uppercase tracking-wider text-indigo-500">Selamat datang</p>
        <h1 className="text-3xl font-bold text-slate-900">Masuk ke akun Anda</h1>
        <p className="text-sm text-slate-500">Kelola katalog dan transaksi perpustakaan digital.</p>

        <div className="mt-6 space-y-4">
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
          Masuk
        </Button>

        <p className="mt-4 text-center text-sm text-slate-500">
          Belum punya akun?{" "}
          <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-800">
            Daftar sekarang
          </Link>
        </p>
      </form>
    </div>
  );
}
