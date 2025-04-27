
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFieldById, getTasksByField } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import TaskCard from "@/components/tasks/TaskCard";
import { ArrowLeft, Edit, Map, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const FieldDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const field = id ? getFieldById(id) : null;
  const fieldTasks = id ? getTasksByField(id) : [];
  
  const handleEdit = () => {
    toast({
      title: "Coming Soon",
      description: "Edit field functionality will be available in the next update.",
    });
  };
  
  const handleDelete = () => {
    toast({
      title: "Coming Soon",
      description: "Delete field functionality will be available in the next update.",
    });
  };
  
  if (!field) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-12">
        <h1 className="text-2xl font-bold mb-4">Field Not Found</h1>
        <p className="text-muted-foreground mb-6">The field you're looking for doesn't exist.</p>
        <Button onClick={() => navigate("/fields")}>Back to Fields</Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" size="sm" className="mr-2" onClick={() => navigate("/fields")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Field Image and Details */}
        <div className="md:w-1/3">
          <Card>
            <div className="h-48 overflow-hidden">
              <img 
                src={field.image || "https://images.unsplash.com/photo-1465284958051-58f8082c3429?q=80&w=1000"} 
                alt={field.name}
                className="w-full h-full object-cover"
              />
            </div>
            <CardHeader>
              <CardTitle>{field.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm text-muted-foreground">Area</p>
                  <p className="font-medium">{field.area} ha</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Crop Type</p>
                  <p className="font-medium">{field.cropType}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{field.location || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tasks Pending</p>
                  <p className="font-medium">{field.tasksPending}</p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button variant="outline" className="flex-1" onClick={handleEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => toast({
                  title: "Coming Soon",
                  description: "View map functionality will be available in the next update."
                })}>
                  <Map className="h-4 w-4 mr-2" />
                  View Map
                </Button>
              </div>
              
              <Button variant="destructive" className="w-full" onClick={handleDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Field
              </Button>
            </CardContent>
          </Card>
        </div>
        
        {/* Field Tasks */}
        <div className="md:w-2/3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Field Tasks</CardTitle>
                <Button size="sm" onClick={() => navigate(`/tasks?fieldId=${field.id}`)}>View All</Button>
              </div>
            </CardHeader>
            <CardContent>
              {fieldTasks.length > 0 ? (
                <div className="space-y-4">
                  {fieldTasks.slice(0, 5).map(task => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                  
                  {fieldTasks.length > 5 && (
                    <Button 
                      variant="outline" 
                      className="w-full mt-4"
                      onClick={() => navigate(`/tasks?fieldId=${field.id}`)}
                    >
                      View {fieldTasks.length - 5} More Tasks
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No tasks assigned to this field</p>
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

export default FieldDetail;
