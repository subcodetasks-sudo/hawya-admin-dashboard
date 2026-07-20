import { queryOptions } from "@tanstack/react-query";

import { apiGet, apiPatch, apiPost } from "@/lib/api-client";
import { accountKeys } from "@/features/account/query-keys";
import type {
  AdminMe,
  ChangeEmailInput,
  ChangeEmailResult,
  ChangePasswordInput,
} from "@/features/account/types";

export function fetchAdminMe(): Promise<AdminMe> {
  return apiGet<AdminMe>("/admin/me");
}

export function adminMeQueryOptions() {
  return queryOptions({
    queryKey: accountKeys.me(),
    queryFn: fetchAdminMe,
  });
}

export function changeAdminPassword(input: ChangePasswordInput): Promise<void> {
  return apiPost<void>("/admin/me/change-password", input);
}

export function changeAdminEmail(input: ChangeEmailInput): Promise<ChangeEmailResult> {
  return apiPatch<ChangeEmailResult>("/admin/me/email", input);
}
