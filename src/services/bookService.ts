import API from "./api";
import type {
  Book,
  BookFilters,
  BookListResponse,
  CreateBookPayload,
  Genre,
} from "../types/book";

export const getBooks = async (
  filters: BookFilters,
): Promise<BookListResponse> => {
  const { data } = await API.get<BookListResponse>("/books", {
    params: filters,
  });
  return data;
};

export const getBookById = async (id: string | number): Promise<Book> => {
  const { data } = await API.get<Book>(`/books/${id}`);
  return data;
};

export const createBook = async (payload: CreateBookPayload): Promise<Book> => {
  const { data } = await API.post<Book>("/books", payload);
  return data;
};

export const deleteBook = async (id: string | number): Promise<void> => {
  await API.delete(`/books/${id}`);
};

export const getGenres = async (): Promise<Genre[]> => {
  const { data } = await API.get<Genre[]>("/genres");
  return data;
};
