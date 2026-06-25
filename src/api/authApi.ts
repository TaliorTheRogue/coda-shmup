import { apiFetch } from "./apiClient";

type RegisterRequest = {
  username: string;
  password: string;
};

type LoginRequest = {
  username: string;
  password: string;
};

type AuthResponse = {
  token: string;
  user: {
    id: string;
    username: string;
  };
};

export async function register(
  data: RegisterRequest
) {
  return apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function login(
  data: LoginRequest
): Promise<AuthResponse> {
  return apiFetch<AuthResponse>(
    "/auth/login",
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}