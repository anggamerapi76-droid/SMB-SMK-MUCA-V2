import React, { useState, useEffect } from 'react';
import { UserRole, ServiceRecord, Mechanic, InventoryItem, ServiceStatus } from './types';
import { INITIAL_SERVICES, MOCK_INVENTORY, MOCK_MECHANICS } from './constants';
import PublicTracking from './components/PublicTracking';
import Layout from './components/Layout';
import ChatBot from './components/ChatBot';
import { Search, Plus, Filter, DollarSign, Check, AlertTriangle, User, RefreshCw, Box, X, Edit, Trash, FileText, Printer, Save, Calendar, Clock, ArrowUpDown, LogIn, Lock } from 'lucide-react';

const App: React.FC = () => {
  const [currentRole, setCurrentRole] = useState<UserRole>(UserRole.PUBLIC);
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  // Simulated Global State
  const [services, setServices] = useState<ServiceRecord[]>(INITIAL_SERVICES);
  const [mechanics, setMechanics] = useState<Mechanic[]>(MOCK_MECHANICS);
  const [inventory, setInventory] = useState<InventoryItem[]>(MOCK_INVENTORY);
  const [notifications, setNotifications] = useState<string[]>([]);

  // Effect to set default view based on role
  useEffect(() => {
    if (currentRole === UserRole.MECHANIC) setActiveView('jobs');
    else if (currentRole === UserRole.CASHIER) setActiveView('pos');
    else if (currentRole === UserRole.SA || currentRole === UserRole.ADMIN) setActiveView('dashboard');
  }, [currentRole]);

  // Helpers
  const addNotification = (msg: string) => {
    setNotifications(prev => [msg, ...prev]);
    setTimeout(() => setNotifications(prev => prev.slice(0, -1)), 5000); // Auto remove after 5s
  };

  const getTitle = () => {
    switch(activeView) {
        case 'dashboard': return 'Dashboard Overview';
        case 'reception': return 'Service Reception & Queue';
        case 'jobs': return 'My Jobs';
        case 'inventory': return 'Inventory Management';
        case 'history': return 'Service History Log';
        case 'pos': return 'Point of Sales (Cashier)';
        default: return 'TEFA Management System';
    }
  };

  // --- LOGIN MODAL COMPONENT ---
  const LoginModal = () => {
      const [password, setPassword] = useState('');
      
      const handleLogin = (role: UserRole) => {
          // Simple simulation, in real app this would be backend auth
          setCurrentRole(role);
          setShowLoginModal(false);
          addNotification(`Welcome back, ${role}!`);
      };

      return (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
                  <div className="bg-blue-900 p-8 text-center relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                      <div className="relative z-10">
                          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-blue-900 font-bold text-3xl mx-auto mb-4 shadow-lg">M</div>
                          <h2 className="text-2xl font-bold text-white">System Login</h2>
                          <p className="text-blue-200 text-sm">SMKS Muhammadiyah Cangkringan</p>
                      </div>
                      <button onClick={() => setShowLoginModal(false)} className="absolute top-4 right-4 text-white/50 hover:text-white"><X size={20}/></button>
                  </div>
                  
                  <div className="p-8">
                      <p className="text-center text-gray-500 mb-6 text-sm">Select your authorized role to access the management panel.</p>
                      
                      <div className="grid grid-cols-2 gap-4">
                          <button onClick={() => handleLogin(UserRole.ADMIN)} className="p-4 rounded-xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all group text-left">
                              <div className="bg-slate-800 w-10 h-10 rounded-lg flex items-center justify-center text-white mb-2 group-hover:scale-110 transition-transform"><Lock size={18}/></div>
                              <span className="font-bold text-slate-800 block">Admin</span>
                              <span className="text-xs text-gray-400">Full Access</span>
                          </button>
                          <button onClick={() => handleLogin(UserRole.SA)} className="p-4 rounded-xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all group text-left">
                              <div className="bg-blue-600 w-10 h-10 rounded-lg flex items-center justify-center text-white mb-2 group-hover:scale-110 transition-transform"><User size={18}/></div>
                              <span className="font-bold text-slate-800 block">Service Advisor</span>
                              <span className="text-xs text-gray-400">Reception & Inv</span>
                          </button>
                          <button onClick={() => handleLogin(UserRole.MECHANIC)} className="p-4 rounded-xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all group text-left">
                              <div className="bg-orange-500 w-10 h-10 rounded-lg flex items-center justify-center text-white mb-2 group-hover:scale-110 transition-transform"><RefreshCw size={18}/></div>
                              <span className="font-bold text-slate-800 block">Mekanik</span>
                              <span className="text-xs text-gray-400">Job Operations</span>
                          </button>
                          <button onClick={() => handleLogin(UserRole.CASHIER)} className="p-4 rounded-xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all group text-left">
                              <div className="bg-emerald-600 w-10 h-10 rounded-lg flex items-center justify-center text-white mb-2 group-hover:scale-110 transition-transform"><DollarSign size={18}/></div>
                              <span className="font-bold text-slate-800 block">Kasir</span>
                              <span className="text-xs text-gray-400">POS & Payment</span>
                          </button>
                      </div>
                  </div>
                  <div className="bg-gray-50 p-4 text-center text-xs text-gray-400">
                      Protected by TEFA Secure System v1.0
                  </div>
              </div>
          </div>
      );
  };

  // --- SUB-COMPONENTS ---

  // 1. Service Advisor View (Frontman)
  const ServiceAdvisorView = () => {
    const [newService, setNewService] = useState({
        customer: '',
        plate: '',
        vehicle: '',
        desc: '',
        mechanicId: ''
    });
    const [editingService, setEditingService] = useState<ServiceRecord | null>(null);

    const handleCreateService = (e: React.FormEvent) => {
        e.preventDefault();
        const id = `SRV-${new Date().getFullYear()}-${String(services.length + 1).padStart(3, '0')}`;
        const service: ServiceRecord = {
            id,
            customerName: newService.customer,
            licensePlate: newService.plate,
            vehicleType: newService.vehicle,
            problemDescription: newService.desc,
            mechanicId: newService.mechanicId || null,
            status: ServiceStatus.QUEUED,
            entryTime: new Date().toISOString(),
            itemsUsed: [],
            totalCost: 0
        };

        setServices(prev => [service, ...prev]);
        
        if (newService.mechanicId) {
            setMechanics(prev => prev.map(m => m.id === newService.mechanicId ? { ...m, isAvailable: false } : m));
            addNotification(`Notifikasi dikirim ke mekanik ${mechanics.find(m => m.id === newService.mechanicId)?.name}`);
        }

        setNewService({ customer: '', plate: '', vehicle: '', desc: '', mechanicId: '' });
        addNotification(`Tiket Service Dibuat: ${id}`);
    };

    const handleUpdateService = (e: React.FormEvent) => {
        e.preventDefault();
        if(!editingService) return;

        setServices(prev => prev.map(s => s.id === editingService.id ? editingService : s));
        
        // Handle mechanic switch if changed
        const oldService = services.find(s => s.id === editingService.id);
        if (oldService && oldService.mechanicId !== editingService.mechanicId) {
             // Free old mechanic if possible (logic simplified)
             if(oldService.mechanicId) {
                setMechanics(prev => prev.map(m => m.id === oldService.mechanicId ? { ...m, isAvailable: true } : m));
             }
             // Occupy new mechanic
             if(editingService.mechanicId) {
                setMechanics(prev => prev.map(m => m.id === editingService.mechanicId ? { ...m, isAvailable: false } : m));
             }
        }

        setEditingService(null);
        addNotification(`Data service ${editingService.id} berhasil diperbarui.`);
    };

    const toggleMechanicStatus = (id: string) => {
        setMechanics(prev => prev.map(m => m.id === id ? { ...m, isAvailable: !m.isAvailable } : m));
        addNotification('Status mekanik diperbarui.');
    };

    return (
        <div className="space-y-8">
            {/* Mechanic Availability Overview */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><User className="text-blue-600"/> Status Mekanik (Live)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {mechanics.map(m => (
                         <div key={m.id} className={`p-4 rounded-lg border flex items-center justify-between ${m.isAvailable ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                             <div>
                                 <p className="font-bold text-sm">{m.name}</p>
                                 <p className="text-xs text-gray-500">{m.specialty}</p>
                             </div>
                             <button 
                                onClick={() => toggleMechanicStatus(m.id)}
                                className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${m.isAvailable ? 'bg-green-200 text-green-800 hover:bg-green-300' : 'bg-red-200 text-red-800 hover:bg-red-300'}`}
                             >
                                 {m.isAvailable ? 'Available' : 'Unavailable'}
                             </button>
                         </div>
                    ))}
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* New Service Form */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Plus className="text-blue-600"/> Pendaftaran Service Baru</h3>
                    <form onSubmit={handleCreateService} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Pemilik</label>
                            <input required type="text" className="w-full border rounded-lg p-2" value={newService.customer} onChange={e => setNewService({...newService, customer: e.target.value})} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Plat Nomor</label>
                                <input required type="text" className="w-full border rounded-lg p-2 uppercase" value={newService.plate} onChange={e => setNewService({...newService, plate: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Kendaraan</label>
                                <input required type="text" placeholder="Mobil/Motor" className="w-full border rounded-lg p-2" value={newService.vehicle} onChange={e => setNewService({...newService, vehicle: e.target.value})} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Keluhan</label>
                            <textarea required className="w-full border rounded-lg p-2" rows={3} value={newService.desc} onChange={e => setNewService({...newService, desc: e.target.value})} />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Mekanik (Opsional)</label>
                            <select 
                                className="w-full border rounded-lg p-2"
                                value={newService.mechanicId}
                                onChange={e => setNewService({...newService, mechanicId: e.target.value})}
                            >
                                <option value="">-- Pilih Mekanik --</option>
                                {mechanics.map(m => (
                                    <option key={m.id} value={m.id} disabled={!m.isAvailable}>
                                        {m.name} {m.isAvailable ? '(Available)' : '(Busy)'}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors">
                            Buat Tiket Service
                        </button>
                    </form>
                </div>

                {/* Active Queue */}
                <div className="space-y-4">
                    <h3 className="text-lg font-bold">Antrian Service Aktif</h3>
                    {services.filter(s => s.status !== ServiceStatus.PAID && s.status !== ServiceStatus.COMPLETED).length === 0 && (
                        <p className="text-gray-400 italic">Tidak ada antrian aktif.</p>
                    )}
                    {services.filter(s => s.status !== ServiceStatus.PAID && s.status !== ServiceStatus.COMPLETED).map(service => (
                        <div key={service.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex justify-between items-start group">
                            <div>
                                <div className="font-bold text-gray-800">{service.customerName} - {service.vehicleType}</div>
                                <div className="text-sm text-gray-500">{service.licensePlate} • {service.id}</div>
                                <div className="mt-1 text-xs text-blue-600">{service.problemDescription}</div>
                                <div className="mt-2 flex items-center gap-2">
                                     <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                                         Mekanik: {mechanics.find(m => m.id === service.mechanicId)?.name || 'Belum ditentukan'}
                                     </span>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                    service.status === ServiceStatus.QUEUED ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-blue-100 text-blue-700'
                                }`}>
                                    {service.status}
                                </span>
                                <button 
                                    onClick={() => setEditingService(service)}
                                    className="text-gray-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Edit size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Edit Modal */}
            {editingService && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up">
                        <div className="bg-gray-50 p-4 border-b flex justify-between items-center">
                            <h3 className="font-bold text-lg">Edit Service {editingService.id}</h3>
                            <button onClick={() => setEditingService(null)}><X className="text-gray-500 hover:text-red-500"/></button>
                        </div>
                        <form onSubmit={handleUpdateService} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Nama Pemilik</label>
                                <input type="text" className="w-full border rounded p-2" value={editingService.customerName} onChange={e => setEditingService({...editingService, customerName: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Kendaraan</label>
                                <input type="text" className="w-full border rounded p-2" value={editingService.vehicleType} onChange={e => setEditingService({...editingService, vehicleType: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Keluhan</label>
                                <textarea className="w-full border rounded p-2" value={editingService.problemDescription} onChange={e => setEditingService({...editingService, problemDescription: e.target.value})} />
                            </div>
                             <div>
                                <label className="block text-sm font-medium mb-1">Mekanik</label>
                                <select 
                                    className="w-full border rounded p-2"
                                    value={editingService.mechanicId || ''}
                                    onChange={e => setEditingService({...editingService, mechanicId: e.target.value})}
                                >
                                    <option value="">-- Pilih Mekanik --</option>
                                    {mechanics.map(m => (
                                        <option key={m.id} value={m.id}>{m.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setEditingService(null)} className="flex-1 bg-gray-100 text-gray-700 py-2 rounded hover:bg-gray-200">Batal</button>
                                <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Simpan Perubahan</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
  };

  // 2. Mechanic View
  const MechanicView = () => {
    const myId = 'M01'; 
    const myJobs = services.filter(s => s.mechanicId === myId && s.status !== ServiceStatus.PAID && s.status !== ServiceStatus.COMPLETED);

    const updateStatus = (serviceId: string, newStatus: ServiceStatus) => {
        setServices(prev => prev.map(s => s.id === serviceId ? { ...s, status: newStatus } : s));
        if (newStatus === ServiceStatus.COMPLETED) {
            setMechanics(prev => prev.map(m => m.id === myId ? { ...m, isAvailable: true } : m));
            addNotification(`Service ${serviceId} selesai. Silakan hubungi Kasir.`);
        }
        if (newStatus === ServiceStatus.IN_PROGRESS) {
             setMechanics(prev => prev.map(m => m.id === myId ? { ...m, isAvailable: false } : m));
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">Daftar Pekerjaan Saya (Mekanik: Ahmad)</h3>
                <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                    <span className="animate-pulse w-2 h-2 bg-green-500 rounded-full"></span> Online
                </div>
            </div>

            {myJobs.length === 0 ? (
                <div className="bg-white p-12 rounded-xl text-center text-gray-400 border border-dashed border-gray-300">
                    <Check className="mx-auto mb-4 w-12 h-12 text-gray-300" />
                    <p>Tidak ada pekerjaan aktif. Istirahat sejenak!</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 gap-6">
                    {myJobs.map(job => (
                        <div key={job.id} className="bg-white border-l-4 border-blue-500 shadow-md rounded-r-xl p-6 relative overflow-hidden">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h4 className="font-bold text-lg">{job.vehicleType}</h4>
                                    <p className="text-gray-500">{job.licensePlate}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-400">Jam Masuk</p>
                                    <p className="font-mono text-sm">{new Date(job.entryTime).toLocaleTimeString()}</p>
                                </div>
                            </div>
                            
                            <div className="bg-blue-50 p-4 rounded-lg mb-6">
                                <p className="text-xs text-blue-600 font-bold uppercase mb-1">Keluhan Pelanggan</p>
                                <p className="text-gray-800">{job.problemDescription}</p>
                            </div>

                            <div className="flex gap-2">
                                {job.status === ServiceStatus.QUEUED && (
                                    <button onClick={() => updateStatus(job.id, ServiceStatus.IN_PROGRESS)} className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                                        Mulai Kerjakan
                                    </button>
                                )}
                                {job.status === ServiceStatus.IN_PROGRESS && (
                                    <button onClick={() => updateStatus(job.id, ServiceStatus.COMPLETED)} className="flex-1 bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700">
                                        Selesai
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
  };

  // 3. Inventory View (Admin/SA)
  const InventoryView = () => {
    const [activeTab, setActiveTab] = useState<'TKRO' | 'TBSM' | 'MART'>('TKRO');
    const [showAddModal, setShowAddModal] = useState(false);
    const [newItem, setNewItem] = useState<Partial<InventoryItem>>({ category: 'TKRO' });

    const handleAddItem = (e: React.FormEvent) => {
        e.preventDefault();
        if(!newItem.name || !newItem.price || !newItem.sku) return;
        
        const item: InventoryItem = {
            id: `I${Date.now()}`,
            name: newItem.name,
            sku: newItem.sku,
            category: newItem.category as any,
            price: Number(newItem.price),
            stock: Number(newItem.stock || 0)
        };
        
        setInventory(prev => [...prev, item]);
        setShowAddModal(false);
        setNewItem({ category: 'TKRO' });
        addNotification("Item inventaris baru berhasil ditambahkan.");
    };
    
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex gap-4">
                    <button onClick={() => setActiveTab('TKRO')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === 'TKRO' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-200'}`}>TKRO</button>
                    <button onClick={() => setActiveTab('TBSM')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === 'TBSM' ? 'bg-emerald-600 text-white' : 'text-gray-600 hover:bg-gray-200'}`}>TBSM</button>
                    <button onClick={() => setActiveTab('MART')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === 'MART' ? 'bg-orange-600 text-white' : 'text-gray-600 hover:bg-gray-200'}`}>TEFA Mart</button>
                </div>
                <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-700">
                    <Plus size={16} /> Tambah Item
                </button>
            </div>
            
            <div className="p-6">
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-gray-400 text-xs uppercase tracking-wider border-b border-gray-100">
                            <th className="pb-3">SKU</th>
                            <th className="pb-3">Nama Barang</th>
                            <th className="pb-3 text-right">Stok</th>
                            <th className="pb-3 text-right">Harga</th>
                            <th className="pb-3 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {inventory.filter(i => i.category === activeTab).map(item => (
                            <tr key={item.id} className="hover:bg-gray-50">
                                <td className="py-4 font-mono text-sm text-gray-500">{item.sku}</td>
                                <td className="py-4 font-medium text-gray-800">{item.name}</td>
                                <td className="py-4 text-right">
                                    <span className={`px-2 py-1 rounded text-xs ${item.stock < 15 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                        {item.stock}
                                    </span>
                                </td>
                                <td className="py-4 text-right text-gray-600">Rp {item.price.toLocaleString('id-ID')}</td>
                                <td className="py-4 text-center">
                                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-fade-in-up">
                         <div className="bg-gray-50 p-4 border-b flex justify-between items-center rounded-t-xl">
                            <h3 className="font-bold text-lg">Tambah Item Baru</h3>
                            <button onClick={() => setShowAddModal(false)}><X className="text-gray-500 hover:text-red-500"/></button>
                        </div>
                        <form onSubmit={handleAddItem} className="p-6 space-y-3">
                             <div>
                                <label className="text-sm font-medium">Kategori</label>
                                <select className="w-full border rounded p-2 mt-1" value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value as any})}>
                                    <option value="TKRO">TKRO (Mobil)</option>
                                    <option value="TBSM">TBSM (Motor)</option>
                                    <option value="MART">Makanan/Minuman</option>
                                </select>
                             </div>
                             <div>
                                 <label className="text-sm font-medium">SKU / Kode Barang</label>
                                 <input required className="w-full border rounded p-2 mt-1" type="text" value={newItem.sku || ''} onChange={e => setNewItem({...newItem, sku: e.target.value})} />
                             </div>
                             <div>
                                 <label className="text-sm font-medium">Nama Barang</label>
                                 <input required className="w-full border rounded p-2 mt-1" type="text" value={newItem.name || ''} onChange={e => setNewItem({...newItem, name: e.target.value})} />
                             </div>
                             <div className="grid grid-cols-2 gap-4">
                                 <div>
                                     <label className="text-sm font-medium">Harga (Rp)</label>
                                     <input required className="w-full border rounded p-2 mt-1" type="number" value={newItem.price || ''} onChange={e => setNewItem({...newItem, price: Number(e.target.value)})} />
                                 </div>
                                 <div>
                                     <label className="text-sm font-medium">Stok Awal</label>
                                     <input required className="w-full border rounded p-2 mt-1" type="number" value={newItem.stock || ''} onChange={e => setNewItem({...newItem, stock: Number(e.target.value)})} />
                                 </div>
                             </div>
                             <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-bold mt-4 hover:bg-blue-700">Simpan Item</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
  };

  // 4. POS View (Cashier/SA)
  const POSView = () => {
    const completedServices = services.filter(s => s.status === ServiceStatus.COMPLETED);
    const [selectedService, setSelectedService] = useState<ServiceRecord | null>(null);
    const [laborCost, setLaborCost] = useState(0);
    const [cartItems, setCartItems] = useState<{item: InventoryItem, qty: number}[]>([]);
    const [itemSearch, setItemSearch] = useState('');

    const handleSelectService = (s: ServiceRecord) => {
        setSelectedService(s);
        setLaborCost(s.laborCost || 0);
        
        // Populate cart with existing items from service
        if (s.itemsUsed && s.itemsUsed.length > 0) {
            const loadedItems = s.itemsUsed.map(used => {
                const invItem = inventory.find(i => i.id === used.itemId);
                if (invItem) return { item: invItem, qty: used.quantity };
                return null;
            }).filter(Boolean) as {item: InventoryItem, qty: number}[];
            setCartItems(loadedItems);
        } else {
            setCartItems([]);
        }
    };

    const addToCart = (item: InventoryItem) => {
        const exist = cartItems.find(c => c.item.id === item.id);
        if (exist) {
            setCartItems(cartItems.map(c => c.item.id === item.id ? { ...c, qty: c.qty + 1 } : c));
        } else {
            setCartItems([...cartItems, { item, qty: 1 }]);
        }
        setItemSearch('');
    };

    const removeFromCart = (itemId: string) => {
        setCartItems(cartItems.filter(c => c.item.id !== itemId));
    };

    const updateCartQty = (itemId: string, newQty: number) => {
        if(newQty <= 0) {
            removeFromCart(itemId);
            return;
        }
        setCartItems(cartItems.map(c => c.item.id === itemId ? { ...c, qty: newQty } : c));
    };

    const calculateTotal = () => {
        const itemsTotal = cartItems.reduce((sum, curr) => sum + (curr.item.price * curr.qty), 0);
        return itemsTotal + laborCost;
    };

    const handleCheckout = () => {
        if (!selectedService) return;
        const total = calculateTotal();
        const transactionId = `TRX-${Date.now()}`;
        
        const updatedService: ServiceRecord = {
            ...selectedService,
            status: ServiceStatus.PAID,
            totalCost: total,
            laborCost: laborCost,
            itemsUsed: cartItems.map(c => ({ itemId: c.item.id, quantity: c.qty })),
            transactionId: transactionId,
            paymentDate: new Date().toISOString()
        };

        setServices(prev => prev.map(s => s.id === selectedService.id ? updatedService : s));
        
        // Decrease stock
        const newInventory = [...inventory];
        cartItems.forEach(cartItem => {
            const invItem = newInventory.find(i => i.id === cartItem.item.id);
            if(invItem) invItem.stock -= cartItem.qty;
        });
        setInventory(newInventory);

        addNotification(`Transaksi berhasil! ID: ${transactionId}`);
        setSelectedService(null);
        setCartItems([]);
        setLaborCost(0);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
            {/* List of Completed Services */}
            <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col h-[calc(100vh-140px)]">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Check className="text-emerald-600" /> Siap Bayar ({completedServices.length})
                </h3>
                <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                    {completedServices.length === 0 && <p className="text-gray-400 text-sm">Tidak ada service yang selesai.</p>}
                    {completedServices.map(s => (
                        <div 
                            key={s.id} 
                            onClick={() => handleSelectService(s)}
                            className={`p-4 rounded-lg border cursor-pointer transition-colors ${selectedService?.id === s.id ? 'bg-blue-50 border-blue-500' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
                        >
                            <div className="flex justify-between items-center mb-1">
                                <span className="font-bold text-gray-800">{s.customerName}</span>
                                <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">Selesai</span>
                            </div>
                            <p className="text-sm text-gray-600">{s.licensePlate} • {s.vehicleType}</p>
                            <p className="text-xs text-gray-400 mt-1">{s.id}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Checkout Area */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-[calc(100vh-140px)]">
                {selectedService ? (
                    <>
                        <div className="p-6 border-b border-gray-200 bg-gray-50 flex justify-between items-start rounded-t-xl">
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">Checkout: {selectedService.customerName}</h2>
                                <p className="text-sm text-gray-600">{selectedService.id} • {selectedService.licensePlate}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-500">Tanggal Masuk</p>
                                <p className="font-medium text-sm">{new Date(selectedService.entryTime).toLocaleDateString()}</p>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {/* Mechanic Report */}
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                <p className="text-sm font-bold text-blue-800 mb-1">Catatan Mekanik / Keluhan</p>
                                <p className="text-gray-700 text-sm">{selectedService.problemDescription}</p>
                            </div>

                            {/* Add Items */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Tambah Suku Cadang / Produk</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input 
                                        type="text"
                                        placeholder="Cari nama barang atau SKU..."
                                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={itemSearch}
                                        onChange={e => setItemSearch(e.target.value)}
                                    />
                                    {itemSearch && (
                                        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 shadow-xl rounded-lg mt-1 max-h-48 overflow-y-auto z-10">
                                            {inventory.filter(i => i.name.toLowerCase().includes(itemSearch.toLowerCase()) || i.sku.toLowerCase().includes(itemSearch.toLowerCase())).map(item => (
                                                <div 
                                                    key={item.id} 
                                                    onClick={() => addToCart(item)}
                                                    className="p-3 hover:bg-gray-50 cursor-pointer flex justify-between items-center border-b last:border-0"
                                                >
                                                    <div>
                                                        <div className="font-medium text-sm">{item.name}</div>
                                                        <div className="text-xs text-gray-500">{item.sku} • Stok: {item.stock}</div>
                                                    </div>
                                                    <div className="text-sm font-bold text-gray-700">Rp {item.price.toLocaleString()}</div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Bill Details */}
                            <table className="w-full">
                                <thead>
                                    <tr className="text-xs text-gray-400 uppercase border-b">
                                        <th className="text-left pb-2">Item</th>
                                        <th className="text-center pb-2">Qty</th>
                                        <th className="text-right pb-2">Harga</th>
                                        <th className="text-right pb-2">Total</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {cartItems.map((c, idx) => (
                                        <tr key={idx}>
                                            <td className="py-3 text-sm">{c.item.name}</td>
                                            <td className="py-3 text-center text-sm">
                                                <input 
                                                    type="number" 
                                                    min="1" 
                                                    value={c.qty} 
                                                    onChange={(e) => updateCartQty(c.item.id, parseInt(e.target.value))}
                                                    className="w-16 border rounded p-1 text-center"
                                                />
                                            </td>
                                            <td className="py-3 text-right text-sm text-gray-600">{c.item.price.toLocaleString()}</td>
                                            <td className="py-3 text-right text-sm font-medium">{ (c.item.price * c.qty).toLocaleString() }</td>
                                            <td className="text-right">
                                                <button onClick={() => removeFromCart(c.item.id)} className="text-red-400 hover:text-red-600"><X size={16}/></button>
                                            </td>
                                        </tr>
                                    ))}
                                    <tr>
                                        <td className="py-4 text-sm font-bold text-gray-700">Jasa Service / Labor Cost</td>
                                        <td colSpan={2}></td>
                                        <td className="py-4 text-right">
                                            <input 
                                                type="number" 
                                                className="w-28 text-right border rounded p-1 text-sm font-medium" 
                                                value={laborCost} 
                                                onChange={e => setLaborCost(Number(e.target.value))}
                                                min="0"
                                            />
                                        </td>
                                        <td></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-lg font-bold text-gray-700">Total Tagihan</span>
                                <span className="text-3xl font-bold text-blue-700">Rp {calculateTotal().toLocaleString()}</span>
                            </div>
                            <button 
                                onClick={handleCheckout}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg transition-transform hover:scale-[1.01] flex justify-center items-center gap-2"
                            >
                                <Printer size={20} /> Proses Pembayaran & Cetak Struk
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                        <Box size={64} className="mb-4 text-gray-200" />
                        <p>Pilih service dari daftar sebelah kiri untuk memproses pembayaran.</p>
                    </div>
                )}
            </div>
        </div>
    );
  };

  // 5. History View
  const HistoryView = () => {
      const [filterName, setFilterName] = useState('');
      const [startDate, setStartDate] = useState('');
      const [endDate, setEndDate] = useState('');
      const [sortConfig, setSortConfig] = useState<{key: 'date' | 'name' | 'id' | 'cost', direction: 'asc' | 'desc'}>({ key: 'date', direction: 'desc' });

      const paidServices = services.filter(s => s.status === ServiceStatus.PAID);
      
      const filtered = paidServices.filter(s => {
          const matchName = s.customerName.toLowerCase().includes(filterName.toLowerCase()) || s.id.toLowerCase().includes(filterName.toLowerCase());
          
          let matchDate = true;
          if (s.paymentDate && startDate) {
              matchDate = matchDate && new Date(s.paymentDate) >= new Date(startDate);
          }
          if (s.paymentDate && endDate) {
              // Add 1 day to end date to include the whole day
              const end = new Date(endDate);
              end.setDate(end.getDate() + 1);
              matchDate = matchDate && new Date(s.paymentDate) < end;
          }

          return matchName && matchDate;
      }).sort((a,b) => {
          const aDate = new Date(a.paymentDate || a.entryTime).getTime();
          const bDate = new Date(b.paymentDate || b.entryTime).getTime();
          
          let diff = 0;
          switch(sortConfig.key) {
              case 'date': diff = aDate - bDate; break;
              case 'name': diff = a.customerName.localeCompare(b.customerName); break;
              case 'id': diff = a.id.localeCompare(b.id); break;
              case 'cost': diff = a.totalCost - b.totalCost; break;
          }
          
          return sortConfig.direction === 'asc' ? diff : -diff;
      });

      return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
               <div className="p-6 border-b border-gray-200 space-y-4 bg-gray-50">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <Calendar size={20} className="text-blue-600"/> Riwayat Transaksi Service
                        </h3>
                    </div>
                    
                    <div className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="w-full md:w-auto flex-1">
                            <label className="text-xs font-bold text-gray-500 mb-1 block">Cari</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                <input 
                                    type="text" 
                                    placeholder="Cari Nama/ID..." 
                                    className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                                    value={filterName}
                                    onChange={e => setFilterName(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <div>
                                <label className="text-xs font-bold text-gray-500 mb-1 block">Dari Tanggal</label>
                                <input type="date" className="border rounded-lg p-2 text-sm" value={startDate} onChange={e => setStartDate(e.target.value)} />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 mb-1 block">Sampai Tanggal</label>
                                <input type="date" className="border rounded-lg p-2 text-sm" value={endDate} onChange={e => setEndDate(e.target.value)} />
                            </div>
                        </div>
                        <div className="w-full md:w-auto">
                             <label className="text-xs font-bold text-gray-500 mb-1 block">Urutkan</label>
                             <div className="flex border rounded-lg overflow-hidden bg-white">
                                 <select 
                                    className="p-2 text-sm border-r outline-none"
                                    value={sortConfig.key}
                                    onChange={e => setSortConfig({...sortConfig, key: e.target.value as any})}
                                 >
                                     <option value="date">Tanggal</option>
                                     <option value="name">Nama Pelanggan</option>
                                     <option value="id">Service ID</option>
                                     <option value="cost">Total Biaya</option>
                                 </select>
                                 <button 
                                    className="px-3 hover:bg-gray-100"
                                    onClick={() => setSortConfig({...sortConfig, direction: sortConfig.direction === 'asc' ? 'desc' : 'asc'})}
                                 >
                                     <ArrowUpDown size={14} className={sortConfig.direction === 'desc' ? 'transform rotate-180' : ''}/>
                                 </button>
                             </div>
                        </div>
                    </div>
               </div>

               <div className="overflow-x-auto">
                   <table className="w-full text-left">
                       <thead className="bg-white text-gray-500 text-xs uppercase font-medium border-b">
                           <tr>
                               <th className="px-6 py-4">Tanggal Bayar</th>
                               <th className="px-6 py-4">ID Transaksi</th>
                               <th className="px-6 py-4">Pelanggan</th>
                               <th className="px-6 py-4">Kendaraan</th>
                               <th className="px-6 py-4 text-right">Total Biaya</th>
                               <th className="px-6 py-4 text-center">Status</th>
                           </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-50">
                           {filtered.length === 0 && (
                               <tr><td colSpan={6} className="text-center py-8 text-gray-400 italic">Tidak ada data riwayat yang cocok.</td></tr>
                           )}
                           {filtered.map(s => (
                               <tr key={s.id} className="hover:bg-gray-50">
                                   <td className="px-6 py-4 text-sm text-gray-600">
                                       {s.paymentDate ? new Date(s.paymentDate).toLocaleDateString() : '-'}
                                   </td>
                                   <td className="px-6 py-4 text-sm font-mono text-gray-500">{s.transactionId || '-'}</td>
                                   <td className="px-6 py-4 font-medium text-gray-800">
                                       {s.customerName}
                                       <div className="text-xs text-gray-400">{s.id}</div>
                                   </td>
                                   <td className="px-6 py-4 text-sm text-gray-600">
                                       {s.vehicleType} <span className="text-gray-400">({s.licensePlate})</span>
                                   </td>
                                   <td className="px-6 py-4 text-right font-bold text-gray-800">
                                       Rp {s.totalCost.toLocaleString()}
                                   </td>
                                   <td className="px-6 py-4 text-center">
                                       <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs font-bold">LUNAS</span>
                                   </td>
                               </tr>
                           ))}
                       </tbody>
                   </table>
               </div>
          </div>
      );
  };

  // Main Render Logic
  if (currentRole === UserRole.PUBLIC) {
    return (
      <div className="relative">
        {showLoginModal && <LoginModal />}
        
        <PublicTracking 
            services={services} 
            onLoginClick={() => setShowLoginModal(true)}
        />
        <ChatBot />
      </div>
    );
  }

  return (
    <Layout 
        role={currentRole} 
        setRole={setCurrentRole} 
        title={getTitle()}
        activeView={activeView}
        setActiveView={setActiveView}
    >
        {/* Notification Toast */}
        <div className="fixed top-20 right-8 z-50 space-y-2 pointer-events-none">
            {notifications.map((note, idx) => (
                <div key={idx} className="bg-slate-800 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-fade-in-up">
                   <Check size={16} className="text-emerald-400"/> {note}
                </div>
            ))}
        </div>

        {activeView === 'reception' && <ServiceAdvisorView />}
        {activeView === 'jobs' && <MechanicView />}
        {activeView === 'inventory' && <InventoryView />}
        {activeView === 'pos' && <POSView />}
        {activeView === 'history' && <HistoryView />}
        
        {activeView === 'dashboard' && (
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 text-white shadow-lg">
                     <h3 className="text-blue-100 font-medium mb-2">Service Hari Ini</h3>
                     <p className="text-4xl font-bold">{services.filter(s => new Date(s.entryTime).getDate() === new Date().getDate()).length}</p>
                     <p className="text-sm mt-2 text-blue-200">Total Tiket Masuk</p>
                 </div>
                 <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                     <h3 className="text-gray-500 font-medium mb-2">Estimasi Pendapatan</h3>
                     <p className="text-4xl font-bold text-gray-800">
                         Rp {services.reduce((acc, curr) => acc + (curr.totalCost || 0), 0).toLocaleString()}
                     </p>
                     <p className="text-sm mt-2 text-gray-400 text-emerald-600 flex items-center gap-1"><DollarSign size={14}/> Akumulasi Harian</p>
                 </div>
                 <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                     <h3 className="text-gray-500 font-medium mb-2">Mekanik Tersedia</h3>
                     <p className="text-4xl font-bold text-emerald-600">{mechanics.filter(m => m.isAvailable).length}<span className="text-gray-300 text-2xl">/{mechanics.length}</span></p>
                     <p className="text-sm mt-2 text-gray-400">Siap menerima pekerjaan</p>
                 </div>
                 
                 <div className="md:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
                     <h3 className="font-bold text-gray-800 mb-4">Aktivitas Terkini</h3>
                     <div className="space-y-4">
                         {services.slice(0,3).map(s => (
                             <div key={s.id} className="flex items-center gap-4 border-b pb-4 last:border-0 last:pb-0">
                                 <div className={`w-2 h-12 rounded-full ${s.status === ServiceStatus.COMPLETED ? 'bg-emerald-500' : s.status === ServiceStatus.IN_PROGRESS ? 'bg-blue-500' : 'bg-yellow-500'}`}></div>
                                 <div>
                                     <p className="font-bold text-gray-800">{s.customerName} <span className="text-gray-400 font-normal">({s.vehicleType})</span></p>
                                     <p className="text-sm text-gray-500">Status: {s.status}</p>
                                 </div>
                                 <div className="ml-auto text-right text-xs text-gray-400">
                                     {new Date(s.entryTime).toLocaleTimeString()}
                                 </div>
                             </div>
                         ))}
                     </div>
                 </div>
             </div>
        )}
        
        <ChatBot />
    </Layout>
  );
};

export default App;