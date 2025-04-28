
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { drones, fields, tasks } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Calendar, Clock, RotateCw, PlaneTakeoff, PlaneLanding, Route, Plane } from "lucide-react";

const RoutePlanner: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedDrone, setSelectedDrone] = useState<string>("");
  const [optimizationMode, setOptimizationMode] = useState<"distance" | "time" | "efficiency">("distance");
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const { toast } = useToast();
  
  const availableDrones = drones.filter(drone => drone.status === "available");
  
  const handleFieldToggle = (fieldId: string) => {
    if (selectedFields.includes(fieldId)) {
      setSelectedFields(selectedFields.filter(id => id !== fieldId));
    } else {
      setSelectedFields([...selectedFields, fieldId]);
    }
  };
  
  const handleGenerateRoute = () => {
    if (!selectedDrone) {
      toast({
        title: "Drone Required",
        description: "Please select a drone for route planning.",
        variant: "destructive"
      });
      return;
    }
    
    if (selectedFields.length < 2) {
      toast({
        title: "Insufficient Fields",
        description: "Please select at least two fields for route optimization.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Route Generated",
      description: `Optimized route created for ${selectedFields.length} fields using ${optimizationMode} mode.`,
    });
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Route Planner</h1>
        <p className="text-muted-foreground">
          Optimize drone flight paths between fields to maximize efficiency.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Planning Parameters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <Input 
                  type="date" 
                  value={selectedDate} 
                  onChange={(e) => setSelectedDate(e.target.value)} 
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Drone</label>
                <Select value={selectedDrone} onValueChange={setSelectedDrone}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select drone" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableDrones.map(drone => (
                      <SelectItem key={drone.id} value={drone.id}>
                        {drone.name} ({drone.model})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Optimization Mode</label>
                <Tabs defaultValue="distance" value={optimizationMode} onValueChange={(value) => setOptimizationMode(value as "distance" | "time" | "efficiency")}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="distance">Distance</TabsTrigger>
                    <TabsTrigger value="time">Time</TabsTrigger>
                    <TabsTrigger value="efficiency">Efficiency</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              
              <Button 
                className="w-full mt-6" 
                onClick={handleGenerateRoute}
                disabled={!selectedDrone || selectedFields.length < 2}
              >
                <RotateCw className="mr-2 h-4 w-4" />
                Generate Optimal Route
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Select Fields</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {fields.map(field => (
                  <div 
                    key={field.id} 
                    className={`flex items-center justify-between p-3 border rounded-lg ${
                      selectedFields.includes(field.id) ? "bg-muted border-primary" : ""
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Checkbox 
                        checked={selectedFields.includes(field.id)} 
                        onCheckedChange={() => handleFieldToggle(field.id)}
                        id={`field-${field.id}`}
                      />
                      <div>
                        <label
                          htmlFor={`field-${field.id}`}
                          className="font-medium cursor-pointer"
                        >
                          {field.name}
                        </label>
                        <div className="text-sm text-muted-foreground">
                          {field.area} dunums • {field.cropType}
                        </div>
                      </div>
                    </div>
                    
                    <Badge variant="outline">
                      <MapPin className="h-3 w-3 mr-1" /> 
                      {field.location || "Location data unavailable"}
                    </Badge>
                  </div>
                ))}
                
                {fields.length === 0 && (
                  <div className="text-center py-6 text-muted-foreground">
                    No fields available for route planning
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {selectedFields.length >= 2 && selectedDrone && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Route Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-4 bg-muted/20 text-center py-16 relative">
                  <div className="flex justify-between items-center absolute top-4 left-4 right-4">
                    <div className="flex items-center">
                      <PlaneTakeoff className="h-4 w-4 text-green-600 mr-1" />
                      <span className="text-sm font-medium">Start</span>
                    </div>
                    <div className="flex items-center">
                      <PlaneLanding className="h-4 w-4 text-red-600 mr-1" />
                      <span className="text-sm font-medium">End</span>
                    </div>
                  </div>
                  
                  <Route className="h-16 w-16 text-muted-foreground" />
                  <p className="mt-4 text-muted-foreground">
                    Route visualization will appear here after generation.
                  </p>
                  
                  <div className="mt-4 text-sm flex justify-center space-x-6">
                    <div>
                      <span className="font-medium">Estimated Flight Time:</span> 45 mins
                    </div>
                    <div>
                      <span className="font-medium">Total Distance:</span> 12.5 km
                    </div>
                    <div>
                      <span className="font-medium">Battery Usage:</span> 65%
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 space-y-3">
                  <div className="flex justify-between items-center p-3 border-b">
                    <div className="flex items-center">
                      <div className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center mr-3">1</div>
                      <span>Central Barley Field</span>
                    </div>
                    <div className="text-sm text-muted-foreground">0.0 km</div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 border-b">
                    <div className="flex items-center">
                      <div className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center mr-3">2</div>
                      <span>North Wheat Field</span>
                    </div>
                    <div className="text-sm text-muted-foreground">3.2 km</div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 border-b">
                    <div className="flex items-center">
                      <div className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center mr-3">3</div>
                      <span>East Soybean Field</span>
                    </div>
                    <div className="text-sm text-muted-foreground">4.7 km</div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3">
                    <div className="flex items-center">
                      <div className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center mr-3">4</div>
                      <span>Central Barley Field (Return)</span>
                    </div>
                    <div className="text-sm text-muted-foreground">4.6 km</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoutePlanner;
