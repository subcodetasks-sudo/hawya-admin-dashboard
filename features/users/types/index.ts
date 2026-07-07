export type UserPlanKey = "starter" | "pro" | "business" | "enterprise";

export type UserStatus = "active" | "suspended" | "blocked";

export type UserStatusFilter = "all" | UserStatus;

export type UserPlanFilter = "all" | UserPlanKey;

export type User = {
  id: string;
  name: string;
  email: string;
  initials: string;
  planKey: UserPlanKey;
  status: UserStatus;
  apiUsage: number;
  signupDate: string;
  lastLoginAt: string;
  adminNotes: string;
};

export type UserInput = {
  name: string;
  email: string;
  planKey: UserPlanKey;
  status: UserStatus;
};

export type InviteUserInput = {
  name: string;
  email: string;
  planKey: UserPlanKey;
};
