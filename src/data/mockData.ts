export interface Field {
  id: string;
  name: string;
  area: number; // in dunums
  cropType: string;
  lastOperation?: string;
  location?: string;
  image?: string;
  tasksPending: number;
  client: {
    name: string;
    phone?: string;
  };
}

export interface Drone {
  id: string;
  name: string;
  model: string;
  status: 'available' | 'in-use' | 'maintenance';
  battery: number; // percentage
  lastMaintenance: string;
  nextMaintenance: string;
  flightHours: number;
}

export type TaskType = 'spraying' | 'seeding' | 'scouting' | 'border' | 'other';
export type TaskStatus = 'planned' | 'progress' | 'completed' | 'cancelled';

export interface Task {
  id: string;
  title: string;
  type: TaskType;
  fieldId: string;
  fieldName: string;
  droneId: string;
  droneName: string;
  scheduledDate: string;
  status: TaskStatus;
  notes?: string;
  completedDate?: string;
  areaCompleted?: number;
  priority: 'low' | 'medium' | 'high';
  recurrence?: 'none' | 'daily' | 'weekly' | 'monthly';
}

// Mock data for fields
export const fields: Field[] = [
  {
    id: "field1",
    name: "North Wheat Field",
    area: 452, // Converted from 45.2 ha to dunums
    cropType: "Wheat",
    lastOperation: "2025-04-20",
    location: "North Section",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000",
    tasksPending: 3,
    client: {
      name: "Farmer Emir Kovačević",
      phone: "+387 61 234 567"
    }
  },
  {
    id: "field2",
    name: "South Corn Field",
    area: 328, // Converted from 32.8 ha to dunums
    cropType: "Corn",
    lastOperation: "2025-04-22",
    location: "South Section",
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=1000",
    tasksPending: 1,
    client: {
      name: "Farmer Amira Hodžić",
      phone: "+387 62 345 678"
    }
  },
  {
    id: "field3",
    name: "East Soybean Field",
    area: 285, // Converted from 28.5 ha to dunums
    cropType: "Soybeans",
    lastOperation: "2025-04-15",
    location: "East Section",
    image: "https://images.unsplash.com/photo-1587167647045-5e0d84343a23?q=80&w=1000",
    tasksPending: 2,
    client: {
      name: "Farmer Senad Mehić"
    }
  },
  {
    id: "field4",
    name: "West Potato Field",
    area: 183, // Converted from 18.3 ha to dunums
    cropType: "Potatoes",
    lastOperation: "2025-04-10",
    location: "West Section",
    image: "https://images.unsplash.com/photo-1597105263434-01b8794efea7?q=80&w=1000",
    tasksPending: 0,
    client: {
      name: "Farmer Ibrahim Selimović",
      phone: "+387 63 456 789"
    }
  },
  {
    id: "field5",
    name: "Central Barley Field",
    area: 227, // Converted from 22.7 ha to dunums
    cropType: "Barley",
    lastOperation: "2025-04-18",
    location: "Central Section",
    image: "https://images.unsplash.com/photo-1536703458557-4733312fb408?q=80&w=1000",
    tasksPending: 2,
    client: {
      name: "Farmer Fatima Begić",
      phone: "+387 64 567 890"
    }
  }
];

// Mock data for drones
export const drones: Drone[] = [
  {
    id: "drone1",
    name: "Falcon-1",
    model: "DJI T-50",
    status: "available",
    battery: 95,
    lastMaintenance: "2025-04-15",
    nextMaintenance: "2025-05-15",
    flightHours: 120.5,
  },
  {
    id: "drone2",
    name: "Eagle-2",
    model: "DJI T-50",
    status: "in-use",
    battery: 68,
    lastMaintenance: "2025-04-10",
    nextMaintenance: "2025-05-10",
    flightHours: 210.2,
  },
  {
    id: "drone3",
    name: "Hawk-3",
    model: "DJI T-50",
    status: "maintenance",
    battery: 100,
    lastMaintenance: "2025-04-25",
    nextMaintenance: "2025-05-25",
    flightHours: 95.8,
  },
  {
    id: "drone4",
    name: "Osprey-4",
    model: "DJI T-50",
    status: "available",
    battery: 88,
    lastMaintenance: "2025-04-05",
    nextMaintenance: "2025-05-05",
    flightHours: 150.0,
  },
];

// Mock data for tasks
export const tasks: Task[] = [
  {
    id: "task1",
    title: "Herbicide Application",
    type: "spraying",
    fieldId: "field1",
    fieldName: "North Wheat Field",
    droneId: "drone1",
    droneName: "Falcon-1",
    scheduledDate: "2025-04-28T10:00:00",
    status: "planned",
    notes: "Apply post-emergence herbicide across entire field",
    priority: "high",
    recurrence: "none",
  },
  {
    id: "task2",
    title: "Corn Seeding",
    type: "seeding",
    fieldId: "field2",
    fieldName: "South Corn Field",
    droneId: "drone4",
    droneName: "Osprey-4",
    scheduledDate: "2025-04-27T09:00:00",
    status: "progress",
    notes: "Plant new corn varieties in rows 15-30",
    priority: "high",
    recurrence: "none",
  },
  {
    id: "task3",
    title: "Weekly Scouting",
    type: "scouting",
    fieldId: "field3",
    fieldName: "East Soybean Field",
    droneId: "drone1",
    droneName: "Falcon-1",
    scheduledDate: "2025-04-29T14:00:00",
    status: "planned",
    notes: "Check for signs of aphid infestation",
    priority: "medium",
    recurrence: "weekly",
  },
  {
    id: "task4",
    title: "Border Mapping",
    type: "border",
    fieldId: "field4",
    fieldName: "West Potato Field",
    droneId: "drone2",
    droneName: "Eagle-2",
    scheduledDate: "2025-04-26T13:00:00",
    status: "completed",
    completedDate: "2025-04-26T15:30:00",
    areaCompleted: 18.3,
    notes: "Map field boundaries for precision application",
    priority: "low",
    recurrence: "none",
  },
  {
    id: "task5",
    title: "Fertilizer Application",
    type: "spraying",
    fieldId: "field5",
    fieldName: "Central Barley Field",
    droneId: "drone4",
    droneName: "Osprey-4",
    scheduledDate: "2025-04-30T11:00:00",
    status: "planned",
    notes: "Apply liquid nitrogen fertilizer at recommended rate",
    priority: "medium",
    recurrence: "none",
  },
  {
    id: "task6",
    title: "Disease Monitoring",
    type: "scouting",
    fieldId: "field1",
    fieldName: "North Wheat Field",
    droneId: "drone1",
    droneName: "Falcon-1",
    scheduledDate: "2025-05-01T10:00:00",
    status: "planned",
    notes: "Check for signs of rust or mildew",
    priority: "medium",
    recurrence: "weekly",
  },
  {
    id: "task7",
    title: "Emergency Pest Control",
    type: "spraying",
    fieldId: "field2",
    fieldName: "South Corn Field",
    droneId: "drone2",
    droneName: "Eagle-2",
    scheduledDate: "2025-04-25T08:00:00",
    status: "completed",
    completedDate: "2025-04-25T10:15:00",
    areaCompleted: 32.8,
    notes: "Applied insecticide to control corn borer outbreak",
    priority: "high",
    recurrence: "none",
  },
];

// Helper function to get upcoming tasks (next 7 days)
export const getUpcomingTasks = () => {
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);
  
  return tasks.filter(task => {
    const taskDate = new Date(task.scheduledDate);
    return taskDate >= today && taskDate <= nextWeek && task.status !== 'completed' && task.status !== 'cancelled';
  });
};

// Helper function to get tasks by status
export const getTasksByStatus = (status: TaskStatus) => {
  return tasks.filter(task => task.status === status);
};

// Helper function to get tasks by field
export const getTasksByField = (fieldId: string) => {
  return tasks.filter(task => task.fieldId === fieldId);
};

// Helper function to get tasks by drone
export const getTasksByDrone = (droneId: string) => {
  return tasks.filter(task => task.droneId === droneId);
};

// Helper function to get field by ID
export const getFieldById = (id: string) => {
  return fields.find(field => field.id === id);
};

// Helper function to get drone by ID
export const getDroneById = (id: string) => {
  return drones.find(drone => drone.id === id);
};

// Helper function to get task by ID
export const getTaskById = (id: string) => {
  return tasks.find(task => task.id === id);
};

// Business summary data
export const businessSummary = {
  totalFields: fields.length,
  totalDrones: drones.length,
  totalTasks: tasks.length,
  tasksCompleted: tasks.filter(task => task.status === 'completed').length,
  tasksInProgress: tasks.filter(task => task.status === 'progress').length,
  tasksPlanned: tasks.filter(task => task.status === 'planned').length,
  dronesAvailable: drones.filter(drone => drone.status === 'available').length,
  dronesInUse: drones.filter(drone => drone.status === 'in-use').length,
  dronesInMaintenance: drones.filter(drone => drone.status === 'maintenance').length,
};
