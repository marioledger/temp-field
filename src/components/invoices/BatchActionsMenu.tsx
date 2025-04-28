
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { FileText, Mail, Printer, Download, CheckSquare, SquareAsterisk } from "lucide-react";

interface BatchActionsMenuProps {
  selectedIds: string[];
  onClearSelection: () => void;
}

const BatchActionsMenu: React.FC<BatchActionsMenuProps> = ({ 
  selectedIds,
  onClearSelection
}) => {
  const { toast } = useToast();
  
  const handleBatchAction = (action: string) => {
    toast({
      title: `Batch action: ${action}`,
      description: `Performed ${action} on ${selectedIds.length} invoice(s).`,
    });
    onClearSelection();
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="default">
          <CheckSquare className="mr-2 h-4 w-4" /> 
          Actions ({selectedIds.length})
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Batch Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleBatchAction("mark as paid")}>
          <SquareAsterisk className="mr-2 h-4 w-4" />
          Mark as Paid
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleBatchAction("download")}>
          <Download className="mr-2 h-4 w-4" />
          Download as ZIP
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleBatchAction("print")}>
          <Printer className="mr-2 h-4 w-4" />
          Print Selected
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleBatchAction("email")}>
          <Mail className="mr-2 h-4 w-4" />
          Email Selected
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onClearSelection}>
          Clear Selection
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default BatchActionsMenu;
