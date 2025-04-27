
import React from "react";
import { cn } from "@/lib/utils";
import { TaskStatus } from "@/data/mockData";

interface StatusBadgeProps {
  status: TaskStatus;
  className?: string;
}

const statusConfig = {
  planned: {
    label: "Planned",
    className: "status-planned"
  },
  progress: {
    label: "In Progress",
    className: "status-progress"
  },
  completed: {
    label: "Completed",
    className: "status-completed"
  },
  cancelled: {
    label: "Cancelled",
    className: "status-cancelled"
  }
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const config = statusConfig[status];
  
  return (
    <span className={cn(
      "px-2 py-1 text-xs font-medium rounded-full",
      config.className,
      className
    )}>
      {config.label}
    </span>
  );
};
