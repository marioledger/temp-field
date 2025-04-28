export interface Field {
  id: string;
  name: string;
  area: number; // in dunums
  cropType: string;
  lastOperation?: string;
  location?: string;
  coordinates?: string; // Adding the missing coordinates property
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
  client?: {
    name: string;
    phone?: string;
  };
}

// Payment and invoice related interfaces
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
export type PaymentMethod = 'cash' | 'bank_transfer' | 'credit_card' | 'check';

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taskId?: string;
  fieldId?: string;
}

export interface Invoice {
  id: string;
  clientId: string;
  clientName: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  notes?: string;
}

export interface Payment {
  id: string;
  invoiceId: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  date: string;
  amount: number;
  method: PaymentMethod;
  reference?: string;
  notes?: string;
}

export interface BillingSchedule {
  id: string;
  clientId: string;
  clientName: string;
  fieldId: string;
  fieldName: string;
  serviceName: string;
  frequency: 'one-time' | 'weekly' | 'bi-weekly' | 'monthly' | 'quarterly' | 'yearly';
  amount: number;
  nextBillingDate: string;
  active: boolean;
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
    coordinates: "43.8563°N, 18.4131°E",
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
    coordinates: "43.8201°N, 18.4100°E",
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
    coordinates: "43.8455°N, 18.4431°E",
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
    coordinates: "43.8455°N, 18.3831°E",
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
    coordinates: "43.8355°N, 18.4031°E",
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
    client: {
      name: "Farmer Emir Kovačević",
      phone: "+387 61 234 567"
    }
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
    client: {
      name: "Farmer Amira Hodžić",
      phone: "+387 62 345 678"
    }
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
    client: {
      name: "Farmer Senad Mehić"
    }
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
    client: {
      name: "Farmer Ibrahim Selimović",
      phone: "+387 63 456 789"
    }
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
    client: {
      name: "Farmer Fatima Begić",
      phone: "+387 64 567 890"
    }
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
    client: {
      name: "Farmer Emir Kovačević",
      phone: "+387 61 234 567"
    }
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
    client: {
      name: "Farmer Amira Hodžić",
      phone: "+387 62 345 678"
    }
  },
];

// Mock data for invoices
export const invoices: Invoice[] = [
  {
    id: "inv1",
    clientId: "client1",
    clientName: "Farmer Emir Kovačević",
    invoiceNumber: "INV-2025-001",
    issueDate: "2025-04-15",
    dueDate: "2025-04-30",
    status: "sent",
    items: [
      {
        id: "item1",
        description: "Herbicide Application - North Wheat Field",
        quantity: 1,
        unitPrice: 1500,
        taskId: "task1",
        fieldId: "field1"
      },
      {
        id: "item2",
        description: "Disease Monitoring Service - North Wheat Field",
        quantity: 2,
        unitPrice: 500,
        taskId: "task6",
        fieldId: "field1"
      }
    ],
    subtotal: 2500,
    taxRate: 17,
    taxAmount: 425,
    total: 2925,
    notes: "Payment due within 15 days."
  },
  {
    id: "inv2",
    clientId: "client2",
    clientName: "Farmer Amira Hodžić",
    invoiceNumber: "INV-2025-002",
    issueDate: "2025-04-20",
    dueDate: "2025-05-05",
    status: "paid",
    items: [
      {
        id: "item3",
        description: "Emergency Pest Control - South Corn Field",
        quantity: 1,
        unitPrice: 2000,
        taskId: "task7",
        fieldId: "field2"
      },
      {
        id: "item4",
        description: "Corn Seeding Service - South Corn Field",
        quantity: 1,
        unitPrice: 3500,
        taskId: "task2",
        fieldId: "field2"
      }
    ],
    subtotal: 5500,
    taxRate: 17,
    taxAmount: 935,
    total: 6435,
    notes: "Thank you for your prompt payment!"
  },
  {
    id: "inv3",
    clientId: "client3",
    clientName: "Farmer Senad Mehić",
    invoiceNumber: "INV-2025-003",
    issueDate: "2025-04-22",
    dueDate: "2025-05-07",
    status: "draft",
    items: [
      {
        id: "item5",
        description: "Weekly Scouting - East Soybean Field",
        quantity: 4,
        unitPrice: 350,
        taskId: "task3",
        fieldId: "field3"
      }
    ],
    subtotal: 1400,
    taxRate: 17,
    taxAmount: 238,
    total: 1638,
    notes: "Monthly scouting service."
  },
  {
    id: "inv4",
    clientId: "client4",
    clientName: "Farmer Ibrahim Selimović",
    invoiceNumber: "INV-2025-004",
    issueDate: "2025-04-01",
    dueDate: "2025-04-16",
    status: "overdue",
    items: [
      {
        id: "item6",
        description: "Border Mapping Service - West Potato Field",
        quantity: 1,
        unitPrice: 1200,
        taskId: "task4",
        fieldId: "field4"
      }
    ],
    subtotal: 1200,
    taxRate: 17,
    taxAmount: 204,
    total: 1404,
    notes: "Payment is overdue. Please remit as soon as possible."
  }
];

// Mock data for payments
export const payments: Payment[] = [
  {
    id: "pay1",
    invoiceId: "inv2",
    invoiceNumber: "INV-2025-002",
    clientId: "client2",
    clientName: "Farmer Amira Hodžić",
    date: "2025-04-25",
    amount: 6435,
    method: "bank_transfer",
    reference: "TRF25042025",
    notes: "Paid in full via bank transfer."
  },
  {
    id: "pay2",
    invoiceId: "inv1",
    invoiceNumber: "INV-2025-001",
    clientId: "client1",
    clientName: "Farmer Emir Kovačević",
    date: "2025-04-20",
    amount: 1500,
    method: "cash",
    notes: "Partial payment received."
  }
];

// Mock data for billing schedules
export const billingSchedules: BillingSchedule[] = [
  {
    id: "sched1",
    clientId: "client1",
    clientName: "Farmer Emir Kovačević",
    fieldId: "field1",
    fieldName: "North Wheat Field",
    serviceName: "Weekly Disease Monitoring",
    frequency: "weekly",
    amount: 500,
    nextBillingDate: "2025-05-01",
    active: true
  },
  {
    id: "sched2",
    clientId: "client2",
    clientName: "Farmer Amira Hodžić",
    fieldId: "field2",
    fieldName: "South Corn Field",
    serviceName: "Monthly Pest Control",
    frequency: "monthly",
    amount: 2000,
    nextBillingDate: "2025-05-25",
    active: true
  },
  {
    id: "sched3",
    clientId: "client3",
    clientName: "Farmer Senad Mehić",
    fieldId: "field3",
    fieldName: "East Soybean Field",
    serviceName: "Weekly Scouting Service",
    frequency: "weekly",
    amount: 350,
    nextBillingDate: "2025-04-29",
    active: true
  },
  {
    id: "sched4",
    clientId: "client5",
    clientName: "Farmer Fatima Begić",
    fieldId: "field5",
    fieldName: "Central Barley Field",
    serviceName: "Quarterly Field Assessment",
    frequency: "quarterly",
    amount: 3000,
    nextBillingDate: "2025-06-18",
    active: true
  }
];

// Helper functions for payment and invoicing
export const getInvoiceById = (id: string) => {
  return invoices.find(invoice => invoice.id === id);
};

export const getInvoicesByStatus = (status: InvoiceStatus) => {
  return invoices.filter(invoice => invoice.status === status);
};

export const getInvoicesByClient = (clientId: string) => {
  return invoices.filter(invoice => invoice.clientId === clientId);
};

export const getPaymentsByInvoice = (invoiceId: string) => {
  return payments.filter(payment => payment.invoiceId === invoiceId);
};

export const getPaymentsByClient = (clientId: string) => {
  return payments.filter(payment => payment.clientId === clientId);
};

export const getUpcomingBillings = (daysAhead: number = 7) => {
  const today = new Date();
  const futureDate = new Date(today);
  futureDate.setDate(today.getDate() + daysAhead);
  
  return billingSchedules.filter(schedule => {
    const billingDate = new Date(schedule.nextBillingDate);
    return schedule.active && billingDate >= today && billingDate <= futureDate;
  });
};

export const getInvoiceTotal = () => {
  return invoices.reduce((sum, invoice) => sum + invoice.total, 0);
};

export const getPaidTotal = () => {
  return payments.reduce((sum, payment) => sum + payment.amount, 0);
};

export const getOutstandingTotal = () => {
  return getInvoiceTotal() - getPaidTotal();
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
