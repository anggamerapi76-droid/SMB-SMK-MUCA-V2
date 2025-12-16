export enum UserRole {
  PUBLIC = 'PUBLIC',
  ADMIN = 'ADMIN',
  MECHANIC = 'MECHANIC',
  CASHIER = 'CASHIER',
  SA = 'SA' // Service Advisor / Frontman
}

export enum ServiceStatus {
  QUEUED = 'Menunggu',
  IN_PROGRESS = 'Sedang Dikerjakan',
  COMPLETED = 'Selesai',
  PAID = 'Lunas/Diambil'
}

export interface Mechanic {
  id: string;
  name: string;
  isAvailable: boolean;
  specialty: 'TKRO' | 'TBSM' | 'GENERAL';
  rating: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'TKRO' | 'TBSM' | 'MART'; // TKRO = Auto, TBSM = Moto, MART = Food/Drink
  price: number;
  stock: number;
  sku: string;
}

export interface ServiceRecord {
  id: string; // Unique Service Code
  customerName: string;
  licensePlate: string;
  vehicleType: string;
  problemDescription: string;
  mechanicId: string | null;
  status: ServiceStatus;
  entryTime: string;
  estimatedPickup?: string;
  itemsUsed: { itemId: string; quantity: number }[];
  totalCost: number;
  laborCost?: number;
  transactionId?: string;
  paymentDate?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}