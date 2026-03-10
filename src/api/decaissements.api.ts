import api from "./axios";
import type { Decaissement } from "../@types/decaissement";

export const getDecaissements = async (): Promise<Decaissement[]> => {
  const res = await api.get("/decaissement");
  return res.data.decaissements;
};

export const createDecaissement = async (data: FormData) => {
  return api.post("/decaissement", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const updateDecaissement = async (id: number, data: FormData) => {
  return api.post(`/decaissement/${id}?_method=PUT`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deleteDecaissement = async (id: number) => {
  return api.delete(`/decaissement/${id}`);
};
