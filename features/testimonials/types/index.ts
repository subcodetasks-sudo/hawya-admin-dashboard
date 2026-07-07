export type TestimonialPlanKey = "starter" | "pro" | "business" | "enterprise";

export type TestimonialStatus = "pending" | "approved" | "rejected";

export type TestimonialStatusFilter = "all" | TestimonialStatus;

export type Testimonial = {
  id: string;
  customerName: string;
  customerInitials: string;
  planKey: TestimonialPlanKey;
  rating: number;
  comment: string;
  status: TestimonialStatus;
  createdAt: string;
};
