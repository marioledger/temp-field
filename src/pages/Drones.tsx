
import React, { useState } from "react";
import { drones } from "@/data/mockData";
import DroneCard from "@/components/drones/DroneCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import MaintenanceSchedule from "@/components/drones/MaintenanceSchedule";

const Drones: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const { toast } = useToast();
  
  const filteredDrones = drones.filter(drone => {
    // Apply search filter
    const matchesSearch = drone.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         drone.model.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Apply status filter if selected
    const matchesStatus = statusFilter ? drone.status === statusFilter : true;
    
    return matchesSearch && matchesStatus;
  });
  
  const handleAddDrone = () => {
    toast({
      title: "Coming Soon",
      description: "Drone registration will be available in the next update.",
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Drone Fleet</h1>
          <p className="text-muted-foreground">Manage and monitor your drone fleet.</p>
        </div>
        <Button onClick={handleAddDrone}>
          <Plus className="mr-2 h-4 w-4" /> Add Drone
        </Button>
      </div>
      
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search drones..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" /> 
              {statusFilter ? `Status: ${statusFilter}` : "Filter by Status"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setStatusFilter(null)}>
              All Statuses
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("available")}>
              Available
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("in-use")}>
              In Use
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("maintenance")}>
              Maintenance
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Maintenance Schedule */}
      <MaintenanceSchedule drones={drones} />
      
      {/* Drone Cards */}
      {filteredDrones.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDrones.map((drone) => (
            <DroneCard key={drone.id} drone={drone} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">No drones found matching your criteria</p>
          {searchTerm || statusFilter ? (
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter(null);
              }}
            >
              Clear Filters
            </Button>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default Drones;
