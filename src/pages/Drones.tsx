
import React, { useState } from "react";
import { drones, Drone } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import DroneCard from "@/components/drones/DroneCard";
import { Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Drones: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<Drone["status"] | "all">("all");
  const { toast } = useToast();
  
  const filteredDrones = drones.filter(drone => {
    const matchesSearch = drone.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         drone.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = activeTab === "all" || drone.status === activeTab;
    return matchesSearch && matchesStatus;
  });
  
  const handleAddDrone = () => {
    toast({
      title: "Coming Soon",
      description: "Add drone functionality will be available in the next update.",
    });
  };
  
  const statusCounts = {
    all: drones.length,
    available: drones.filter(d => d.status === "available").length,
    "in-use": drones.filter(d => d.status === "in-use").length,
    maintenance: drones.filter(d => d.status === "maintenance").length,
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Drones</h1>
          <p className="text-muted-foreground">Manage your drone fleet.</p>
        </div>
        <Button onClick={handleAddDrone}>Add Drone</Button>
      </div>
      
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search drones..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {/* Status Tabs */}
      <Tabs 
        defaultValue="all" 
        value={activeTab} 
        onValueChange={(value) => setActiveTab(value as Drone["status"] | "all")}
      >
        <TabsList className="grid grid-cols-4 w-full mb-4">
          <TabsTrigger value="all">
            All ({statusCounts.all})
          </TabsTrigger>
          <TabsTrigger value="available">
            Available ({statusCounts.available})
          </TabsTrigger>
          <TabsTrigger value="in-use">
            In Use ({statusCounts["in-use"]})
          </TabsTrigger>
          <TabsTrigger value="maintenance">
            Maintenance ({statusCounts.maintenance})
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      {/* Drone Cards */}
      {filteredDrones.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDrones.map((drone) => (
            <DroneCard key={drone.id} drone={drone} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">No drones found matching your criteria</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => {
              setSearchTerm("");
              setActiveTab("all");
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default Drones;
