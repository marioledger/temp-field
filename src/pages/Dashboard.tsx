
import React from "react";
import StatsSection from "@/components/dashboard/StatsSection";
import TaskCard from "@/components/tasks/TaskCard";
import FieldCard from "@/components/fields/FieldCard";
import DroneCard from "@/components/drones/DroneCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getUpcomingTasks, fields, drones, tasks } from "@/data/mockData";
import { useNavigate } from "react-router-dom";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const upcomingTasks = getUpcomingTasks();
  
  // Get a few fields, drones, and recent tasks for the overview sections
  const featuredFields = fields.slice(0, 3); 
  const availableDrones = drones.filter(d => d.status === "available").slice(0, 2);
  const recentTasks = [...tasks].sort((a, b) => 
    new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime()
  ).slice(0, 3);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your drone operations.</p>
        </div>
        <Button onClick={() => navigate("/tasks/new")}>New Task</Button>
      </div>
      
      <StatsSection />
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Upcoming Tasks */}
        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle>Upcoming Tasks</CardTitle>
              <Button size="sm" variant="outline" onClick={() => navigate("/tasks")}>View All</Button>
            </div>
            <CardDescription>Tasks scheduled for the next 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {upcomingTasks.length > 0 ? (
                upcomingTasks.slice(0, 4).map(task => (
                  <TaskCard key={task.id} task={task} compact />
                ))
              ) : (
                <p className="text-center py-4 text-muted-foreground">No upcoming tasks</p>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Field Overview */}
        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle>Field Overview</CardTitle>
              <Button size="sm" variant="outline" onClick={() => navigate("/fields")}>View All</Button>
            </div>
            <CardDescription>Quick view of your agricultural fields</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredFields.map(field => (
                <div key={field.id} className="col-span-1">
                  <FieldCard field={field} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Available Drones */}
        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle>Available Drones</CardTitle>
              <Button size="sm" variant="outline" onClick={() => navigate("/drones")}>View All</Button>
            </div>
            <CardDescription>Drones ready for deployment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableDrones.map(drone => (
                <div key={drone.id} className="col-span-1">
                  <DroneCard drone={drone} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Recent Activity */}
        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle>Recent Activity</CardTitle>
              <Button size="sm" variant="outline" onClick={() => navigate("/tasks")}>View History</Button>
            </div>
            <CardDescription>Recently completed or active tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentTasks.map(task => (
                <TaskCard key={task.id} task={task} compact />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
