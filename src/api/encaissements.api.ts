import api from "./axios";
import type { Encaissement } from "../@types/encaissement";

export const getEncaissements = async (): Promise<Encaissement[]> => {
  const res = await api.get("/encaissement");
  return res.data.encaissements;
};

export const createEncaissement = async (data: Partial<Encaissement>): Promise<Encaissement> => {
  const res = await api.post("/encaissement", data);
  return res.data.encaissement;
};

export const updateEncaissement = async (id: number, data: Partial<Encaissement>): Promise<Encaissement> => {
  const res = await api.put(`/encaissement/${id}`, data);
  return res.data.encaissement;
};

export const deleteEncaissement = async (id: number) => {
  return api.delete(`/encaissement/${id}`);
};
