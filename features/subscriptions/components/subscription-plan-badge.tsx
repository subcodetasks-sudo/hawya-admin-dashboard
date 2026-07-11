import { Badge } from "@/components/ui/badge";

type Props = {
  plan: string;
};

// Plans are admin-defined and returned as free-form names by the backend
// (`/admin/plans`), so there is no fixed set of keys to color-code by.
export default function SubscriptionPlanBadge({ plan }: Props) {
  return (
    <Badge className="border-transparent bg-secondary text-secondary-foreground">{plan}</Badge>
  );
}
