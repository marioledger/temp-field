
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Edit, Trash2, Link, Package, Truck, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const InventoryItemDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("details");
  
  // Mock item data (will be replaced with Supabase data)
  const mockItem = {
    id: id || "1",
    name: "Drone Battery Pack",
    category: "batteries",
    quantity: 5,
    status: "available",
    description: "High-capacity lithium-ion battery pack for agricultural drones.",
    purchaseDate: "2024-01-15",
    serialNumber: "BP-2024-001",
    manufacturer: "DroneTech",
    lastMaintenanceDate: "2024-03-20",
    nextMaintenanceDate: "2024-06-20",
    assignedTo: [],
    linkedTasks: []
  };
  
  // Mock data for assignments
  const mockVehicles = [
    { id: "v1", name: "Pickup Truck", type: "vehicle" },
    { id: "v2", name: "Utility Trailer", type: "trailer" }
  ];
  
  const mockTasks = [
    { id: "t1", title: "Spray Field 1", date: "2024-04-30", field: "North Valley" },
    { id: "t2", title: "Seed Field 2", date: "2024-05-05", field: "East Creek" }
  ];
  
  const handleEdit = () => {
    toast({
      title: "Coming Soon",
      description: "Edit item functionality will be available after connecting to Supabase.",
    });
  };
  
  const handleDelete = () => {
    toast({
      title: "Coming Soon",
      description: "Delete item functionality will be available after connecting to Supabase.",
    });
  };
  
  const handleAssign = (type: string) => {
    toast({
      title: "Coming Soon",
      description: `Assign to ${type} functionality will be available after connecting to Supabase.`,
    });
  };
  
  if (!mockItem) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-12">
        <h1 className="text-2xl font-bold mb-4">Item Not Found</h1>
        <p className="text-muted-foreground mb-6">The inventory item you're looking for doesn't exist.</p>
        <Button onClick={() => navigate("/inventory")}>Back to Inventory</Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" size="sm" className="mr-2" onClick={() => navigate("/inventory")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-3xl font-bold">{mockItem.name}</h1>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            <span className={`w-2 h-2 rounded-full mr-2 ${
              mockItem.status === "available" ? "bg-green-500" : "bg-amber-500"
            }`}></span>
            <span className="text-sm capitalize">{mockItem.status}</span>
          </div>
          <Button variant="outline" size="sm" onClick={handleEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Category</Label>
                    <p className="capitalize">{mockItem.category}</p>
                  </div>
                  <div>
                    <Label>Quantity</Label>
                    <p>{mockItem.quantity}</p>
                  </div>
                  <div>
                    <Label>Serial Number</Label>
                    <p>{mockItem.serialNumber || "N/A"}</p>
                  </div>
                  <div>
                    <Label>Manufacturer</Label>
                    <p>{mockItem.manufacturer || "N/A"}</p>
                  </div>
                  <div>
                    <Label>Purchase Date</Label>
                    <p>{mockItem.purchaseDate || "N/A"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{mockItem.description || "No description available."}</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="assignments" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="mr-2 h-5 w-5" />
                  Assign to Vehicle/Trailer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockVehicles.map((vehicle) => (
                    <div 
                      key={vehicle.id}
                      className="flex justify-between items-center p-3 border rounded-md hover:bg-accent"
                    >
                      <div>
                        <p className="font-medium">{vehicle.name}</p>
                        <p className="text-sm text-muted-foreground capitalize">{vehicle.type}</p>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleAssign(vehicle.type)}
                      >
                        <Link className="h-4 w-4 mr-2" />
                        Assign
                      </Button>
                    </div>
                  ))}
                  
                  <Button 
                    variant="outline" 
                    className="w-full mt-4"
                    onClick={() => toast({ title: "Coming Soon", description: "Add vehicle functionality coming soon." })}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Vehicle
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Assign to Task
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockTasks.map((task) => (
                    <div 
                      key={task.id}
                      className="flex justify-between items-center p-3 border rounded-md hover:bg-accent"
                    >
                      <div>
                        <p className="font-medium">{task.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {task.field} - {new Date(task.date).toLocaleDateString()}
                        </p>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleAssign('task')}
                      >
                        <Link className="h-4 w-4 mr-2" />
                        Assign
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="maintenance" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Maintenance Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Last Maintenance</Label>
                    <p>{mockItem.lastMaintenanceDate || "No record"}</p>
                  </div>
                  <div>
                    <Label>Next Scheduled Maintenance</Label>
                    <p>{mockItem.nextMaintenanceDate || "Not scheduled"}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <Label>Update Maintenance Date</Label>
                  <div className="flex items-center mt-2 gap-2">
                    <Input type="date" />
                    <Button 
                      onClick={() => toast({ title: "Coming Soon", description: "Maintenance update coming soon." })}
                    >
                      Update
                    </Button>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <Label>Maintenance History</Label>
                  <p className="text-center text-muted-foreground py-8">
                    No maintenance history available
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InventoryItemDetail;
