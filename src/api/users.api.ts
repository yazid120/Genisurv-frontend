import api from "./axios";
import type { User } from "../@types/user";

export const getUsers = async (): Promise<User[]> => {
  const res = await api.get("/admin/users");
  return res.data.users;
};

export const createUser = async (data: Partial<User>) => {
  return api.post("/admin/users", data);
};

export const updateUser = async (id: number, data: Partial<User>) => {
  return api.put(`/admin/users/${id}`, data);
};

export const deleteUser = async (id: number) => {
  return api.delete(`/admin/users/${id}`);
};
