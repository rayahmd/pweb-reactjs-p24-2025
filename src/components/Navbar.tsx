import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "./Button";

const navLinks = [
  { label: "Beranda", to: "/" },
  { label: "Daftar Buku", to: "/books" },
  { label: "Tambah Buku", to: "/books/add", protected: true },
  { label: "Transaksi", to: "/transactions", protected: true },
];

export default function Navbar() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-bold text-indigo-600 transition hover:text-indigo-700"
        >
          <span className="h-9 w-9 rounded-2xl bg-linear-to-br from-indigo-500 to-blue-500" />
          IT Literature
        </Link>

        <ul className="hidden flex-1 items-center gap-5 text-sm font-semibold text-slate-600 md:flex">
          {navLinks.map(({ label, to, protected: isProtected }) => {
            if (isProtected && !token) return null;
            return (
              <li key={label}>
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-2 transition ${
                      isActive ? "bg-indigo-50 text-indigo-600" : "hover:text-indigo-600"
                    }`
                  }
                >
                  {label}
                </NavLink>
              </li>
            );
          })}
        </ul>

        <div className="flex flex-1 items-center justify-end gap-3 text-sm text-slate-700">
          {token ? (
            <>
              <div className="hidden flex-col text-right text-xs font-semibold sm:flex">
                <span className="text-slate-400">Masuk sebagai</span>
                <span className="text-slate-800">{user?.email}</span>
              </div>
              <Button variant="ghost" className="hidden sm:inline-flex" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-xl border border-indigo-100 px-4 py-2 text-sm font-semibold text-indigo-600 transition hover:border-indigo-300 hover:bg-indigo-50"
              >
                Masuk
              </Link>
              <Link
                to="/register"
                className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                Daftar
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
