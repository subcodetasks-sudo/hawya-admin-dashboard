import { queryOptions } from "@tanstack/react-query";

import { userKeys } from "@/features/users/query-keys";
import type {
  InviteUserInput,
  User,
  UserInput,
  UserPlanKey,
  UserStatus,
} from "@/features/users/types";

const MOCK_LATENCY_MS = 350;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), MOCK_LATENCY_MS);
  });
}

function minutesAgo(minutes: number) {
  return new Date(Date.now() - minutes * 60_000).toISOString();
}

function initialsFrom(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

let mockUsers: User[] = [
  {
    id: "user_sarah_chen",
    name: "Sarah Chen",
    email: "sarah.chen@techcorp.io",
    initials: "SC",
    planKey: "pro",
    status: "active",
    apiUsage: 87_432,
    signupDate: new Date(2024, 0, 15).toISOString(),
    lastLoginAt: minutesAgo(120),
    adminNotes: "",
  },
  {
    id: "user_marcus_williams",
    name: "Marcus Williams",
    email: "m.williams@startup.co",
    initials: "MW",
    planKey: "business",
    status: "active",
    apiUsage: 234_891,
    signupDate: new Date(2024, 1, 3).toISOString(),
    lastLoginAt: minutesAgo(5),
    adminNotes: "",
  },
  {
    id: "user_elena_rodriguez",
    name: "Elena Rodriguez",
    email: "elena@designstudio.es",
    initials: "ER",
    planKey: "starter",
    status: "active",
    apiUsage: 9_821,
    signupDate: new Date(2024, 2, 22).toISOString(),
    lastLoginAt: minutesAgo(60 * 24),
    adminNotes: "",
  },
  {
    id: "user_james_kim",
    name: "James Kim",
    email: "james.kim@aiventures.com",
    initials: "JK",
    planKey: "enterprise",
    status: "active",
    apiUsage: 891_243,
    signupDate: new Date(2024, 0, 30).toISOString(),
    lastLoginAt: minutesAgo(180),
    adminNotes: "",
  },
  {
    id: "user_priya_patel",
    name: "Priya Patel",
    email: "priya@dataflow.in",
    initials: "PP",
    planKey: "pro",
    status: "suspended",
    apiUsage: 45_672,
    signupDate: new Date(2024, 3, 10).toISOString(),
    lastLoginAt: minutesAgo(60 * 24 * 3),
    adminNotes: "",
  },
  {
    id: "user_thomas_muller",
    name: "Thomas Muller",
    email: "t.muller@enterprise.de",
    initials: "TM",
    planKey: "business",
    status: "active",
    apiUsage: 156_789,
    signupDate: new Date(2024, 1, 18).toISOString(),
    lastLoginAt: minutesAgo(60),
    adminNotes: "",
  },
  {
    id: "user_aisha_okonkwo",
    name: "Aisha Okonkwo",
    email: "aisha@creative.ng",
    initials: "AO",
    planKey: "starter",
    status: "active",
    apiUsage: 3_421,
    signupDate: new Date(2024, 4, 5).toISOString(),
    lastLoginAt: minutesAgo(60 * 24 * 2),
    adminNotes: "",
  },
  {
    id: "user_li_wei",
    name: "Li Wei",
    email: "li.wei@cloudtech.cn",
    initials: "LW",
    planKey: "pro",
    status: "active",
    apiUsage: 67_234,
    signupDate: new Date(2024, 2, 8).toISOString(),
    lastLoginAt: minutesAgo(240),
    adminNotes: "",
  },
];

function findUserOrThrow(id: string): User {
  const user = mockUsers.find((candidate) => candidate.id === id);

  if (!user) {
    throw new Error(`User not found: ${id}`);
  }

  return user;
}

async function setUserStatus(id: string, status: UserStatus): Promise<User> {
  mockUsers = mockUsers.map((user) => (user.id === id ? { ...user, status } : user));
  return delay(findUserOrThrow(id));
}

export async function fetchUsers(): Promise<User[]> {
  return delay([...mockUsers]);
}

export const usersListQueryOptions = queryOptions({
  queryKey: userKeys.lists(),
  queryFn: fetchUsers,
});

export async function inviteUser(input: InviteUserInput): Promise<User> {
  const user: User = {
    id: `user_${Date.now()}`,
    name: input.name,
    email: input.email,
    initials: initialsFrom(input.name),
    planKey: input.planKey,
    status: "active",
    apiUsage: 0,
    signupDate: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
    adminNotes: "",
  };
  mockUsers = [user, ...mockUsers];
  return delay(user);
}

export async function updateUser(id: string, input: UserInput): Promise<User> {
  mockUsers = mockUsers.map((user) =>
    user.id === id ? { ...user, ...input, initials: initialsFrom(input.name) } : user,
  );
  return delay(findUserOrThrow(id));
}

export async function suspendUser(id: string): Promise<User> {
  return setUserStatus(id, "suspended");
}

export async function reactivateUser(id: string): Promise<User> {
  return setUserStatus(id, "active");
}

export async function blockUser(id: string): Promise<User> {
  return setUserStatus(id, "blocked");
}

export async function resetUserPassword(id: string): Promise<void> {
  findUserOrThrow(id);
  return delay(undefined);
}

export async function assignUserPlan(id: string, planKey: UserPlanKey): Promise<User> {
  mockUsers = mockUsers.map((user) => (user.id === id ? { ...user, planKey } : user));
  return delay(findUserOrThrow(id));
}

export async function saveUserAdminNote(id: string, adminNotes: string): Promise<User> {
  mockUsers = mockUsers.map((user) => (user.id === id ? { ...user, adminNotes } : user));
  return delay(findUserOrThrow(id));
}
