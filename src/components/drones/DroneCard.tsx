
import React from "react";
import { Drone } from "@/data/mockData";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Battery, Calendar, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatShortDate } from "@/lib/formatDate";
import { Progress } from "@/components/ui/progress";

interface DroneCardProps {
  drone: Drone;
}

const DroneCard: React.FC<DroneCardProps> = ({ drone }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/drones/${drone.id}`);
  };
  
  const getStatusColor = () => {
    switch (drone.status) {
      case "available":
        return "bg-green-100 text-green-800 border-green-300";
      case "in-use":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "maintenance":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };
  
  const getBatteryColor = () => {
    if (drone.battery >= 75) return "bg-green-500";
    if (drone.battery >= 50) return "bg-amber-500";
    return "bg-red-500";
  };
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer" onClick={handleClick}>
      <CardContent className="pt-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-lg">{drone.name}</h3>
          <Badge className={getStatusColor()}>
            {drone.status === "in-use" ? "In Use" : 
             drone.status === "maintenance" ? "Maintenance" : "Available"}
          </Badge>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4">{drone.model}</p>
        
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1 text-sm">
              <span className="text-muted-foreground flex items-center">
                <Battery className="h-4 w-4 mr-1" />
                Battery
              </span>
              <span>{drone.battery}%</span>
            </div>
            <Progress value={drone.battery} className={getBatteryColor()} />
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              Flight Hours
            </span>
            <span>{drone.flightHours}</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              Next Maintenance
            </span>
            <span>{formatShortDate(drone.nextMaintenance)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/50 p-2">
        <Button variant="ghost" size="sm" className="ml-auto" onClick={(e) => {
          e.stopPropagation();
          navigate(`/tasks?droneId=${drone.id}`);
        }}>
          View Tasks
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DroneCard;
