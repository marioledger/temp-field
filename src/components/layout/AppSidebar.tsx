
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Home, 
  Calendar, 
  Map, 
  Plane, 
  ClipboardList,
  Settings,
  Menu,
  Calculator,
  Users,
  Package,
  CreditCard,
  FileText,
  Receipt
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

const AppSidebar: React.FC = () => {
  const location = useLocation();
  const { toast } = useToast();
  const [collapsed, setCollapsed] = React.useState(false);
  
  const navigationItems = [
    { name: "Dashboard", path: "/", icon: Home },
    { name: "Calendar", path: "/calendar", icon: Calendar },
    { name: "Fields", path: "/fields", icon: Map },
    { name: "Calculator", path: "/calculator", icon: Calculator },
    { name: "Tasks", path: "/tasks", icon: ClipboardList },
    { name: "Drones", path: "/drones", icon: Plane },
    { name: "Clients", path: "/clients", icon: Users },
    { name: "Inventory", path: "/inventory", icon: Package },
    { 
      name: "Billing",
      items: [
        { name: "Invoices", path: "/invoices", icon: FileText },
        { name: "Billing Schedules", path: "/billing-schedules", icon: Receipt }
      ]
    },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const showComingSoonToast = (feature: string) => {
    toast({
      title: "Coming Soon",
      description: `The ${feature} feature is coming soon.`,
    });
  };

  return (
    <div 
      className={cn(
        "h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4">
        {!collapsed && (
          <div className="flex items-center">
            <Plane className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-bold ml-2 text-primary">DroneField</h1>
          </div>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          className="ml-auto" 
          onClick={toggleSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>
      
      <Separator className="my-2" />
      
      <nav className="flex-1 px-2 py-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            if ('items' in item) {
              // Render section with subitems
              return (
                <li key={item.name} className="space-y-1">
                  {!collapsed && (
                    <div className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {item.name}
                    </div>
                  )}
                  <ul className="space-y-1">
                    {item.items.map((subItem) => {
                      const isActive = location.pathname === subItem.path;
                      return (
                        <li key={subItem.path}>
                          <Link
                            to={subItem.path}
                            className={cn(
                              "flex items-center px-3 py-2 rounded-md transition-colors",
                              isActive 
                                ? "bg-primary text-primary-foreground"
                                : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                            )}
                          >
                            <subItem.icon className="h-5 w-5" />
                            {!collapsed && <span className="ml-3">{subItem.name}</span>}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              );
            }

            // Render single item
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-md transition-colors",
                    isActive 
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {!collapsed && <span className="ml-3">{item.name}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4">
        <Button 
          className="w-full flex items-center justify-center bg-primary hover:bg-primary/90"
          onClick={() => showComingSoonToast("User Profile")}
        >
          {collapsed ? (
            <span>+</span>
          ) : (
            <span>New Task</span>
          )}
        </Button>
      </div>
    </div>
  );
};

export default AppSidebar;

