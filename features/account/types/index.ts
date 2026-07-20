export type AdminRole = "super_admin" | "admin" | "support";

export type AdminMe = {
  id: string;
  email: string;
  display_name: string;
  role: AdminRole;
  is_active: boolean;
  created_at: string;
  last_login_at: string | null;
};

export type ChangePasswordInput = {
  current_password: string;
  new_password: string;
};

export type ChangeEmailInput = {
  new_email: string;
  current_password: string;
};

export type ChangeEmailResult = {
  id: string;
  email: string;
  display_name: string;
  role: AdminRole;
  access_token: string;
  token_type: "bearer";
};
