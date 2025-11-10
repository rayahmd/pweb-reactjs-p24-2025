import api from './api';

export interface Genre {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    books: number;
  };
}

export interface GenreFormData {
  name: string;
  description?: string;
}

export const getAllGenres = async (): Promise<Genre[]> => {
  const response = await api.get('/genre');
  return response.data.data;
};

export const getGenreById = async (id: string): Promise<Genre> => {
  const response = await api.get(`/genre/${id}`);
  return response.data.data;
};

export const createGenre = async (data: GenreFormData): Promise<Genre> => {
  const response = await api.post('/genre', data);
  return response.data.data;
};

export const updateGenre = async (id: string, data: GenreFormData): Promise<Genre> => {
  const response = await api.patch(`/genre/${id}`, data);
  return response.data.data;
};

export const deleteGenre = async (id: string): Promise<void> => {
  await api.delete(`/genre/${id}`);
};
