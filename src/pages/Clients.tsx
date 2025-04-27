
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Plus, Phone, Mail, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AddClientDialog from "@/components/clients/AddClientDialog";
import { Skeleton } from "@/components/ui/skeleton";

interface Client {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  created_at: string;
  _count?: {
    fields: number;
  }
}

const Clients: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const fetchClients = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*');
      
      if (error) {
        throw error;
      }
      
      // Get field counts for each client
      const clientsWithFieldCounts = await Promise.all(
        data.map(async (client) => {
          const { count } = await supabase
            .from('fields')
            .select('*', { count: 'exact', head: true })
            .eq('client_id', client.id);
          
          return {
            ...client,
            _count: {
              fields: count || 0
            }
          };
        })
      );
      
      setClients(clientsWithFieldCounts);
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast({
        title: "Error loading clients",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchClients();
  }, []);
  
  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (client.phone && client.phone.includes(searchTerm))
  );

  const handleAddClient = () => {
    setDialogOpen(true);
  };

  const handleClientAdded = () => {
    setDialogOpen(false);
    fetchClients();
    toast({
      title: "Client added",
      description: "The client has been successfully added.",
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
          <p className="text-muted-foreground">Manage your clients and their fields.</p>
        </div>
        <Button onClick={handleAddClient}>
          <Plus className="mr-2 h-4 w-4" /> Add Client
        </Button>
      </div>
      
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search clients..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {/* Client Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-4" />
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredClients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client) => (
            <Card 
              key={client.id} 
              className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate(`/clients/${client.id}`)}
            >
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-2">{client.name}</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  {client.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>{client.phone}</span>
                    </div>
                  )}
                  {client.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>{client.email}</span>
                    </div>
                  )}
                  {client.address && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span className="line-clamp-1">{client.address}</span>
                    </div>
                  )}
                </div>
                <div className="mt-4 pt-4 border-t flex items-center justify-between">
                  <div className="text-sm">
                    <span className="font-medium">{client._count?.fields || 0}</span> fields
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/fields?clientId=${client.id}`);
                    }}
                  >
                    View Fields
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">No clients found matching your search</p>
          {searchTerm && (
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setSearchTerm("")}
            >
              Clear Search
            </Button>
          )}
        </div>
      )}
      
      <AddClientDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onClientAdded={handleClientAdded}
      />
    </div>
  );
};

export default Clients;
