
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Download, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  BillingSchedule, 
  billingSchedules,
  getUpcomingBillings
} from "@/data/mockData";
import { addDays, format, parseISO } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Custom components
import UpcomingBillingsCard from "@/components/billing/UpcomingBillingsCard";
import BillingScheduleFilters from "@/components/billing/BillingScheduleFilters";
import BillingScheduleTable from "@/components/billing/BillingScheduleTable";
import GenerateBillingDialog from "@/components/billing/GenerateBillingDialog";

const BillingSchedules: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSchedules, setFilteredSchedules] = useState<BillingSchedule[]>(billingSchedules);
  const [activeBillings, setActiveBillings] = useState<BillingSchedule[]>([]);
  const [upcomingBillings, setUpcomingBillings] = useState<BillingSchedule[]>([]);
  const [frequencyFilter, setFrequencyFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Format helpers
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'BAM',
      minimumFractionDigits: 2,
    }).format(amount);
  };
  
  const formatFrequency = (frequency: string) => {
    return frequency.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join('-');
  };
  
  const getDaysUntilNextBilling = (dateString: string) => {
    const today = new Date();
    const billingDate = parseISO(dateString);
    const diffTime = billingDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    return `In ${diffDays} days`;
  };

  // Export to CSV handler
  const handleExportCSV = () => {
    toast({
      title: "Exporting data",
      description: "Your billing schedule data is being exported as CSV.",
    });
  };
  
  useEffect(() => {
    // Filter active schedules
    const active = billingSchedules.filter(schedule => schedule.active);
    setActiveBillings(active);
    
    // Get upcoming billings (next 30 days)
    const upcoming = getUpcomingBillings(30);
    setUpcomingBillings(upcoming);
    
    // Apply search and frequency filters
    let filtered = billingSchedules;
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(schedule => 
        schedule.clientName.toLowerCase().includes(term) ||
        schedule.fieldName.toLowerCase().includes(term) ||
        schedule.serviceName.toLowerCase().includes(term)
      );
    }
    
    if (frequencyFilter) {
      filtered = filtered.filter(schedule => schedule.frequency === frequencyFilter);
    }
    
    if (statusFilter === "active") {
      filtered = filtered.filter(schedule => schedule.active);
    } else if (statusFilter === "inactive") {
      filtered = filtered.filter(schedule => !schedule.active);
    }
    
    setFilteredSchedules(filtered);
  }, [searchTerm, frequencyFilter, statusFilter]);
  
  // Calculate summary values
  const totalMonthlyRevenue = billingSchedules
    .filter(s => s.active && s.frequency === 'monthly')
    .reduce((sum, s) => sum + s.amount, 0);
    
  const totalActiveSchedules = activeBillings.length;
  const totalBillings = billingSchedules.length;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Billing Schedules</h1>
          <p className="text-muted-foreground">
            Manage recurring billing schedules for your services
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleExportCSV}>
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
          <GenerateBillingDialog />
        </div>
      </div>
      
      {/* Summary Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{formatCurrency(totalMonthlyRevenue)}</div>
            <p className="text-muted-foreground text-sm mt-1">Monthly Recurring Revenue</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {totalActiveSchedules} <span className="text-muted-foreground text-base font-normal">of {totalBillings}</span>
            </div>
            <p className="text-muted-foreground text-sm mt-1">Active Billing Schedules</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{upcomingBillings.length}</div>
            <p className="text-muted-foreground text-sm mt-1">Upcoming Billings (30 days)</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Upcoming Billings Card */}
      <UpcomingBillingsCard 
        upcomingBillings={upcomingBillings}
        formatCurrency={formatCurrency}
        getDaysUntilNextBilling={getDaysUntilNextBilling}
        limit={5}
      />
      
      {/* Main Content */}
      <div className="space-y-6">
        <BillingScheduleFilters 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          frequencyFilter={frequencyFilter}
          setFrequencyFilter={setFrequencyFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />
        
        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Schedules</TabsTrigger>
            <TabsTrigger value="active">Active Only</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming (30 Days)</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <Card>
              <CardContent className="p-0">
                <BillingScheduleTable 
                  schedules={filteredSchedules} 
                  formatCurrency={formatCurrency} 
                  formatFrequency={formatFrequency}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="active">
            <Card>
              <CardContent className="p-0">
                <BillingScheduleTable 
                  schedules={activeBillings.filter(s => 
                    (searchTerm || frequencyFilter) ? filteredSchedules.some(f => f.id === s.id) : true
                  )} 
                  formatCurrency={formatCurrency} 
                  formatFrequency={formatFrequency}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="upcoming">
            <Card>
              <CardContent className="p-0">
                <BillingScheduleTable 
                  schedules={upcomingBillings.filter(s => 
                    (searchTerm || frequencyFilter) ? filteredSchedules.some(f => f.id === s.id) : true
                  )}
                  formatCurrency={formatCurrency} 
                  formatFrequency={formatFrequency}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BillingSchedules;
