
import React from "react";
import { Task } from "@/data/mockData";
import { StatusBadge } from "@/components/ui/status-badge";
import { Calendar, Drone, Map } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/formatDate";
import { useNavigate } from "react-router-dom";

interface TaskCardProps {
  task: Task;
  compact?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, compact = false }) => {
  const navigate = useNavigate();
  
  const getTaskTypeIcon = (type: Task["type"]) => {
    switch (type) {
      case "spraying":
        return "💦";
      case "seeding":
        return "🌱";
      case "scouting":
        return "🔍";
      case "border":
        return "🔄";
      default:
        return "📋";
    }
  };
  
  const getPriorityClass = (priority: Task["priority"]) => {
    switch (priority) {
      case "high":
        return "text-red-600";
      case "medium":
        return "text-amber-600";
      case "low":
        return "text-blue-600";
      default:
        return "";
    }
  };
  
  const handleClick = () => {
    navigate(`/tasks/${task.id}`);
  };

  if (compact) {
    return (
      <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={handleClick}>
        <CardContent className="pt-4">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center">
              <span className="text-lg mr-2">{getTaskTypeIcon(task.type)}</span>
              <h3 className="font-medium">{task.title}</h3>
            </div>
            <StatusBadge status={task.status} />
          </div>
          <p className="text-sm text-muted-foreground line-clamp-1">{task.fieldName}</p>
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            <Calendar className="h-3 w-3 mr-1" />
            {formatDate(task.scheduledDate)}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={handleClick}>
      <CardContent className="pt-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center">
            <span className="text-2xl mr-2">{getTaskTypeIcon(task.type)}</span>
            <h3 className="font-medium text-lg">{task.title}</h3>
          </div>
          <StatusBadge status={task.status} />
        </div>
        
        <div className="space-y-2 mb-3">
          <div className="flex items-center text-sm">
            <Map className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{task.fieldName}</span>
          </div>
          <div className="flex items-center text-sm">
            <Drone className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{task.droneName}</span>
          </div>
          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{formatDate(task.scheduledDate)}</span>
          </div>
        </div>
        
        {task.notes && (
          <p className="text-sm text-muted-foreground line-clamp-2">{task.notes}</p>
        )}
        
        <div className="mt-3 flex items-center">
          <span className={`text-xs font-medium ${getPriorityClass(task.priority)}`}>
            {task.priority.toUpperCase()} PRIORITY
          </span>
          {task.recurrence && task.recurrence !== "none" && (
            <span className="ml-auto text-xs bg-gray-100 px-2 py-1 rounded">
              {task.recurrence.toUpperCase()}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
