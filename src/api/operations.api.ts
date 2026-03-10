import api from "./axios";
import type { Encaissement } from "../@types/encaissement.ts";
import type { Decaissement } from "../@types/decaissement";

export const getEncaissements = async (): Promise<Encaissement[]> => {
  const res = await api.get("/admin/encaissement");
  return res.data.encaissements;
};

export const getDecaissements = async (): Promise<Decaissement[]> => {
  const res = await api.get("/admin/decaissement");
  return res.data.decaissements;
};
