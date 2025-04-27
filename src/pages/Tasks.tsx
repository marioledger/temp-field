
import React, { useState } from "react";
import { tasks, Task, TaskStatus, TaskType } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import TaskCard from "@/components/tasks/TaskCard";
import { Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from "react-router-dom";

const Tasks: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<TaskStatus | "all">("all");
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  
  // Check if we're filtering by field or drone
  const fieldId = searchParams.get("fieldId");
  const droneId = searchParams.get("droneId");
  
  let filteredTasks = tasks;
  
  // Apply field filter if present
  if (fieldId) {
    filteredTasks = filteredTasks.filter(task => task.fieldId === fieldId);
  }
  
  // Apply drone filter if present
  if (droneId) {
    filteredTasks = filteredTasks.filter(task => task.droneId === droneId);
  }
  
  // Apply status filter
  if (activeTab !== "all") {
    filteredTasks = filteredTasks.filter(task => task.status === activeTab);
  }
  
  // Apply search term filter
  if (searchTerm) {
    filteredTasks = filteredTasks.filter(task => 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.fieldName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  
  const handleNewTask = () => {
    toast({
      title: "Coming Soon",
      description: "New task creation will be available in the next update.",
    });
  };
  
  const statusCounts = {
    all: filteredTasks.length,
    planned: filteredTasks.filter(t => t.status === "planned").length,
    progress: filteredTasks.filter(t => t.status === "progress").length,
    completed: filteredTasks.filter(t => t.status === "completed").length,
    cancelled: filteredTasks.filter(t => t.status === "cancelled").length,
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground">
            {fieldId ? 'Field-specific tasks' : 
             droneId ? 'Drone-specific tasks' : 
             'Manage all drone operations and tasks.'}
          </p>
        </div>
        <Button onClick={handleNewTask}>New Task</Button>
      </div>
      
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tasks..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {/* Status Tabs */}
      <Tabs 
        defaultValue="all" 
        value={activeTab} 
        onValueChange={(value) => setActiveTab(value as TaskStatus | "all")}
      >
        <TabsList className="grid grid-cols-5 w-full mb-4">
          <TabsTrigger value="all">
            All ({statusCounts.all})
          </TabsTrigger>
          <TabsTrigger value="planned">
            Planned ({statusCounts.planned})
          </TabsTrigger>
          <TabsTrigger value="progress">
            In Progress ({statusCounts.progress})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({statusCounts.completed})
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            Cancelled ({statusCounts.cancelled})
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      {/* Task Cards */}
      {filteredTasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">No tasks found matching your criteria</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => {
              setSearchTerm("");
              setActiveTab("all");
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default Tasks;
