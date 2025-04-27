import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTaskById, getFieldById, getDroneById } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/ui/status-badge";
import { 
  ArrowLeft, Edit, Trash2, Calendar, Map, Plane, 
  CheckCircle, ArrowRightCircle, AlertCircle, XCircle, ClipboardCheck
} from "lucide-react";
import { formatDate } from "@/lib/formatDate";
import { useToast } from "@/hooks/use-toast";

const TaskDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const task = id ? getTaskById(id) : null;
  const field = task ? getFieldById(task.fieldId) : null;
  const drone = task ? getDroneById(task.droneId) : null;
  
  const handleEdit = () => {
    toast({
      title: "Coming Soon",
      description: "Edit task functionality will be available in the next update.",
    });
  };
  
  const handleDelete = () => {
    toast({
      title: "Coming Soon",
      description: "Delete task functionality will be available in the next update.",
    });
  };
  
  const handleStatusChange = (newStatus: string) => {
    toast({
      title: "Status Update",
      description: `Task status will be updated to ${newStatus} in the next update.`,
    });
  };
  
  if (!task || !field || !drone) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-12">
        <h1 className="text-2xl font-bold mb-4">Task Not Found</h1>
        <p className="text-muted-foreground mb-6">The task you're looking for doesn't exist.</p>
        <Button onClick={() => navigate("/tasks")}>Back to Tasks</Button>
      </div>
    );
  }
  
  const getTaskTypeLabel = (type: string) => {
    switch (type) {
      case "spraying": return "Spraying";
      case "seeding": return "Seeding";
      case "scouting": return "Scouting";
      case "border": return "Border Creation";
      default: return "Other";
    }
  };
  
  const getTaskTypeIcon = (type: string) => {
    switch (type) {
      case "spraying": return "💦";
      case "seeding": return "🌱";
      case "scouting": return "🔍";
      case "border": return "🔄";
      default: return "📋";
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" size="sm" className="mr-2" onClick={() => navigate("/tasks")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-3xl mr-3">{getTaskTypeIcon(task.type)}</span>
          <h1 className="text-3xl font-bold">{task.title}</h1>
        </div>
        <StatusBadge status={task.status} className="text-base px-3 py-1" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Task Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Type</p>
                <p className="font-medium">{getTaskTypeLabel(task.type)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Priority</p>
                <p className="font-medium capitalize">{task.priority}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Scheduled Date</p>
                <p className="font-medium">{formatDate(task.scheduledDate)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Recurrence</p>
                <p className="font-medium capitalize">
                  {task.recurrence === "none" ? "One-time" : task.recurrence}
                </p>
              </div>
              {task.completedDate && (
                <div>
                  <p className="text-sm text-muted-foreground">Completed On</p>
                  <p className="font-medium">{formatDate(task.completedDate)}</p>
                </div>
              )}
              {task.areaCompleted && (
                <div>
                  <p className="text-sm text-muted-foreground">Area Completed</p>
                  <p className="font-medium">{task.areaCompleted} ha</p>
                </div>
              )}
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground mb-1">Notes</p>
              <p>{task.notes || "No notes added"}</p>
            </div>
            
            <Separator />
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              {task.status === "planned" && (
                <>
                  <Button 
                    className="bg-primary hover:bg-primary/90"
                    onClick={() => handleStatusChange("In Progress")}
                  >
                    <ArrowRightCircle className="h-4 w-4 mr-2" />
                    Start Task
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => handleStatusChange("Cancelled")}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Cancel Task
                  </Button>
                </>
              )}
              
              {task.status === "progress" && (
                <Button 
                  className="bg-primary hover:bg-primary/90"
                  onClick={() => handleStatusChange("Completed")}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Complete Task
                </Button>
              )}
              
              <Button variant="outline" onClick={handleEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Task
              </Button>
              
              <Button variant="destructive" onClick={handleDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Task
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Map className="h-5 w-5 mr-2" />
                Field Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-2">
                <h3 className="font-medium">{field.name}</h3>
                <p className="text-sm text-muted-foreground">{field.cropType}</p>
                <p className="text-sm">{field.area} ha</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => navigate(`/fields/${field.id}`)}
                >
                  View Field Details
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Plane className="h-5 w-5 mr-2" />
                Drone Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-2">
                <h3 className="font-medium">{drone.name}</h3>
                <p className="text-sm text-muted-foreground">{drone.model}</p>
                <div className="text-sm flex items-center">
                  <span className={`w-2 h-2 rounded-full mr-2 ${
                    drone.status === "available" ? "bg-green-500" :
                    drone.status === "in-use" ? "bg-amber-500" : "bg-red-500"
                  }`}></span>
                  <span className="capitalize">{drone.status.replace("-", " ")}</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => navigate(`/drones/${drone.id}`)}
                >
                  View Drone Details
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <Button 
                className="w-full"
                variant="outline"
                onClick={() => toast({
                  title: "Coming Soon",
                  description: "Task logs will be available in the next update."
                })}
              >
                <ClipboardCheck className="h-4 w-4 mr-2" />
                View Task Logs
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;
