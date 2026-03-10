import api from "./axios";
import type { Caisse } from "../@types/caisse";

export const getCaisses = async (): Promise<Caisse[]> => {
  const res = await api.get("/admin/caisses");
  return res.data.data;
};

export const getMyCaisse = async (): Promise<Caisse> => {
  const res = await api.get("/caisse");
  return res.data.data;
};