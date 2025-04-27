
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Map } from "lucide-react";

interface Field {
  id: string;
  name: string;
  area: number;
  crop_type: string | null;
  location: string | null;
  created_at: string;
}

interface ClientFieldsListProps {
  clientId: string;
}

const ClientFieldsList: React.FC<ClientFieldsListProps> = ({ clientId }) => {
  const [fields, setFields] = useState<Field[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const fetchFields = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('fields')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      setFields(data || []);
    } catch (error: any) {
      console.error('Error fetching fields:', error);
      toast({
        title: "Error loading fields",
        description: error.message || "Failed to load client's fields.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchFields();
  }, [clientId]);
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between border p-4 rounded-md">
            <div className="space-y-2">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-9 w-24" />
          </div>
        ))}
      </div>
    );
  }
  
  if (fields.length === 0) {
    return (
      <div className="text-center py-8">
        <Map className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
        <p className="mb-3 text-muted-foreground">This client has no fields yet.</p>
        <Button onClick={() => navigate(`/fields/new?clientId=${clientId}`)}>
          Add First Field
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-3">
      {fields.map((field) => (
        <div 
          key={field.id}
          className="flex items-center justify-between border p-4 rounded-md hover:bg-accent/50 cursor-pointer"
          onClick={() => navigate(`/fields/${field.id}`)}
        >
          <div>
            <h4 className="font-medium">{field.name}</h4>
            <div className="text-sm text-muted-foreground">
              <span>{field.area} dunums</span>
              {field.crop_type && <span> • {field.crop_type}</span>}
            </div>
          </div>
          <Button 
            size="sm" 
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/fields/${field.id}`);
            }}
          >
            View Details
          </Button>
        </div>
      ))}
    </div>
  );
};

export default ClientFieldsList;
