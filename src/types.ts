export interface User {
  id: number;
  name: string;
  email: string;
  registration_time: string;
  last_login_time: string | null;
  status: "active" | "blocked" | "unverified";
}

export interface ApiResponse {
  message: string;
  token?: string;
}
