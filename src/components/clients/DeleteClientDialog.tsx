
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Client {
  id: string;
  name: string;
}

interface DeleteClientDialogProps {
  client: Client;
  open: boolean;
  onClose: () => void;
  onClientDeleted: () => void;
}

export default function DeleteClientDialog({ 
  client, 
  open, 
  onClose, 
  onClientDeleted 
}: DeleteClientDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  
  const handleDelete = async () => {
    setIsDeleting(true);
    
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', client.id);
        
      if (error) throw error;
      
      onClientDeleted();
    } catch (error: any) {
      console.error('Error deleting client:', error);
      toast({
        title: "Failed to delete client",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive"
      });
      onClose();
    } finally {
      setIsDeleting(false);
    }
  };
  
  return (
    <AlertDialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will permanently delete the client "<span className="font-medium">{client.name}</span>" 
            and all associated data. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
