import { InventoryItem, Mechanic, ServiceRecord, ServiceStatus } from './types';

export const MOCK_MECHANICS: Mechanic[] = [
  { id: 'M01', name: 'Ahmad (Siswa TKRO)', isAvailable: true, specialty: 'TKRO', rating: 4.8 },
  { id: 'M02', name: 'Budi (Siswa TBSM)', isAvailable: false, specialty: 'TBSM', rating: 4.5 },
  { id: 'M03', name: 'Pak Cahyo (Instruktur)', isAvailable: true, specialty: 'GENERAL', rating: 5.0 },
  { id: 'M04', name: 'Dani (Siswa TKRO)', isAvailable: true, specialty: 'TKRO', rating: 4.2 },
];

export const MOCK_INVENTORY: InventoryItem[] = [
  // TKRO
  { id: 'I01', name: 'Oli Mesin 4L (Mobil)', category: 'TKRO', price: 350000, stock: 20, sku: 'TKRO-OIL-01' },
  { id: 'I02', name: 'Filter Oli Avanza', category: 'TKRO', price: 45000, stock: 15, sku: 'TKRO-FIL-01' },
  // TBSM
  { id: 'I03', name: 'Oli Mesin 0.8L (Motor)', category: 'TBSM', price: 55000, stock: 50, sku: 'TBSM-OIL-01' },
  { id: 'I04', name: 'Kampas Rem Depan Vario', category: 'TBSM', price: 75000, stock: 30, sku: 'TBSM-BRK-01' },
  // MART
  { id: 'I05', name: 'Air Mineral Muhammadiyah', category: 'MART', price: 3000, stock: 100, sku: 'MART-DRK-01' },
  { id: 'I06', name: 'Roti Bakar TEFA', category: 'MART', price: 12000, stock: 10, sku: 'MART-FD-01' },
];

export const INITIAL_SERVICES: ServiceRecord[] = [
  {
    id: 'SRV-2023-001',
    customerName: 'Pak Eko',
    licensePlate: 'AB 1234 XY',
    vehicleType: 'Toyota Avanza',
    problemDescription: 'Ganti Oli dan Service Berkala',
    mechanicId: 'M02',
    status: ServiceStatus.IN_PROGRESS,
    entryTime: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    itemsUsed: [],
    totalCost: 0
  },
  {
    id: 'SRV-2023-002',
    customerName: 'Bu Siti',
    licensePlate: 'AB 5678 CD',
    vehicleType: 'Honda Vario',
    problemDescription: 'Rem bunyi',
    mechanicId: 'M01',
    status: ServiceStatus.COMPLETED,
    entryTime: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    estimatedPickup: 'Segera',
    itemsUsed: [{ itemId: 'I04', quantity: 1 }],
    totalCost: 75000 + 25000 // Item + Jasa mock
  }
];
