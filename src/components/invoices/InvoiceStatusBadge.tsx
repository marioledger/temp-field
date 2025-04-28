
import React from "react";
import { Badge } from "@/components/ui/badge";
import { InvoiceStatus } from "@/data/mockData";

interface InvoiceStatusBadgeProps {
  status: InvoiceStatus;
  className?: string;
}

const InvoiceStatusBadge: React.FC<InvoiceStatusBadgeProps> = ({ status, className }) => {
  // Define variants for different statuses
  const variants = {
    draft: "bg-gray-200 text-gray-800 hover:bg-gray-200",
    sent: "bg-blue-100 text-blue-800 hover:bg-blue-100",
    paid: "bg-green-100 text-green-800 hover:bg-green-100",
    overdue: "bg-red-100 text-red-800 hover:bg-red-100",
    cancelled: "bg-gray-100 text-gray-800 hover:bg-gray-100",
  };
  
  return (
    <Badge 
      variant="outline" 
      className={`${variants[status]} ${className || ""}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

export default InvoiceStatusBadge;
