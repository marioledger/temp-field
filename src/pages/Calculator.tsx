
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

type CalculationType = 'spray' | 'seed';

const Calculator = () => {
  const [calculationType, setCalculationType] = useState<CalculationType>('spray');
  const [area, setArea] = useState<number>(0);
  const [rate, setRate] = useState<number>(0);
  const [result, setResult] = useState<number>(0);

  const handleCalculate = () => {
    const total = area * rate;
    setResult(total);
  };

  return (
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
            <div className="pt-4 text-center">
              <p className="text-lg font-medium">You need:</p>
              <p className="text-2xl font-bold text-primary">
                {result} {calculationType === 'spray' ? 'liters' : 'kg'}
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Calculator;
