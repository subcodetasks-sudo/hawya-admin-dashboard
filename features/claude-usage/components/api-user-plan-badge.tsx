import { Badge } from "@/components/ui/badge";

type Props = {
  plan: string;
};

export default function ApiUserPlanBadge({ plan }: Props) {
  return (
    <Badge className="border-transparent bg-secondary text-secondary-foreground">
      {plan}
    </Badge>
  );
}
