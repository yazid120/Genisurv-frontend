export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  nom: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  email: string;
  token: string;
  password: string;
  password_confirmation: string;
}

export interface UpdateProfilePayload {
  name: string;
  email: string;
  phone?: string;
}

export interface UpdatePasswordPayload {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}
