

export type LoginCredentials = {
  username: string;
  password: string;
};

export type AuthUser = {
  id: string;
  soDienThoai: string;
  tenThanh: string;
  hoTen: string | null;
  roles: string[];
  assignedClasses: string[];
};

export type LoginResponse = {
  user: AuthUser;
  canAccessDashboard: boolean;
};

export type CurrentUserResponse = {
  user: AuthUser;
};
