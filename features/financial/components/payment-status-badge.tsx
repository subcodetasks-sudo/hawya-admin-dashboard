import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import type { PaymentStatus } from "@/features/financial/types";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<PaymentStatus, string> = {
  paid: "border-transparent bg-success/10 text-success",
  pending: "border-transparent bg-amber-500/10 text-amber-600 dark:text-amber-400",
  failed: "border-transparent bg-destructive/10 text-destructive",
  refunded: "border-transparent bg-violet-500/10 text-violet-600 dark:text-violet-400",
};

type Props = {
  status: PaymentStatus;
};

export default function PaymentStatusBadge({ status }: Props) {
  const t = useTranslations("Financial");

  return <Badge className={cn(STATUS_STYLES[status])}>{t(`payments.status.${status}`)}</Badge>;
}
