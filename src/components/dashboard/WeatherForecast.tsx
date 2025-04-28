
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sun, Cloud, CloudRain, Wind, Droplets, CloudLightning, CloudFog } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface WeatherDay {
  date: string;
  day: string;
  condition: "sunny" | "cloudy" | "rainy" | "stormy" | "foggy";
  temperature: number;
  windSpeed: number;
  humidity: number;
  precipitation: number;
  flightStatus: "optimal" | "acceptable" | "cautious" | "not-recommended";
}

// Mock weather data
const weatherForecast: WeatherDay[] = [
  {
    date: "2025-04-28",
    day: "Today",
    condition: "sunny",
    temperature: 22,
    windSpeed: 8,
    humidity: 45,
    precipitation: 0,
    flightStatus: "optimal"
  },
  {
    date: "2025-04-29",
    day: "Tomorrow",
    condition: "cloudy",
    temperature: 19,
    windSpeed: 12,
    humidity: 65,
    precipitation: 10,
    flightStatus: "acceptable"
  },
  {
    date: "2025-04-30",
    day: "Wednesday",
    condition: "cloudy",
    temperature: 18,
    windSpeed: 15,
    humidity: 70,
    precipitation: 30,
    flightStatus: "cautious"
  },
  {
    date: "2025-05-01",
    day: "Thursday",
    condition: "rainy",
    temperature: 16,
    windSpeed: 25,
    humidity: 85,
    precipitation: 75,
    flightStatus: "not-recommended"
  },
  {
    date: "2025-05-02",
    day: "Friday",
    condition: "stormy",
    temperature: 15,
    windSpeed: 35,
    humidity: 90,
    precipitation: 90,
    flightStatus: "not-recommended"
  },
  {
    date: "2025-05-03",
    day: "Saturday",
    condition: "rainy",
    temperature: 17,
    windSpeed: 20,
    humidity: 80,
    precipitation: 60,
    flightStatus: "not-recommended"
  },
  {
    date: "2025-05-04",
    day: "Sunday",
    condition: "cloudy",
    temperature: 20,
    windSpeed: 10,
    humidity: 60,
    precipitation: 20,
    flightStatus: "acceptable"
  }
];

const WeatherIcon: React.FC<{ condition: string; className?: string }> = ({ condition, className }) => {
  switch (condition) {
    case "sunny":
      return <Sun className={className} />;
    case "cloudy":
      return <Cloud className={className} />;
    case "rainy":
      return <CloudRain className={className} />;
    case "stormy":
      return <CloudLightning className={className} />;
    case "foggy":
      return <CloudFog className={className} />;
    default:
      return <Sun className={className} />;
  }
};

const FlightStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  let bgColor = "";
  let textColor = "";
  
  switch (status) {
    case "optimal":
      bgColor = "bg-green-100";
      textColor = "text-green-800";
      break;
    case "acceptable":
      bgColor = "bg-blue-100";
      textColor = "text-blue-800";
      break;
    case "cautious":
      bgColor = "bg-amber-100";
      textColor = "text-amber-800";
      break;
    case "not-recommended":
      bgColor = "bg-red-100";
      textColor = "text-red-800";
      break;
    default:
      bgColor = "bg-gray-100";
      textColor = "text-gray-800";
  }
  
  return (
    <div className={`px-3 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
      {status === "not-recommended" ? "Not Recommended" : status.charAt(0).toUpperCase() + status.slice(1)}
    </div>
  );
};

const WeatherForecast: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("forecast");
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Weather & Flight Conditions</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-full mb-4">
            <TabsTrigger value="forecast">7-Day Forecast</TabsTrigger>
            <TabsTrigger value="flight">Flight Advisory</TabsTrigger>
          </TabsList>
          
          <TabsContent value="forecast">
            <div className="grid grid-cols-7 gap-1">
              {weatherForecast.map((day) => (
                <div 
                  key={day.date} 
                  className="flex flex-col items-center p-2 text-center"
                >
                  <span className="text-sm font-medium">{day.day}</span>
                  <WeatherIcon condition={day.condition} className="h-7 w-7 my-2" />
                  <span className="font-bold">{day.temperature}°C</span>
                  <div className="text-xs text-muted-foreground">
                    <div className="flex items-center justify-center mt-1">
                      <Wind className="h-3 w-3 mr-1" />
                      <span>{day.windSpeed} km/h</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="flight">
            <div className="space-y-2">
              {weatherForecast.map((day) => (
                <div 
                  key={day.date}
                  className="flex items-center justify-between p-2 rounded-lg border"
                >
                  <div className="flex items-center">
                    <WeatherIcon condition={day.condition} className="h-5 w-5 mr-3" />
                    <div>
                      <div className="font-medium">{day.day}</div>
                      <div className="text-xs text-muted-foreground">
                        {day.temperature}°C, Wind: {day.windSpeed} km/h
                      </div>
                    </div>
                  </div>
                  <FlightStatusBadge status={day.flightStatus} />
                </div>
              ))}
              
              <Separator className="my-2" />
              
              <div className="text-xs text-muted-foreground">
                <p>Flight status is based on wind speed, precipitation, and visibility conditions.</p>
                <p>Always perform a site assessment before flight operations.</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default WeatherForecast;
