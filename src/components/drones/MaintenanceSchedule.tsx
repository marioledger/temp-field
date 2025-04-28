
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { differenceInDays, parseISO } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Drone } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

interface MaintenanceScheduleProps {
  drones: Drone[];
}

const MaintenanceSchedule: React.FC<MaintenanceScheduleProps> = ({ drones }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const today = new Date();
  
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
  
  const handleAddMaintenance = () => {
    toast({
      title: "Maintenance Log",
      description: "Maintenance logging will be available in the next update.",
    });
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Maintenance Schedule</CardTitle>
        <Button variant="outline" size="sm" onClick={handleAddMaintenance}>
          Log Maintenance
        </Button>
      </CardHeader>
      <CardContent>
        {maintenanceEntries.map(drone => (
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
          </div>
        ))}
        
        {maintenanceEntries.length === 0 && (
          <div className="py-6 text-center text-muted-foreground">
            No maintenance entries found.
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
