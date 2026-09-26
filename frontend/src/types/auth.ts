

export type LoginCredentials = {
  username: string;
  password: string;
};

export type AuthUser = {
  id: string;
  username: string;
  fullName: string;
  role: string;
};

export type LoginResponse = {
  user: AuthUser;
};