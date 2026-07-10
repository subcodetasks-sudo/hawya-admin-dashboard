export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginData {
  access_token: string;
  token_type: string;
  admin_id: string;
  email: string;
  role: string;
}

interface LoginSuccessResponse {
  success: true;
  data: LoginData;
}

interface LoginErrorResponse {
  status: false;
  message: string;
  data: null;
  errors?: {
    error?: string;
  };
}

export class LoginError extends Error {
  code?: string;

  constructor(message: string, code?: string) {
    super(message);
    this.name = "LoginError";
    this.code = code;
  }
}

export async function loginAdmin(payload: LoginRequest): Promise<LoginData> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/admin/auth/login`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    const errorJson: LoginErrorResponse = await response.json();
    throw new LoginError(
      errorJson.message || "Login failed",
      errorJson.errors?.error,
    );
  }

  const json: LoginSuccessResponse = await response.json();
  return json.data;
}
