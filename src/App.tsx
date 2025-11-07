import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import BooksList from "./pages/BooksList";
import BookDetail from "./pages/BookDetail";
import AddBook from "./pages/AddBook";
import Checkout from "./pages/Checkout";
import Transactions from "./pages/Transactions";
import TransactionDetail from "./pages/TransactionDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<Home />} />
            <Route path="books" element={<BooksList />} />
            <Route path="books/:id" element={<BookDetail />} />

            <Route element={<ProtectedRoute />}>
              <Route path="books/add" element={<AddBook />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="transactions" element={<Transactions />} />
              <Route path="transactions/:id" element={<TransactionDetail />} />
            </Route>
          </Route>

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
