
import React from "react";
import { Field } from "@/data/mockData";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { formatShortDate } from "@/lib/formatDate";

interface FieldCardProps {
  field: Field;
}

const FieldCard: React.FC<FieldCardProps> = ({ field }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/fields/${field.id}`);
  };
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer" onClick={handleClick}>
      <div className="h-32 overflow-hidden">
        <img 
          src={field.image || "https://images.unsplash.com/photo-1465284958051-58f8082c3429?q=80&w=1000"} 
          alt={field.name}
          className="w-full h-full object-cover"
        />
      </div>
      <CardContent className="pt-4">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-lg">{field.name}</h3>
          <Badge variant="outline">{field.cropType}</Badge>
        </div>
        
        <div className="mt-2 space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Area:</span>
            <span>{field.area} ha</span>
          </div>
          {field.lastOperation && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last operation:</span>
              <span>{formatShortDate(field.lastOperation)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tasks pending:</span>
            <span className={field.tasksPending > 0 ? "text-amber-600 font-medium" : ""}>
              {field.tasksPending}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/50 p-2">
        <Button variant="ghost" size="sm" className="ml-auto" onClick={(e) => {
          e.stopPropagation();
          navigate(`/tasks?fieldId=${field.id}`);
        }}>
          View Tasks
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FieldCard;
