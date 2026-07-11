import type { TestimonialListParams } from "@/features/testimonials/types";

export const testimonialKeys = {
  all: ["testimonials"] as const,
  lists: () => [...testimonialKeys.all, "list"] as const,
  list: (params: TestimonialListParams) => [...testimonialKeys.lists(), params] as const,
};
