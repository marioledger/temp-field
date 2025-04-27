
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { tasks, fields } from "@/data/mockData";
import { Map as MapIcon } from "lucide-react";

interface RouteSettings {
  homeBase: string;
  trailerCapacity: number;
}

const RoutePlanner = () => {
  const [settings, setSettings] = useState<RouteSettings>({
    homeBase: '',
    trailerCapacity: 1000 // Default capacity in liters
  });

  const pendingTasks = tasks.filter(task => 
    task.status === 'planned' && 
    (task.type === 'spraying' || task.type === 'seeding')
  );

  const handleSettingsChange = (key: keyof RouteSettings) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSettings(prev => ({
      ...prev,
      [key]: key === 'trailerCapacity' ? Number(e.target.value) : e.target.value
    }));
  };

  const calculateOptimalRoute = () => {
    // This will be implemented in the next iteration
    console.log('Calculating optimal route with settings:', settings);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Route Planner</h1>
        <p className="text-muted-foreground">Plan optimal routes for field operations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Settings Card */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Route Settings</h2>
          <div className="space-y-4">
            <div>
              <Label>Home Base Location</Label>
              <Input
                placeholder="Enter home base address"
                value={settings.homeBase}
                onChange={handleSettingsChange('homeBase')}
              />
            </div>
            <div>
              <Label>Trailer Capacity (L)</Label>
              <Input
                type="number"
                value={settings.trailerCapacity}
                onChange={handleSettingsChange('trailerCapacity')}
                min={0}
              />
            </div>
            <Button 
              onClick={calculateOptimalRoute}
              className="w-full"
            >
              <MapIcon className="mr-2 h-4 w-4" />
              Calculate Route
            </Button>
          </div>
        </Card>

        {/* Pending Tasks */}
        <Card className="p-6 md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Pending Operations</h2>
          <div className="space-y-4">
            {pendingTasks.length > 0 ? (
              pendingTasks.map(task => {
                const field = fields.find(f => f.id === task.fieldId);
                return (
                  <div 
                    key={task.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent"
                  >
                    <div>
                      <h3 className="font-medium">{task.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {field?.name} - {field?.area} ha
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{task.type}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(task.scheduledDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No pending operations found
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RoutePlanner;
