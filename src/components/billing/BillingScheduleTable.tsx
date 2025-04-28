
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, MoreHorizontal, Receipt } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { BillingSchedule } from "@/data/mockData";

interface BillingScheduleTableProps {
  schedules: BillingSchedule[];
  formatCurrency: (amount: number) => string;
  formatFrequency: (frequency: string) => string;
}

const BillingScheduleTable: React.FC<BillingScheduleTableProps> = ({
  schedules,
  formatCurrency,
  formatFrequency
}) => {
  const { toast } = useToast();
  
  const handleToggleActive = (schedule: BillingSchedule) => {
    toast({
      title: schedule.active ? "Schedule deactivated" : "Schedule activated",
      description: `${schedule.serviceName} for ${schedule.clientName} has been ${schedule.active ? "deactivated" : "activated"}.`,
    });
  };
  
  const handleGenerateInvoice = (schedule: BillingSchedule) => {
    toast({
      title: "Invoice generated",
      description: `New invoice created for ${schedule.serviceName} - ${schedule.clientName}.`,
    });
  };
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Service</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>Field</TableHead>
          <TableHead>Frequency</TableHead>
          <TableHead>Next Billing</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead className="w-[80px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {schedules.length > 0 ? (
          schedules.map((schedule) => (
            <TableRow key={schedule.id}>
              <TableCell className="font-medium">{schedule.serviceName}</TableCell>
              <TableCell>{schedule.clientName}</TableCell>
              <TableCell>{schedule.fieldName}</TableCell>
              <TableCell>{formatFrequency(schedule.frequency)}</TableCell>
              <TableCell>{schedule.nextBillingDate}</TableCell>
              <TableCell>
                {schedule.active ? (
                  <Badge variant="outline" className="bg-green-100 text-green-800">
                    <Check className="h-3 w-3 mr-1" /> Active
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-gray-100 text-gray-800">
                    <X className="h-3 w-3 mr-1" /> Inactive
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-right">{formatCurrency(schedule.amount)}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => toast({ description: "Edit functionality coming soon" })}>
                      Edit Schedule
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleGenerateInvoice(schedule)}>
                      Generate Invoice
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleToggleActive(schedule)}>
                      {schedule.active ? "Deactivate" : "Activate"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={8} className="text-center py-10">
              <div className="text-muted-foreground">No billing schedules found</div>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default BillingScheduleTable;
