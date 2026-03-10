import api from "./axios";
import type { Role } from "../@types/role";

export const getRoles = async (): Promise<Role[]> => {
  const res = await api.get("/admin/role");
  return res.data.data ?? [];
};

export const createRole = async (data: Partial<Role>) => {
  return api.post("/admin/role", data);
};

export const updateRole = async (id: number, data: Partial<Role>) => {
  return api.put(`/admin/role/${id}`, data);
};

export const deleteRole = async (id: number) => {
  return api.delete(`/admin/role/${id}`);
};

export const getPermissions = async (): Promise<string[]> => {
  const res = await api.get("/admin/permissions");
  return res.data.data.map((p: any) => p.name);
};
