export type TestimonialStatus = "pending" | "approved" | "rejected";

export type TestimonialStatusFilter = "all" | TestimonialStatus;

export type Testimonial = {
  id: string;
  displayName: string;
  isAnonymous: boolean;
  rating: number;
  text: string;
  planName: string;
  status: TestimonialStatus;
  createdAt: string;
};

export type TestimonialHistogram = Record<string, number>;

export type TestimonialStats = {
  average: number;
  total: number;
  histogram: TestimonialHistogram;
};

export type TestimonialCounts = {
  pending: number;
  approved: number;
  rejected: number;
  all: number;
};

export type TestimonialsListResult = {
  reviews: Testimonial[];
  stats: TestimonialStats;
  counts: TestimonialCounts;
};

export type TestimonialListParams = {
  status?: TestimonialStatusFilter;
  search?: string;
};
