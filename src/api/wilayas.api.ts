import api from "./axios";
import type { Wilaya } from "../@types/wilaya";

export const getWilayas = async (): Promise<Wilaya[]> => {
  const res = await api.get("/admin/wilaya");

  return res.data.wilayas ?? res.data.data ?? res.data ?? [];
};

export const createWilaya = async (data: { name: string }) => {
  return api.post("/admin/wilaya", data);
};

export const updateWilaya = async (id: number, data: { name: string }) => {
  return api.put(`/admin/wilaya/${id}`, data);
};

export const deleteWilaya = async (id: number) => {
  return api.delete(`/admin/wilaya/${id}`);
};
