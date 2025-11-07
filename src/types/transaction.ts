import type { PaginationMeta } from "./common";
import type { Book } from "./book";

export interface TransactionItem {
  id?: number;
  bookId: number;
  quantity: number;
  price: number;
  book?: Book;
}

export interface Transaction {
  id: number;
  items: TransactionItem[];
  totalAmount: number;
  totalPrice: number;
  status: "PENDING" | "PAID" | "CANCELLED";
  createdAt: string;
  updatedAt?: string;
}

export interface TransactionListResponse {
  data: Transaction[];
  meta: PaginationMeta;
}

export interface CreateTransactionPayload {
  items: Array<{
    bookId: number;
    quantity: number;
  }>;
}
