
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Calendar from "./pages/Calendar";
import Fields from "./pages/Fields";
import Tasks from "./pages/Tasks";
import Drones from "./pages/Drones";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import FieldDetail from "./pages/FieldDetail";
import TaskDetail from "./pages/TaskDetail";
import DroneDetail from "./pages/DroneDetail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="fields" element={<Fields />} />
            <Route path="fields/:id" element={<FieldDetail />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="tasks/:id" element={<TaskDetail />} />
            <Route path="drones" element={<Drones />} />
            <Route path="drones/:id" element={<DroneDetail />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
