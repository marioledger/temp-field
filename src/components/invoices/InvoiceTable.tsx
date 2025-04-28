
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
import { Checkbox } from "@/components/ui/checkbox";
import { MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Invoice } from "@/data/mockData";
import InvoiceStatusBadge from "@/components/invoices/InvoiceStatusBadge";

interface InvoiceTableProps {
  invoices: Invoice[];
  formatCurrency: (amount: number) => string;
  selectedIds: string[];
  setSelectedIds: (ids: string[]) => void;
}

const InvoiceTable: React.FC<InvoiceTableProps> = ({
  invoices,
  formatCurrency,
  selectedIds,
  setSelectedIds
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const toggleSelectAll = () => {
    if (selectedIds.length === invoices.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(invoices.map(invoice => invoice.id));
    }
  };
  
  const toggleSelectInvoice = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">
            <Checkbox 
              checked={invoices.length > 0 && selectedIds.length === invoices.length}
              onCheckedChange={toggleSelectAll}
              aria-label="Select all"
            />
          </TableHead>
          <TableHead>Invoice #</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>Issue Date</TableHead>
          <TableHead>Due Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead className="w-[80px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.length > 0 ? (
          invoices.map((invoice) => (
            <TableRow 
              key={invoice.id} 
              className={selectedIds.includes(invoice.id) 
                ? "bg-primary/5 hover:bg-primary/10" 
                : "hover:bg-muted/50"
              }
            >
              <TableCell>
                <Checkbox 
                  checked={selectedIds.includes(invoice.id)}
                  onCheckedChange={() => toggleSelectInvoice(invoice.id)}
                  aria-label={`Select invoice ${invoice.invoiceNumber}`}
                  onClick={(e) => e.stopPropagation()}
                />
              </TableCell>
              <TableCell 
                className="font-medium cursor-pointer" 
                onClick={() => navigate(`/invoices/${invoice.id}`)}
              >
                {invoice.invoiceNumber}
              </TableCell>
              <TableCell 
                className="cursor-pointer"
                onClick={() => navigate(`/invoices/${invoice.id}`)}
              >
                {invoice.clientName}
              </TableCell>
              <TableCell 
                className="cursor-pointer"
                onClick={() => navigate(`/invoices/${invoice.id}`)}
              >
                {invoice.issueDate}
              </TableCell>
              <TableCell 
                className="cursor-pointer"
                onClick={() => navigate(`/invoices/${invoice.id}`)}
              >
                {invoice.dueDate}
              </TableCell>
              <TableCell 
                className="cursor-pointer"
                onClick={() => navigate(`/invoices/${invoice.id}`)}
              >
                <InvoiceStatusBadge status={invoice.status} />
              </TableCell>
              <TableCell 
                className="text-right cursor-pointer"
                onClick={() => navigate(`/invoices/${invoice.id}`)}
              >
                {formatCurrency(invoice.total)}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="h-8 w-8 p-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/invoices/${invoice.id}`);
                    }}>
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      toast({
                        title: "Download started",
                        description: `Downloading invoice ${invoice.invoiceNumber}.`,
                      });
                    }}>
                      Download PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      toast({
                        title: "Invoice status updated",
                        description: `Invoice ${invoice.invoiceNumber} marked as paid.`,
                      });
                    }}>
                      Mark as Paid
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={8} className="text-center py-10">
              <div className="text-muted-foreground">No invoices found</div>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default InvoiceTable;
