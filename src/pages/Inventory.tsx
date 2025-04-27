
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Inventory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const { toast } = useToast();
  
  // This will be replaced with actual data from Supabase
  const mockInventoryItems = [
    { id: "1", name: "Drone Battery Pack", category: "batteries", quantity: 5, status: "available" },
    { id: "2", name: "Spray Tank 500L", category: "tanks", quantity: 2, status: "available" },
    { id: "3", name: "Pump 12V", category: "pumps", quantity: 3, status: "available" },
    { id: "4", name: "Pickup Truck", category: "vehicles", quantity: 1, status: "in-use" },
    { id: "5", name: "Utility Trailer", category: "trailers", quantity: 1, status: "available" },
    { id: "6", name: "Starlink Mini", category: "electronics", quantity: 1, status: "available" },
    { id: "7", name: "Herbicide X", category: "chemicals", quantity: 150, status: "available", unit: "L" },
    { id: "8", name: "Corn Seeds", category: "seeds", quantity: 200, status: "available", unit: "kg" },
  ];
  
  // Filter items based on search and category
  const filteredItems = mockInventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });
  
  const handleAddItem = () => {
    toast({
      title: "Coming Soon",
      description: "Add inventory item functionality will be available after connecting to Supabase.",
    });
  };
  
  const handleItemClick = (itemId: string) => {
    toast({
      title: "Coming Soon",
      description: "Item detail view will be available after connecting to Supabase.",
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
          <p className="text-muted-foreground">
            Manage your equipment, supplies, and vehicles.
          </p>
        </div>
        <Button onClick={handleAddItem}>
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>
      
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search inventory..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {/* Category Tabs */}
      <Tabs 
        defaultValue="all" 
        value={activeCategory} 
        onValueChange={setActiveCategory}
      >
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Items</TabsTrigger>
          <TabsTrigger value="batteries">Batteries</TabsTrigger>
          <TabsTrigger value="tanks">Tanks</TabsTrigger>
          <TabsTrigger value="pumps">Pumps</TabsTrigger>
          <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
          <TabsTrigger value="trailers">Trailers</TabsTrigger>
          <TabsTrigger value="chemicals">Chemicals</TabsTrigger>
          <TabsTrigger value="seeds">Seeds</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {/* Inventory Items Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <Card 
              key={item.id}
              className="p-4 cursor-pointer hover:bg-accent transition-colors"
              onClick={() => handleItemClick(item.id)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-muted-foreground capitalize">{item.category}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center">
                    <span className={`w-2 h-2 rounded-full mr-2 ${
                      item.status === "available" ? "bg-green-500" : "bg-amber-500"
                    }`}></span>
                    <span className="text-sm capitalize">{item.status}</span>
                  </div>
                  <p className="text-sm font-medium">
                    {item.quantity} {item.unit || "units"}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">No inventory items found</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => {
              setSearchTerm("");
              setActiveCategory("all");
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default Inventory;
