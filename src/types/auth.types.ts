export interface RegisterRequestBody {
  name: string;
  email: string;
  password: string;
  role: "admin" | "user";
}
export interface LoginRequestBody {
  email: string;
  password: string;
}
