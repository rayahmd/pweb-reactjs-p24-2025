import API from "./api";
import type { AuthResponse, LoginPayload, RegisterPayload, User, UserResponse } from "../types/auth";

export const login = async (payload: LoginPayload): Promise<AuthResponse> => {
  const { data } = await API.post<AuthResponse>("/auth/login", payload);
  return data;
};

export const register = async (payload: RegisterPayload): Promise<UserResponse> => {
  const { data } = await API.post<UserResponse>("/auth/register", payload);
  return data;
};

export const getProfile = async (): Promise<User> => {
  const { data } = await API.get<UserResponse>("/auth/me");
  return data.data;
};
