
import React, { useState } from "react";
import { fields } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import FieldCard from "@/components/fields/FieldCard";
import { Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Fields: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [cropFilter, setCropFilter] = useState<string>("all");
  const { toast } = useToast();
  
  // Get unique crop types from fields
  const cropTypes = Array.from(new Set(fields.map(field => field.cropType)));
  
  const filteredFields = fields.filter(field => {
    const matchesSearch = field.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCrop = cropFilter === "all" || field.cropType === cropFilter;
    return matchesSearch && matchesCrop;
  });
  
  const handleAddField = () => {
    toast({
      title: "Coming Soon",
      description: "Add field functionality will be available in the next update.",
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fields</h1>
          <p className="text-muted-foreground">Manage all your agricultural fields.</p>
        </div>
        <Button onClick={handleAddField}>Add Field</Button>
      </div>
      
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search fields..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={cropFilter} onValueChange={setCropFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Crop Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Crops</SelectItem>
            {cropTypes.map((crop) => (
              <SelectItem key={crop} value={crop}>{crop}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Field Cards */}
      {filteredFields.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredFields.map((field) => (
            <FieldCard key={field.id} field={field} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">No fields found matching your criteria</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => {
              setSearchTerm("");
              setCropFilter("all");
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default Fields;
