export type PlanOption = {
  id: string;
  name: string;
  isActive: boolean;
};

export type UserSummary = {
  id: string;
  displayName: string;
  email: string;
  planName: string;
  isActive: boolean;
  isVerified: boolean;
  apiRequests: number;
  createdAt: string;
  lastLoginAt: string | null;
};

export type UsersListParams = {
  page: number;
  perPage: number;
  search?: string;
  planId?: string;
};

export type UsersListResult = {
  users: UserSummary[];
  total: number;
  page: number;
  perPage: number;
};

export type UserUsage = {
  apiRequests: number;
  tokens: number;
  successCount: number;
  failedCount: number;
  limit: number;
  remaining: number;
  usagePercent: number;
};

export type UserSubscription = {
  planName: string;
  billingCycle: string;
  status: string;
  startedAt: string;
  endsAt: string;
  renewsAt: string;
};

export type UserNote = {
  id: string;
  note: string;
  adminId: string;
  createdAt: string;
};

export type UserDetail = UserSummary & {
  language: string;
  totalProjects: number;
  totalPayments: number;
  subscriptionMonths: number;
  usage: UserUsage;
  currentSubscription: UserSubscription | null;
  pastSubscriptions: UserSubscription[];
  notes: UserNote[];
};

export type CreateUserInput = {
  displayName: string;
  email: string;
  planId: string;
  password: string;
  isVerified: boolean;
};

export type BanType = "temporary" | "permanent";

export type BanUserInput = {
  banType: BanType;
  until?: string;
};

export type UserFinancialStatus = {
  userId: string;
  status: string;
  outstandingAmount: number;
  lastPaymentAt: string | null;
};
