
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, RefreshCcw, Calendar, Users } from "lucide-react";

interface BillingScheduleFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  frequencyFilter: string | null;
  setFrequencyFilter: (value: string | null) => void;
  statusFilter?: string | null;
  setStatusFilter?: (value: string | null) => void;
}

const BillingScheduleFilters: React.FC<BillingScheduleFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  frequencyFilter,
  setFrequencyFilter,
  statusFilter,
  setStatusFilter,
}) => {
  const frequencyOptions = [
    "one-time",
    "weekly",
    "bi-weekly",
    "monthly",
    "quarterly",
    "yearly"
  ];
  
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search schedules..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <RefreshCcw className="mr-2 h-4 w-4" /> 
            {frequencyFilter 
              ? `Frequency: ${frequencyFilter.charAt(0).toUpperCase() + frequencyFilter.slice(1)}` 
              : "Filter by Frequency"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setFrequencyFilter(null)}>
            All Frequencies
          </DropdownMenuItem>
          {frequencyOptions.map((frequency) => (
            <DropdownMenuItem 
              key={frequency} 
              onClick={() => setFrequencyFilter(frequency)}
              className="capitalize"
            >
              {frequency.replace('-', ' ')}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      
      {setStatusFilter && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" /> 
              {statusFilter === "active" 
                ? "Active Only" 
                : statusFilter === "inactive" 
                  ? "Inactive Only" 
                  : "All Statuses"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setStatusFilter(null)}>
              All Statuses
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("active")}>
              Active Only
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("inactive")}>
              Inactive Only
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default BillingScheduleFilters;
