import api from "./axios"; 
import type { Alimentation } from "../@types/alimentation.ts";

export const getAlimentations = async (): Promise<Alimentation[]> => {
  const res = await api.get("/admin/alimentation");
  return res.data.alimentations;
};

export const createAlimentation = async (payload: { caisse_id: number; montant: number }) => {
  const res = await api.post("/admin/alimentation", payload);
  return res.data.alimentation;
};

export const updateAlimentation = async (
  id: number,
  payload: { caisse_id?: number; montant?: number }
) => {
  const res = await api.put(`/admin/alimentation/${id}`, payload);
  return res.data.alimentation;
};
