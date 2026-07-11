import { Badge } from "@/components/ui/badge";

type Props = {
  planName: string;
};

export default function TestimonialPlanBadge({ planName }: Props) {
  return (
    <Badge className="border-transparent bg-secondary text-secondary-foreground">
      {planName}
    </Badge>
  );
}
