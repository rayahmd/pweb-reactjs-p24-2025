import type { PaginationMeta } from "./common";

export type BookCondition = "NEW" | "LIKE_NEW" | "GOOD" | "FAIR";

export interface Genre {
  id: number;
  name: string;
}

export interface Book {
  id: number;
  title: string;
  writer: string;
  publisher?: string;
  price: number;
  stock: number;
  genre?: Genre;
  genreId?: number;
  condition?: BookCondition;
  publicationYear?: number;
  publishDate?: string;
  description?: string;
  isbn?: string;
  coverUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BookListResponse {
  data: Book[];
  meta: PaginationMeta;
}

export interface BookFilters {
  search?: string;
  condition?: BookCondition | "ALL";
  genreId?: number;
  sortBy?: "title" | "publishDate";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface CreateBookPayload {
  title: string;
  writer: string;
  publisher: string;
  price: number;
  stock: number;
  genreId: number;
  condition: BookCondition;
  publicationYear?: number;
  publishDate?: string;
  description?: string;
  isbn?: string;
  coverUrl?: string;
}
