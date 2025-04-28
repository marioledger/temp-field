
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, AlertCircle, CheckCircle, Clock, Filter, Download } from "lucide-react";
import { differenceInDays, parseISO, format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Drone } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MaintenanceScheduleProps {
  drones: Drone[];
}

const MaintenanceSchedule: React.FC<MaintenanceScheduleProps> = ({ drones }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const today = new Date();
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  
  const maintenanceEntries = drones.map(drone => {
    const nextDate = parseISO(drone.nextMaintenance);
    const daysUntil = differenceInDays(nextDate, today);
    
    let status: "overdue" | "upcoming" | "future" = "future";
    if (daysUntil < 0) status = "overdue";
    else if (daysUntil <= 7) status = "upcoming";
    
    return {
      ...drone,
      daysUntil,
      status
    };
  }).sort((a, b) => a.daysUntil - b.daysUntil);
  
  const filteredEntries = filterStatus 
    ? maintenanceEntries.filter(drone => drone.status === filterStatus)
    : maintenanceEntries;
  
  const handleAddMaintenance = () => {
    toast({
      title: "Maintenance Log",
      description: "Maintenance logging will be available in the next update.",
    });
  };
  
  const handleExportSchedule = () => {
    // Generate CSV content
    const headers = ["Drone Name", "Model", "Last Maintenance", "Next Maintenance", "Status", "Days Until/Overdue"];
    const rows = maintenanceEntries.map(drone => [
      drone.name,
      drone.model,
      drone.lastMaintenance,
      drone.nextMaintenance,
      drone.status,
      drone.status === "overdue" ? `${Math.abs(drone.daysUntil)} days overdue` : `${drone.daysUntil} days`
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `maintenance-schedule-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export Successful",
      description: "Maintenance schedule has been exported as CSV.",
    });
  };
  
  const overdueCount = maintenanceEntries.filter(drone => drone.status === "overdue").length;
  const upcomingCount = maintenanceEntries.filter(drone => drone.status === "upcoming").length;
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Maintenance Schedule</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {overdueCount > 0 && (
              <span className="text-red-500 font-medium">{overdueCount} overdue</span>
            )}
            {overdueCount > 0 && upcomingCount > 0 && (
              <span className="mx-1">•</span>
            )}
            {upcomingCount > 0 && (
              <span className="text-amber-500 font-medium">{upcomingCount} upcoming this week</span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-1" />
                {filterStatus ? `${filterStatus}` : "All"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFilterStatus(null)}>
                All
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("overdue")}>
                Overdue
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("upcoming")}>
                Upcoming (7 days)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("future")}>
                Future
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm" onClick={handleExportSchedule}>
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={handleAddMaintenance}>
            Log Maintenance
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {filteredEntries.length > 0 ? (
          <div className="space-y-3">
            {filteredEntries.map(drone => (
              <div
                key={drone.id}
                className="mb-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => navigate(`/drones/${drone.id}`)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{drone.name}</h4>
                    <div className="text-sm text-muted-foreground">
                      {drone.model} • {drone.flightHours} flight hours
                    </div>
                  </div>
                  <MaintenanceStatusBadge status={drone.status} daysUntil={drone.daysUntil} />
                </div>
                
                <div className="mt-2 flex items-center text-sm">
                  <CalendarDays className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                  <span>Last: {drone.lastMaintenance}</span>
                  <span className="mx-2">•</span>
                  <Clock className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                  <span>Next: {drone.nextMaintenance}</span>
                </div>
                
                {drone.status === "overdue" && (
                  <div className="mt-2 text-sm text-red-600">
                    <AlertCircle className="h-3.5 w-3.5 inline mr-1" />
                    Immediate maintenance required!
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center text-muted-foreground">
            {filterStatus ? (
              <>
                <p>No {filterStatus} maintenance entries found.</p>
                <Button 
                  variant="link" 
                  className="mt-1 h-auto p-0" 
                  onClick={() => setFilterStatus(null)}
                >
                  Show all entries
                </Button>
              </>
            ) : (
              <p>No maintenance entries found.</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const MaintenanceStatusBadge: React.FC<{ status: string; daysUntil: number }> = ({ status, daysUntil }) => {
  switch (status) {
    case "overdue":
      return (
        <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
          <AlertCircle className="h-3.5 w-3.5 mr-1" />
          Overdue by {Math.abs(daysUntil)} days
        </Badge>
      );
    case "upcoming":
      return (
        <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
          <Clock className="h-3.5 w-3.5 mr-1" />
          Due in {daysUntil} days
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
          <CheckCircle className="h-3.5 w-3.5 mr-1" />
          Scheduled
        </Badge>
      );
  }
};

export default MaintenanceSchedule;
