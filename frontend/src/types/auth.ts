

export type LoginCredentials = {
  username: string;
  password: string;
};

export type AuthUser = {
  id: string;
  so_dien_thoai: string;
  ten_thanh: string;
  ho_ten: string | null;
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
