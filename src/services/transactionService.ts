import API from "./api";
import type {
  CreateTransactionPayload,
  Transaction,
  TransactionListResponse,
  TransactionDetailResponse,
} from "../types/transaction";

export const getTransactions = async (
  params?: Record<string, unknown>,
): Promise<TransactionListResponse> => {
  const { data } = await API.get<TransactionListResponse>("/transactions", {
    params,
  });
  return data;
};

export const getTransactionById = async (
  id: string,
): Promise<Transaction> => {
  const { data } = await API.get<TransactionDetailResponse>(`/transactions/${id}`);
  return data.data;
};

export const createTransaction = async (
  payload: CreateTransactionPayload,
): Promise<any> => {
  const { data } = await API.post<any>("/transactions", payload);
  return data;
};
