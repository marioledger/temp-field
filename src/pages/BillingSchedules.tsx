
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Plus, 
  Calendar, 
  MoreHorizontal, 
  Bell, 
  RefreshCcw,
  Check,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { BillingSchedule, billingSchedules } from "@/data/mockData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { addDays, format, parseISO } from "date-fns";

const BillingSchedules: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSchedules, setFilteredSchedules] = useState<BillingSchedule[]>(billingSchedules);
  const [activeBillings, setActiveBillings] = useState<BillingSchedule[]>([]);
  const [upcomingBillings, setUpcomingBillings] = useState<BillingSchedule[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Filter active schedules
    const active = billingSchedules.filter(schedule => schedule.active);
    setActiveBillings(active);
    
    // Get upcoming billings (next 30 days)
    const today = new Date();
    const thirtyDaysLater = addDays(today, 30);
    
    const upcoming = active.filter(schedule => {
      const billingDate = parseISO(schedule.nextBillingDate);
      return billingDate >= today && billingDate <= thirtyDaysLater;
    }).sort((a, b) => {
      return parseISO(a.nextBillingDate).getTime() - parseISO(b.nextBillingDate).getTime();
    });
    
    setUpcomingBillings(upcoming);
    
    // Apply search filter if any
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const filtered = billingSchedules.filter(schedule => 
        schedule.clientName.toLowerCase().includes(term) ||
        schedule.fieldName.toLowerCase().includes(term) ||
        schedule.serviceName.toLowerCase().includes(term)
      );
      setFilteredSchedules(filtered);
    } else {
      setFilteredSchedules(billingSchedules);
    }
  }, [searchTerm]);
  
  const handleCreateSchedule = () => {
    toast({
      title: "Feature in development",
      description: "Creating new billing schedules will be available soon.",
    });
  };
  
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
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Billing Schedules</h1>
          <p className="text-muted-foreground">
            Manage recurring billing schedules for your services
          </p>
        </div>
        <Button onClick={handleCreateSchedule}>
          <Plus className="mr-2 h-4 w-4" /> Create Schedule
        </Button>
      </div>
      
      {/* Upcoming Billings Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <Bell className="mr-2 h-5 w-5" />
            Upcoming Billings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            {upcomingBillings.length > 0 ? (
              upcomingBillings.slice(0, 5).map((schedule) => (
                <div key={schedule.id} className="flex flex-col md:flex-row justify-between gap-4 pb-4 border-b">
                  <div>
                    <h3 className="font-medium">{schedule.serviceName}</h3>
                    <p className="text-sm text-muted-foreground">
                      {schedule.clientName} - {schedule.fieldName}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="font-semibold">{formatCurrency(schedule.amount)}</div>
                    <div className="flex items-center text-sm">
                      <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                      <span className="text-muted-foreground mr-2">{schedule.nextBillingDate}</span>
                      <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                        {getDaysUntilNextBilling(schedule.nextBillingDate)}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-4 text-muted-foreground">No upcoming billings in the next 30 days</p>
            )}
            
            {upcomingBillings.length > 5 && (
              <div className="text-center pt-2">
                <Button variant="outline" onClick={() => navigate("/billings?tab=upcoming")}>
                  View All ({upcomingBillings.length})
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Main Content */}
      <div className="space-y-6">
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
                <RefreshCcw className="mr-2 h-4 w-4" /> Frequency
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => toast({ description: "Filter feature coming soon" })}>
                All Frequencies
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast({ description: "Filter feature coming soon" })}>
                One-time
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast({ description: "Filter feature coming soon" })}>
                Weekly
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast({ description: "Filter feature coming soon" })}>
                Monthly
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast({ description: "Filter feature coming soon" })}>
                Quarterly
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast({ description: "Filter feature coming soon" })}>
                Yearly
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Schedules</TabsTrigger>
            <TabsTrigger value="active">Active Only</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming (30 Days)</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <Card>
              <CardContent className="p-0">
                <BillingSchedulesTable 
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
                <BillingSchedulesTable 
                  schedules={activeBillings.filter(s => 
                    searchTerm ? filteredSchedules.some(f => f.id === s.id) : true
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
                <BillingSchedulesTable 
                  schedules={upcomingBillings.filter(s => 
                    searchTerm ? filteredSchedules.some(f => f.id === s.id) : true
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

interface BillingSchedulesTableProps {
  schedules: BillingSchedule[];
  formatCurrency: (amount: number) => string;
  formatFrequency: (frequency: string) => string;
}

const BillingSchedulesTable: React.FC<BillingSchedulesTableProps> = ({ 
  schedules, 
  formatCurrency, 
  formatFrequency 
}) => {
  const { toast } = useToast();
  
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
                    <DropdownMenuItem onClick={() => toast({ description: "Feature coming soon" })}>
                      Edit Schedule
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toast({ description: "Feature coming soon" })}>
                      Generate Invoice
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toast({ description: "Feature coming soon" })}>
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

export default BillingSchedules;
