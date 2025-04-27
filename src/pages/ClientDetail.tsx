
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Edit, Trash2, Mail, Phone, MapPin, Plus } from "lucide-react";
import EditClientDialog from "@/components/clients/EditClientDialog";
import DeleteClientDialog from "@/components/clients/DeleteClientDialog";
import ClientFieldsList from "@/components/clients/ClientFieldsList";

interface Client {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  created_at: string;
}

const ClientDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [client, setClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  const fetchClient = async () => {
    if (!id) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        throw error;
      }
      
      setClient(data);
    } catch (error: any) {
      console.error('Error fetching client:', error);
      toast({
        title: "Error loading client",
        description: error.message || "Client not found or could not be loaded.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchClient();
  }, [id]);
  
  const handleClientUpdated = () => {
    setEditDialogOpen(false);
    fetchClient();
    toast({
      title: "Client updated",
      description: "The client information has been updated successfully."
    });
  };
  
  const handleClientDeleted = () => {
    setDeleteDialogOpen(false);
    navigate('/clients');
    toast({
      title: "Client deleted",
      description: "The client has been removed successfully."
    });
  };
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" className="mr-2" onClick={() => navigate("/clients")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
        <div className="flex flex-col md:flex-row gap-6">
          <Card className="md:w-1/3">
            <CardHeader>
              <Skeleton className="h-8 w-3/4" />
            </CardHeader>
            <CardContent className="space-y-6">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Separator />
              <div className="space-y-3">
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-9 w-full" />
              </div>
            </CardContent>
          </Card>
          <div className="md:w-2/3">
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-1/3" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }
  
  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-12">
        <h1 className="text-2xl font-bold mb-4">Client Not Found</h1>
        <p className="text-muted-foreground mb-6">The client you're looking for doesn't exist.</p>
        <Button onClick={() => navigate("/clients")}>Back to Clients</Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" size="sm" className="mr-2" onClick={() => navigate("/clients")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Client Details */}
        <div className="md:w-1/3">
          <Card>
            <CardHeader>
              <CardTitle>{client.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                {client.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a href={`mailto:${client.email}`} className="hover:underline">{client.email}</a>
                  </div>
                )}
                {client.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a href={`tel:${client.phone}`} className="hover:underline">{client.phone}</a>
                  </div>
                )}
                {client.address && (
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span>{client.address}</span>
                  </div>
                )}
              </div>
              
              <Separator />
              
              <div className="flex flex-col space-y-3">
                <Button 
                  variant="outline"
                  className="w-full"
                  onClick={() => setEditDialogOpen(true)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Client
                </Button>
                <Button 
                  variant="destructive"
                  className="w-full"
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Client
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Client Fields */}
        <div className="md:w-2/3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Fields</CardTitle>
              <Button size="sm" onClick={() => navigate(`/fields/new?clientId=${client.id}`)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Field
              </Button>
            </CardHeader>
            <CardContent>
              <ClientFieldsList clientId={client.id} />
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Edit Dialog */}
      {editDialogOpen && (
        <EditClientDialog
          client={client}
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          onClientUpdated={handleClientUpdated}
        />
      )}
      
      {/* Delete Confirmation Dialog */}
      {deleteDialogOpen && (
        <DeleteClientDialog
          client={client}
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onClientDeleted={handleClientDeleted}
        />
      )}
    </div>
  );
};

export default ClientDetail;
