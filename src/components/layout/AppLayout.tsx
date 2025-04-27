
import React from "react";
import { Outlet } from "react-router-dom";
import AppSidebar from "./AppSidebar";

const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex w-full">
      <AppSidebar />
      <div className="flex-1 overflow-auto p-4 md:p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default AppLayout;
