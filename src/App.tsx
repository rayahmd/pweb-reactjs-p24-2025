import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import BooksList from "./pages/BooksList";
import BookDetail from "./pages/BookDetail";
import AddBook from "./pages/AddBook";
import EditBook from "./pages/EditBook";
import Checkout from "./pages/Checkout";
import Transactions from "./pages/Transactions";
import TransactionDetail from "./pages/TransactionDetail";
import Genres from "./pages/Genres";
import AddGenre from "./pages/AddGenre";
import EditGenre from "./pages/EditGenre";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          <Route element={<AppLayout />}>
            <Route element={<ProtectedRoute />}>
              <Route path="home" element={<Home />} />
              <Route path="books/add" element={<AddBook />} />
              <Route path="books/:id/edit" element={<EditBook />} />
              <Route path="genres" element={<Genres />} />
              <Route path="genres/add" element={<AddGenre />} />
              <Route path="genres/:id/edit" element={<EditGenre />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="transactions" element={<Transactions />} />
              <Route path="transactions/:id" element={<TransactionDetail />} />
            </Route>

            {/* Public routes */}
            <Route path="books" element={<BooksList />} />
            <Route path="books/:id" element={<BookDetail />} />
          </Route>

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
