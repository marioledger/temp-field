
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Calendar, ArrowUpDown } from "lucide-react";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { InvoiceStatus } from "@/data/mockData";

interface InvoiceFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: string | null;
  setStatusFilter: (value: string | null) => void;
  dateRange?: { from: Date | undefined; to: Date | undefined };
  setDateRange?: (range: { from: Date | undefined; to: Date | undefined }) => void;
  sortOption?: string;
  setSortOption?: (option: string) => void;
}

const InvoiceFilters: React.FC<InvoiceFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  dateRange,
  setDateRange,
  sortOption,
  setSortOption,
}) => {
  const statusOptions: InvoiceStatus[] = ["draft", "sent", "paid", "overdue", "cancelled"];
  
  const sortOptions = [
    { value: "date-desc", label: "Date (Newest First)" },
    { value: "date-asc", label: "Date (Oldest First)" },
    { value: "amount-desc", label: "Amount (High to Low)" },
    { value: "amount-asc", label: "Amount (Low to High)" },
    { value: "client", label: "Client Name" },
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search invoices..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" /> 
            {statusFilter ? `Status: ${statusFilter}` : "Filter by Status"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setStatusFilter(null)}>
            All Statuses
          </DropdownMenuItem>
          {statusOptions.map((status) => (
            <DropdownMenuItem 
              key={status} 
              onClick={() => setStatusFilter(status)}
              className="capitalize"
            >
              {status}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      
      {setDateRange && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" /> 
              Date Range
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="p-2 min-w-[300px]">
            <DatePickerWithRange
              date={dateRange}
              setDate={setDateRange}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      
      {setSortOption && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <ArrowUpDown className="mr-2 h-4 w-4" /> 
              {sortOptions.find(opt => opt.value === sortOption)?.label || "Sort"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {sortOptions.map((option) => (
              <DropdownMenuItem 
                key={option.value} 
                onClick={() => setSortOption(option.value)}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default InvoiceFilters;
