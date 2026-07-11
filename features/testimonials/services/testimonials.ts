import { queryOptions } from "@tanstack/react-query";

import { testimonialKeys } from "@/features/testimonials/query-keys";
import type {
  Testimonial,
  TestimonialCounts,
  TestimonialListParams,
  TestimonialsListResult,
  TestimonialStats,
  TestimonialStatus,
} from "@/features/testimonials/types";
import { apiDelete, apiGet, apiPatch } from "@/lib/api-client";

type TestimonialResponse = {
  id: string;
  display_name: string;
  is_anonymous: boolean;
  rating: number;
  text: string;
  plan_name: string;
  status: TestimonialStatus;
  created_at: string;
};

type TestimonialsListResponse = {
  reviews: TestimonialResponse[];
  stats: TestimonialStats;
  counts: TestimonialCounts;
};

function mapTestimonial(data: TestimonialResponse): Testimonial {
  return {
    id: data.id,
    displayName: data.display_name,
    isAnonymous: data.is_anonymous,
    rating: data.rating,
    text: data.text,
    planName: data.plan_name,
    status: data.status,
    createdAt: data.created_at,
  };
}

const EMPTY_STATS: TestimonialStats = { average: 0, total: 0, histogram: {} };
const EMPTY_COUNTS: TestimonialCounts = { pending: 0, approved: 0, rejected: 0, all: 0 };

export async function fetchTestimonials(
  params: TestimonialListParams = {},
): Promise<TestimonialsListResult> {
  const query = new URLSearchParams();
  if (params.status && params.status !== "all") {
    query.set("status", params.status);
  }
  if (params.search) {
    query.set("search", params.search);
  }
  const qs = query.toString();

  const data = await apiGet<TestimonialsListResponse>(`/admin/reviews${qs ? `?${qs}` : ""}`);

  return {
    reviews: (data.reviews ?? []).map(mapTestimonial),
    stats: data.stats ?? EMPTY_STATS,
    counts: data.counts ?? EMPTY_COUNTS,
  };
}

export function testimonialsListQueryOptions(params: TestimonialListParams = {}) {
  return queryOptions({
    queryKey: testimonialKeys.list({ status: params.status ?? "all", search: params.search ?? "" }),
    queryFn: () => fetchTestimonials(params),
  });
}

export async function approveTestimonial(id: string): Promise<Testimonial> {
  const data = await apiPatch<TestimonialResponse>(`/admin/reviews/${id}/approve`);
  return mapTestimonial(data);
}

export async function rejectTestimonial(id: string): Promise<{ id: string; status: TestimonialStatus }> {
  return apiPatch<{ id: string; status: TestimonialStatus }>(`/admin/reviews/${id}/reject`);
}

export async function deleteTestimonial(id: string): Promise<{ id: string; deleted: boolean }> {
  return apiDelete<{ id: string; deleted: boolean }>(`/admin/reviews/${id}`);
}

// POST /reviews (public review submission) is not called from this admin
// surface, which only moderates reviews already submitted from the site.
