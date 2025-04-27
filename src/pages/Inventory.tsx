import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Tag, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useNavigate } from "react-router-dom";

const Inventory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const mockInventoryItems = [
    { 
      id: "1", 
      name: "Drone Battery Pack", 
      category: "batteries", 
      quantity: 5, 
      status: "available",
      serialNumber: "BAT-2024-001",
      image: "photo-1487887235947-a955ef187fcc"
    },
    { 
      id: "2", 
      name: "Spray Tank 500L", 
      category: "tanks", 
      quantity: 2, 
      status: "available",
      serialNumber: "TNK-2024-001",
      image: "photo-1618160702438-9b02ab6515c9"
    },
    { id: "3", name: "Pump 12V", category: "pumps", quantity: 3, status: "available" },
    { id: "4", name: "Pickup Truck", category: "vehicles", quantity: 1, status: "in-use" },
    { id: "5", name: "Utility Trailer", category: "trailers", quantity: 1, status: "available" },
    { id: "6", name: "Starlink Mini", category: "electronics", quantity: 1, status: "available" },
    { id: "7", name: "Herbicide X", category: "chemicals", quantity: 150, status: "available", unit: "L" },
    { id: "8", name: "Corn Seeds", category: "seeds", quantity: 200, status: "available", unit: "kg" },
  ];
  
  const filteredItems = mockInventoryItems.filter(item => {
    const matchesSearch = (
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });
  
  const handleItemClick = (itemId: string) => {
    navigate(`/inventory/${itemId}`);
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
        <Button onClick={() => toast({ title: "Coming Soon", description: "Add item functionality will be available after connecting to Supabase." })}>
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>
      
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or serial number..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
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
      
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredItems.map((item) => (
            <Card 
              key={item.id}
              className="cursor-pointer hover:bg-accent transition-colors overflow-hidden"
              onClick={() => handleItemClick(item.id)}
            >
              <div className="relative">
                <AspectRatio ratio={4/3}>
                  <img
                    src={`https://images.unsplash.com/${item.image}`}
                    alt={item.name}
                    className="object-cover w-full h-full"
                  />
                </AspectRatio>
                <div className="absolute top-2 right-2">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.status === "available" ? "bg-green-500/20 text-green-700" : "bg-amber-500/20 text-amber-700"
                  }`}>
                    {item.status}
                  </div>
                </div>
              </div>
              <div className="p-3">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h3 className="font-medium text-sm line-clamp-1">{item.name}</h3>
                    <p className="text-xs text-muted-foreground capitalize">{item.category}</p>
                  </div>
                  {item.serialNumber && (
                    <Tag className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  )}
                </div>
                {item.serialNumber && (
                  <p className="text-xs text-muted-foreground mt-1">{item.serialNumber}</p>
                )}
                <p className="text-xs font-medium mt-2">
                  Qty: {item.quantity}
                </p>
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
