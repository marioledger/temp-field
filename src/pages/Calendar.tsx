
import React, { useState } from "react";
import { tasks, Task } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { StatusBadge } from "@/components/ui/status-badge";
import { getDayAndMonth, formatTime } from "@/lib/formatDate";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Calendar: React.FC = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<"day" | "week" | "month">("week");
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Helper function to format task dates for display
  const formatTaskDate = (task: Task) => {
    const taskDate = new Date(task.scheduledDate);
    return `${getDayAndMonth(task.scheduledDate)} at ${formatTime(task.scheduledDate)}`;
  };
  
  // Filter tasks that match the selected date or date range
  const getFilteredTasks = () => {
    const today = new Date(date);
    today.setHours(0, 0, 0, 0);
    
    let endDate = new Date(date);
    
    if (view === "day") {
      endDate.setHours(23, 59, 59, 999);
    } else if (view === "week") {
      // Calculate end of week (Sunday)
      const dayOfWeek = today.getDay();
      const diff = 6 - dayOfWeek; // Days until end of week (Sunday)
      endDate.setDate(today.getDate() + diff);
      endDate.setHours(23, 59, 59, 999);
      
      // Calculate start of week (Monday)
      const startDiff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Days until start of week (Monday)
      today.setDate(today.getDate() + startDiff);
    } else if (view === "month") {
      endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
      today.setDate(1); // First day of month
    }
    
    return tasks.filter(task => {
      const taskDate = new Date(task.scheduledDate);
      return taskDate >= today && taskDate <= endDate;
    }).sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime());
  };
  
  const filteredTasks = getFilteredTasks();
  
  const handleNewTask = () => {
    toast({
      title: "Coming Soon",
      description: "New task creation will be available in the next update.",
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground">Schedule and view all drone operations.</p>
        </div>
        <Button onClick={handleNewTask}>New Task</Button>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/3">
          <Card>
            <CardContent className="p-0">
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={(date) => date && setDate(date)}
                className="rounded-md border shadow-sm p-3"
              />
            </CardContent>
          </Card>
          
          <div className="mt-4">
            <Select value={view} onValueChange={(v) => setView(v as "day" | "week" | "month")}>
              <SelectTrigger>
                <SelectValue placeholder="View" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Day View</SelectItem>
                <SelectItem value="week">Week View</SelectItem>
                <SelectItem value="month">Month View</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="lg:w-2/3">
          <Card>
            <CardHeader>
              <CardTitle>
                {view === "day" ? `Tasks for ${date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}` : 
                 view === "week" ? `Tasks for Week of ${date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}` : 
                 `Tasks for ${date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`}
              </CardTitle>
            </CardHeader>
            <CardContent className="max-h-[500px] overflow-y-auto">
              {filteredTasks.length > 0 ? (
                <div className="space-y-4">
                  {filteredTasks.map(task => (
                    <div 
                      key={task.id} 
                      className="border rounded-md p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => navigate(`/tasks/${task.id}`)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{task.title}</h3>
                          <p className="text-sm text-muted-foreground">{task.fieldName}</p>
                          <p className="text-sm mt-1">{formatTaskDate(task)}</p>
                        </div>
                        <StatusBadge status={task.status} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground">No tasks scheduled for this period</p>
                  <Button variant="outline" className="mt-2" onClick={handleNewTask}>
                    Create Task
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
