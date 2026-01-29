import { Badge } from "@/components/ui/badge";
import { stageStatusLabels } from "@/lib/orders";
import type { StageStatus } from "@prisma/client";

const variantByStatus: Record<StageStatus, "success" | "warning" | "pending"> = {
  done: "success",
  in_progress: "warning",
  pending: "pending",
};

export function StatusBadge({ status }: { status: StageStatus }) {
  return (
    <Badge variant={variantByStatus[status]}>
      {stageStatusLabels[status]}
    </Badge>
  );
}
