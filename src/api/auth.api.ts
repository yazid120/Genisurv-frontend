import api from "./axios";
import type {
  LoginPayload,
  RegisterPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  UpdateProfilePayload,
  UpdatePasswordPayload,
} from "../@types/auth";
import type { User } from "../@types/user";

export type { LoginPayload, RegisterPayload };

export const loginApi = (data: LoginPayload) =>
  api.post("/login", data);

export const registerApi = (data: RegisterPayload) =>
  api.post("/register", data);

export const logoutApi = () =>
  api.post("/logout");

export const forgotPassword = (data: ForgotPasswordPayload) =>
  api.post("/forgot-password", data);

export const resetPassword = (data: ResetPasswordPayload) =>
  api.post("/reset-password", data);

export const updateProfile = (data: UpdateProfilePayload) =>
  api.put("/profile", data);

export const updatePassword = (data: UpdatePasswordPayload) =>
  api.put("/password", data);

export const resendEmailVerification = () =>
  api.post("/email/resend");

export const verifyEmail = (token: string) =>
  api.get(`/verify-email/${token}`);

export const meApi = () =>
  api.get<{ user: User }>("/me");