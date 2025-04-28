
import React from "react";
import StatsSection from "@/components/dashboard/StatsSection";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { tasks, getUpcomingTasks, fields, drones } from "@/data/mockData";
import TaskCard from "@/components/tasks/TaskCard";
import WeatherForecast from "@/components/dashboard/WeatherForecast";

const Dashboard: React.FC = () => {
  const upcomingTasks = getUpcomingTasks(3); // Get tasks for next 3 days

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Welcome to DroneField</h1>
      
      <StatsSection />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Upcoming Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingTasks.length > 0 ? (
                  upcomingTasks.map(task => (
                    <TaskCard key={task.id} task={task} compact />
                  ))
                ) : (
                  <p className="text-muted-foreground">No upcoming tasks in the next 3 days.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          <WeatherForecast />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Field Status Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {fields.slice(0, 5).map(field => (
                <div key={field.id} className="flex justify-between border-b last:border-0 py-2">
                  <div>
                    <div className="font-medium">{field.name}</div>
                    <div className="text-sm text-muted-foreground">{field.cropType}</div>
                  </div>
                  <div className="text-right">
                    <div>{field.area} dunums</div>
                    <div className="text-sm text-muted-foreground">
                      {field.tasksPending} {field.tasksPending === 1 ? "task" : "tasks"} pending
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Drone Fleet Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {drones.map(drone => (
                <div key={drone.id} className="flex justify-between border-b last:border-0 py-2">
                  <div>
                    <div className="font-medium">{drone.name}</div>
                    <div className="text-sm text-muted-foreground">{drone.model}</div>
                  </div>
                  <div className="text-right">
                    <div>
                      {drone.status === "available" && (
                        <span className="text-green-600 font-medium">Available</span>
                      )}
                      {drone.status === "in-use" && (
                        <span className="text-amber-600 font-medium">In Use</span>
                      )}
                      {drone.status === "maintenance" && (
                        <span className="text-blue-600 font-medium">Maintenance</span>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Battery: {drone.battery}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
