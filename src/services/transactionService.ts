import API from "./api";
import type {
  CreateTransactionPayload,
  Transaction,
  TransactionListResponse,
} from "../types/transaction";

export const getTransactions = async (
  params: Record<string, unknown>,
): Promise<TransactionListResponse> => {
  const { data } = await API.get<TransactionListResponse>("/transactions", {
    params,
  });
  return data;
};

export const getTransactionById = async (
  id: string | number,
): Promise<Transaction> => {
  const { data } = await API.get<Transaction>(`/transactions/${id}`);
  return data;
};

export const createTransaction = async (
  payload: CreateTransactionPayload,
): Promise<Transaction> => {
  const { data } = await API.post<Transaction>("/transactions", payload);
  return data;
};
