import type { PaginationMeta } from "./common";
import type { Book } from "./book";

export interface TransactionItem {
  id?: string;
  bookId: string;
  book_id?: string;
  quantity: number;
  price: number;
  book?: Book;
}

export interface Transaction {
  id: string;
  userId: string;
  items: TransactionItem[];
  total: number;
  totalAmount?: number;
  totalPrice?: number;
  status?: "PENDING" | "PAID" | "CANCELLED";
  createdAt: string;
  updatedAt?: string;
}

export interface TransactionListResponse {
  success: boolean;
  data: Transaction[];
  meta?: PaginationMeta;
}

export interface TransactionDetailResponse {
  success: boolean;
  data: Transaction;
}

export interface CreateTransactionPayload {
  items: Array<{
    book_id: string;
    quantity: number;
  }>;
}
