type Permission = {
  action: string; // POST, GET, PUT, DELETE, PATCH
  resource: string;
  type: 'permission' | (string & {});
  id?: number | string;
  created_at?: string;
  updated_at?: string;
  name?: string; // local state
  key?: string; // local state
};

type Role = {
  created_at: string;
  description?: string;
  id: number;
  name: string;
  permissions: Permission[];
  updated_at: string;
  updated_by: string;
};

type RoleRequest = {
  name: string; // required, minLength: 3, maxLength: 255
  description?: string;
  permissions?: Permission[];
};

type AssignRoleToUserRequest = {
  role_ids: number[]; // required
  user_email: string; // required
  reason?: string; // maxLength: 255
};

type UserRole = {
  id: number;
  user_id: string;
  role_id: number;
  role: Role;
  action: number;
  updated_by: string;
  updated_at: string;
  created_at: string;
  created_by: string;
};

type UserResponse = {
  email: string;
  name: string;
  roles: Role[];
};

type ChangeAction = 0 | 1; // 0 = ActionAssign, 1 = ActionUnassign

type Change = {
  action: ChangeAction;
  created_at: string;
  id: number;
  reason: string;
  role: Role;
  updated_at: string;
  updated_by: string;
  user_id: string;
};

// endpoint: /changes/{userEmail}
// Retrieve all roles assigned to a specific user by user email
type GetUserRoleChangesResponse = Change[];

export type {
  Permission,
  Role,
  RoleRequest,
  AssignRoleToUserRequest,
  UserRole,
  UserResponse,
  ChangeAction,
  Change,
  GetUserRoleChangesResponse,
};
