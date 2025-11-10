import type { PaginationMeta } from "./common";

export type BookCondition = "NEW" | "LIKE_NEW" | "GOOD" | "FAIR";

export interface Genre {
  id: string;
  name: string;
  description?: string;
}

export interface Book {
  id: string;
  title: string;
  writer: string;
  publisher?: string;
  price: number;
  stock: number;
  stock_quantity?: number;
  genre?: string | Genre;
  genreId?: string;
  condition?: BookCondition;
  publicationYear?: number;
  publication_year?: number;
  publishDate?: string;
  description?: string;
  isbn?: string;
  coverUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BookListResponse {
  success: boolean;
  message?: string;
  data: Book[];
  meta: PaginationMeta;
}

export interface BookDetailResponse {
  success: boolean;
  message?: string;
  data: Book;
}

export interface BookFilters {
  search?: string;
  condition?: BookCondition | "ALL";
  genreId?: string;
  sortBy?: "title" | "publishDate";
  sortOrder?: "asc" | "desc";
  orderByTitle?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface CreateBookPayload {
  title: string;
  author: string;
  publisher?: string;
  price: number;
  stock: number;
  genre_id: string;
  condition?: BookCondition;
  publicationYear?: number;
  publishDate?: string;
  description?: string;
  isbn?: string;
  coverUrl?: string;
}
