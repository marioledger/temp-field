
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Settings, Calculator as CalcIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

type CalculationType = 'spray' | 'seed';

interface Preset {
  id: string;
  name: string;
  type: CalculationType;
  rate: number;
  droneId?: string;
  pricePerUnit: number;
}

// Mock data - this would come from Supabase in a real implementation
const mockPresets: Preset[] = [
  { id: '1', name: 'Corn Seeding', type: 'seed', rate: 2.5, droneId: 'drone1', pricePerUnit: 15 },
  { id: '2', name: 'Pesticide Spray', type: 'spray', rate: 1.8, droneId: 'drone2', pricePerUnit: 8 },
];

const mockDrones = [
  { id: 'drone1', name: 'DJI Agras T10', maxSprayRate: 2.4, maxSeedRate: 3 },
  { id: 'drone2', name: 'DJI Agras T30', maxSprayRate: 4.0, maxSeedRate: 5 },
];

const Calculator = () => {
  const [calculationType, setCalculationType] = useState<CalculationType>('spray');
  const [area, setArea] = useState<number>(0);
  const [rate, setRate] = useState<number>(0);
  const [selectedDrone, setSelectedDrone] = useState<string>('');
  const [selectedPreset, setSelectedPreset] = useState<string>('');
  const [result, setResult] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  const handleCalculate = () => {
    const total = area * rate;
    setResult(total);
    
    const preset = mockPresets.find(p => p.id === selectedPreset);
    if (preset) {
      setTotalPrice(total * preset.pricePerUnit);
    }
  };

  const handlePresetSelect = (presetId: string) => {
    const preset = mockPresets.find(p => p.id === presetId);
    if (preset) {
      setSelectedPreset(presetId);
      setCalculationType(preset.type);
      setRate(preset.rate);
      if (preset.droneId) {
        setSelectedDrone(preset.droneId);
      }
    }
  };

  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Field Calculator</h1>
            <p className="text-muted-foreground">Calculate spraying and seeding requirements.</p>
          </div>

          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <Label>Calculation Type</Label>
                <Select 
                  value={calculationType} 
                  onValueChange={(value: CalculationType) => setCalculationType(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select calculation type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="spray">Spraying Calculator</SelectItem>
                    <SelectItem value="seed">Seeding Calculator</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Select Drone</Label>
                <Select 
                  value={selectedDrone} 
                  onValueChange={setSelectedDrone}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select drone" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockDrones.map(drone => (
                      <SelectItem key={drone.id} value={drone.id}>
                        {drone.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Field Area (dunums)</Label>
                <Input 
                  type="number" 
                  value={area}
                  onChange={(e) => setArea(Number(e.target.value))}
                  placeholder="Enter field area in dunums"
                />
              </div>

              <div>
                <Label>
                  {calculationType === 'spray' ? 'Spray Rate (liters/dunum)' : 'Seed Rate (kg/dunum)'}
                </Label>
                <Input 
                  type="number" 
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                  placeholder={`Enter ${calculationType === 'spray' ? 'spray' : 'seed'} rate`}
                />
              </div>

              <Button onClick={handleCalculate} className="w-full">
                Calculate
              </Button>

              {result > 0 && (
                <div className="pt-4 space-y-2">
                  <div className="text-center">
                    <p className="text-lg font-medium">Required Amount:</p>
                    <p className="text-2xl font-bold text-primary">
                      {result} {calculationType === 'spray' ? 'liters' : 'kg'}
                    </p>
                  </div>
                  {totalPrice > 0 && (
                    <div className="text-center">
                      <p className="text-lg font-medium">Estimated Price:</p>
                      <p className="text-2xl font-bold text-green-600">
                        ${totalPrice.toFixed(2)}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Presets</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Manage Presets</DialogTitle>
              </DialogHeader>
              <div className="text-sm text-muted-foreground">
                Preset management will be available after connecting to Supabase.
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="p-4">
          <div className="space-y-2">
            {mockPresets.map((preset) => (
              <Button
                key={preset.id}
                variant={selectedPreset === preset.id ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => handlePresetSelect(preset.id)}
              >
                <CalcIcon className="mr-2 h-4 w-4" />
                <div className="flex flex-col items-start text-left">
                  <span>{preset.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {preset.rate} {preset.type === 'spray' ? 'L/dunum' : 'kg/dunum'}
                  </span>
                </div>
              </Button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Calculator;
