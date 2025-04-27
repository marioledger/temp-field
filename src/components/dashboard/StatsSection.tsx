
import React from "react";
import { businessSummary } from "@/data/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Map, Drone, ClipboardList, CheckCircle, Clock, AlertCircle } from "lucide-react";

const StatsSection: React.FC = () => {
  const statCards = [
    {
      title: "Fields",
      value: businessSummary.totalFields,
      icon: Map,
      color: "text-blue-500"
    },
    {
      title: "Drones",
      value: businessSummary.totalDrones,
      icon: Drone,
      color: "text-green-500"
    },
    {
      title: "Tasks",
      value: businessSummary.totalTasks,
      icon: ClipboardList,
      color: "text-purple-500"
    },
    {
      title: "Completed",
      value: businessSummary.tasksCompleted,
      icon: CheckCircle,
      color: "text-green-500"
    },
    {
      title: "In Progress",
      value: businessSummary.tasksInProgress,
      icon: Clock,
      color: "text-amber-500"
    },
    {
      title: "Planned",
      value: businessSummary.tasksPlanned,
      icon: AlertCircle,
      color: "text-blue-500"
    }
  ];
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {statCards.map((stat, index) => (
        <Card key={index}>
          <CardContent className="pt-4 pb-2 px-4 flex flex-col items-center">
            <stat.icon className={`h-8 w-8 mb-2 ${stat.color}`} />
            <h3 className="text-2xl font-bold">{stat.value}</h3>
            <p className="text-muted-foreground text-sm">{stat.title}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsSection;
