
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDroneById, getTasksByDrone } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import TaskCard from "@/components/tasks/TaskCard";
import { ArrowLeft, Edit, Trash2, Calendar, Battery, Clock } from "lucide-react";
import { formatShortDate } from "@/lib/formatDate";
import { useToast } from "@/hooks/use-toast";

const DroneDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const drone = id ? getDroneById(id) : null;
  const droneTasks = id ? getTasksByDrone(id) : [];
  
  const handleEdit = () => {
    toast({
      title: "Coming Soon",
      description: "Edit drone functionality will be available in the next update.",
    });
  };
  
  const handleDelete = () => {
    toast({
      title: "Coming Soon",
      description: "Delete drone functionality will be available in the next update.",
    });
  };
  
  const handleStatusChange = () => {
    toast({
      title: "Coming Soon",
      description: "Change drone status functionality will be available in the next update.",
    });
  };
  
  if (!drone) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-12">
        <h1 className="text-2xl font-bold mb-4">Drone Not Found</h1>
        <p className="text-muted-foreground mb-6">The drone you're looking for doesn't exist.</p>
        <Button onClick={() => navigate("/drones")}>Back to Drones</Button>
      </div>
    );
  }
  
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
  
  const maintenanceNeeded = new Date(drone.nextMaintenance) <= new Date();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" size="sm" className="mr-2" onClick={() => navigate("/drones")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Drone Details */}
        <div className="md:w-1/3">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>{drone.name}</CardTitle>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor()}`}>
                  {drone.status === "in-use" ? "In Use" : 
                   drone.status === "maintenance" ? "Maintenance" : "Available"}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="text-sm text-muted-foreground">Model</p>
                <p className="font-medium">{drone.model}</p>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm text-muted-foreground">Battery</p>
                  <p className="font-medium">{drone.battery}%</p>
                </div>
                <Progress value={drone.battery} className={getBatteryColor()} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Flight Hours</p>
                  <p className="font-medium">{drone.flightHours} hours</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Maintenance</p>
                  <p className="font-medium">{formatShortDate(drone.lastMaintenance)}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Next Maintenance</p>
                  <p className={`font-medium ${maintenanceNeeded ? "text-red-600" : ""}`}>
                    {formatShortDate(drone.nextMaintenance)}
                    {maintenanceNeeded && " (Overdue)"}
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex flex-col space-y-3">
                <Button 
                  variant="outline"
                  className="w-full"
                  onClick={handleStatusChange}
                >
                  Change Status
                </Button>
                <Button 
                  variant="outline"
                  className="w-full"
                  onClick={handleEdit}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Drone
                </Button>
                <Button 
                  variant="destructive"
                  className="w-full"
                  onClick={handleDelete}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Drone
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Drone Tasks */}
        <div className="md:w-2/3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Drone Tasks</CardTitle>
                <Button size="sm" onClick={() => navigate(`/tasks?droneId=${drone.id}`)}>View All</Button>
              </div>
            </CardHeader>
            <CardContent>
              {droneTasks.length > 0 ? (
                <div className="space-y-4">
                  {droneTasks.slice(0, 5).map(task => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                  
                  {droneTasks.length > 5 && (
                    <Button 
                      variant="outline" 
                      className="w-full mt-4"
                      onClick={() => navigate(`/tasks?droneId=${drone.id}`)}
                    >
                      View {droneTasks.length - 5} More Tasks
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No tasks assigned to this drone</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => toast({
                      title: "Coming Soon",
                      description: "New task creation will be available in the next update."
                    })}
                  >
                    Create Task
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DroneDetail;
