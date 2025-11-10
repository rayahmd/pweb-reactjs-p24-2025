import API from "./api";
import type {
  Book,
  BookFilters,
  BookListResponse,
  BookDetailResponse,
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

export const getBookById = async (id: string): Promise<Book> => {
  const { data } = await API.get<BookDetailResponse>(`/books/${id}`);
  return data.data;
};

export const createBook = async (payload: CreateBookPayload): Promise<any> => {
  const { data } = await API.post<any>("/books", payload);
  return data;
};

export const updateBook = async (id: string, payload: Partial<CreateBookPayload>): Promise<any> => {
  const { data } = await API.patch<any>(`/books/${id}`, payload);
  return data;
};

export const deleteBook = async (id: string): Promise<void> => {
  await API.delete(`/books/${id}`);
};

export const getGenres = async (): Promise<Genre[]> => {
  const { data } = await API.get<{ success: boolean; data: Genre[] }>("/genre");
  return data.data;
};
