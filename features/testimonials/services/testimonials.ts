import { queryOptions } from "@tanstack/react-query";

import { testimonialKeys } from "@/features/testimonials/query-keys";
import type { Testimonial } from "@/features/testimonials/types";

const MOCK_LATENCY_MS = 350;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), MOCK_LATENCY_MS);
  });
}

const mockTestimonials: Testimonial[] = [
  {
    id: "test_marcus_williams",
    customerName: "ماركوس ويليامز",
    customerInitials: "MW",
    planKey: "business",
    rating: 3,
    comment:
      "منتج ممتاز يقدم كل ما نحتاجه بالضبط، لكن بعض تفاصيل لوحة الاستخدام تحتاج مزيدًا من الوضوح.",
    status: "pending",
    createdAt: new Date(2024, 11, 25).toISOString(),
  },
  {
    id: "test_sarah_chen",
    customerName: "سارة تشن",
    customerInitials: "SC",
    planKey: "pro",
    rating: 4,
    comment:
      "منصة رائعة، تكامل سلس مع Claude API والواجهة توفر كل ما نحتاجه لمراقبة الاستخدام بسهولة.",
    status: "approved",
    createdAt: new Date(2024, 11, 28).toISOString(),
  },
  {
    id: "test_james_kim",
    customerName: "جيمس كيم",
    customerInitials: "JK",
    planKey: "enterprise",
    rating: 5,
    comment:
      "دعم Enterprise استثنائي، سرعة الاستجابة وموثوقية الفريق على مدار الساعة تجعل قيمة الاشتراك مضاعفة.",
    status: "approved",
    createdAt: new Date(2024, 11, 22).toISOString(),
  },
  {
    id: "test_elena_rodriguez",
    customerName: "إيلينا رودريغز",
    customerInitials: "ER",
    planKey: "starter",
    rating: 3,
    comment:
      "جيدة لبدء استكشاف Claude، لكن سقف الاستخدام في خطة Starter ضيق جدًا بالنسبة لفريق صغير مثل فريقنا.",
    status: "pending",
    createdAt: new Date(2024, 11, 19).toISOString(),
  },
  {
    id: "test_thomas_muller",
    customerName: "توماس مولر",
    customerInitials: "TM",
    planKey: "business",
    rating: 5,
    comment:
      "نحن راضون جدًا عن الخدمة، خطة Business تمنحنا قيمة ممتازة مقابل السعر بعد 12 شهرًا من الاستخدام المستمر.",
    status: "approved",
    createdAt: new Date(2024, 11, 17).toISOString(),
  },
  {
    id: "test_anonymous_1",
    customerName: "مجهول",
    customerInitials: "؟",
    planKey: "starter",
    rating: 4,
    comment:
      "واجهنا بعض المشاكل بسبب استخدام حساب مشترك بين عدة أشخاص، ما أدى إلى تعليق الحساب مؤقتًا.",
    status: "rejected",
    createdAt: new Date(2024, 11, 14).toISOString(),
  },
];

export async function fetchTestimonials(): Promise<Testimonial[]> {
  return delay([...mockTestimonials]);
}

export const testimonialsListQueryOptions = queryOptions({
  queryKey: testimonialKeys.lists(),
  queryFn: fetchTestimonials,
});
