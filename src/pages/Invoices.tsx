
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Invoice, invoices, getInvoicesByStatus, getPaidTotal, getOutstandingTotal } from "@/data/mockData";
import { DateRange } from "react-day-picker";
import { useNavigate } from "react-router-dom";
import { format, parseISO, isWithinInterval } from "date-fns";

// Custom components
import InvoiceFilters from "@/components/invoices/InvoiceFilters";
import InvoiceSummaryCards from "@/components/invoices/InvoiceSummaryCards";
import InvoiceTable from "@/components/invoices/InvoiceTable";
import BatchActionsMenu from "@/components/invoices/BatchActionsMenu";
import GenerateBillingDialog from "@/components/billing/GenerateBillingDialog";

const Invoices: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>(invoices);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [sortOption, setSortOption] = useState<string>("date-desc");
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Format currency helper
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'BAM',
      minimumFractionDigits: 2,
    }).format(amount);
  };
  
  // Handler for bulk export
  const handleExportCSV = () => {
    toast({
      title: "Exporting data",
      description: "Your invoice data is being exported as CSV.",
    });
  };

  // Filter and sort invoices based on criteria
  useEffect(() => {
    let results = invoices;
    
    // Apply status filter if selected
    if (statusFilter) {
      results = results.filter(invoice => invoice.status === statusFilter);
    }
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(invoice => 
        invoice.clientName.toLowerCase().includes(term) ||
        invoice.invoiceNumber.toLowerCase().includes(term)
      );
    }
    
    // Apply date range filter - fixed the type issue by checking both from and to values
    if (dateRange?.from) {
      results = results.filter(invoice => {
        const invoiceDate = parseISO(invoice.issueDate);
        if (dateRange.to) {
          return isWithinInterval(invoiceDate, { start: dateRange.from, end: dateRange.to });
        }
        return format(invoiceDate, 'yyyy-MM-dd') === format(dateRange.from, 'yyyy-MM-dd');
      });
    }
    
    // Apply sorting
    results = [...results].sort((a, b) => {
      switch (sortOption) {
        case "date-asc":
          return new Date(a.issueDate).getTime() - new Date(b.issueDate).getTime();
        case "date-desc":
          return new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime();
        case "amount-asc":
          return a.total - b.total;
        case "amount-desc":
          return b.total - a.total;
        case "client":
          return a.clientName.localeCompare(b.clientName);
        default:
          return new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime();
      }
    });
    
    setFilteredInvoices(results);
    
    // Clear selection when filters change
    setSelectedInvoices([]);
  }, [searchTerm, statusFilter, dateRange, sortOption]);
  
  // Calculate financial totals
  const totalInvoiced = invoices.reduce((sum, invoice) => sum + invoice.total, 0);
  const totalPaid = getPaidTotal();
  const totalOutstanding = getOutstandingTotal();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
          <p className="text-muted-foreground">
            Manage invoices and view payment status
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleExportCSV}>
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
          <GenerateBillingDialog />
        </div>
      </div>
      
      {/* Summary Cards */}
      <InvoiceSummaryCards 
        totalInvoiced={totalInvoiced}
        totalPaid={totalPaid}
        totalOverdue={totalOutstanding}
        formatCurrency={formatCurrency}
      />
      
      {/* Advanced Filters */}
      <div className="flex flex-col gap-4">
        <InvoiceFilters 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          dateRange={dateRange}
          setDateRange={setDateRange}
          sortOption={sortOption}
          setSortOption={setSortOption}
        />
        
        {selectedInvoices.length > 0 && (
          <div className="flex items-center justify-between bg-primary/5 p-2 rounded-md">
            <span className="text-sm font-medium ml-2">
              {selectedInvoices.length} {selectedInvoices.length === 1 ? 'invoice' : 'invoices'} selected
            </span>
            <BatchActionsMenu 
              selectedIds={selectedInvoices} 
              onClearSelection={() => setSelectedInvoices([])}
            />
          </div>
        )}
      </div>
      
      {/* Invoices Table */}
      <Card>
        <CardContent className="p-0">
          <InvoiceTable 
            invoices={filteredInvoices} 
            formatCurrency={formatCurrency}
            selectedIds={selectedInvoices}
            setSelectedIds={setSelectedInvoices}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Invoices;
