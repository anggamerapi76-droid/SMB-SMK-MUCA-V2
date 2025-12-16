import React, { useState } from 'react';
import { Search, MapPin, Phone, Clock, CheckCircle, Car, Bike, AlertCircle, LogIn } from 'lucide-react';
import { ServiceRecord, ServiceStatus } from '../types';

interface PublicTrackingProps {
  services: ServiceRecord[];
  onLoginClick: () => void;
}

const PublicTracking: React.FC<PublicTrackingProps> = ({ services, onLoginClick }) => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<ServiceRecord | null>(null);
  const [error, setError] = useState('');

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const found = services.find(s => 
      s.id.toLowerCase() === query.toLowerCase() || 
      s.licensePlate.toLowerCase().replace(/\s/g, '') === query.toLowerCase().replace(/\s/g, '')
    );

    if (found) {
      setResult(found);
    } else {
      setResult(null);
      setError('Data tidak ditemukan. Mohon periksa Kode Unik atau Nomor Plat Anda.');
    }
  };

  const getStatusColor = (status: ServiceStatus) => {
    switch (status) {
      case ServiceStatus.QUEUED: return 'text-yellow-600 bg-yellow-100';
      case ServiceStatus.IN_PROGRESS: return 'text-blue-600 bg-blue-100';
      case ServiceStatus.COMPLETED: return 'text-emerald-600 bg-emerald-100';
      case ServiceStatus.PAID: return 'text-gray-600 bg-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex flex-col">
      {/* Hero Section */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 bg-blue-700 rounded-lg flex items-center justify-center text-white font-bold text-2xl shadow-lg">
               M
             </div>
             <div>
               <h1 className="text-lg font-bold text-slate-800 leading-tight">SMKS Muhammadiyah Cangkringan</h1>
               <p className="text-sm text-slate-500">TEFA Center of Excellence</p>
             </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex gap-4 text-sm font-medium text-slate-600">
                <span className="flex items-center gap-1"><CheckCircle size={16} className="text-blue-600"/> Religius</span>
                <span className="flex items-center gap-1"><CheckCircle size={16} className="text-emerald-600"/> Unggul</span>
                <span className="flex items-center gap-1"><CheckCircle size={16} className="text-orange-600"/> Kompeten</span>
            </div>
            <button 
                onClick={onLoginClick}
                className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors"
            >
                <LogIn size={16} /> Login System
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12 flex flex-col items-center">
        
        <div className="text-center mb-10 max-w-2xl">
          <h2 className="text-4xl font-extrabold text-slate-800 mb-4 tracking-tight">
            Lacak Status Servis Kendaraan
          </h2>
          <p className="text-lg text-slate-600">
            Sistem manajemen bengkel modern yang terintegrasi. Masukkan Kode Unik servis atau Nomor Plat kendaraan Anda di bawah ini.
          </p>
        </div>

        <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleTrack} className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Contoh: SRV-2023-001 atau AB 1234 XY"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none text-lg"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button 
                type="submit"
                className="absolute right-2 top-2 bottom-2 bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-lg font-medium transition-colors"
              >
                Cari
              </button>
            </div>
          </form>

          {error && (
            <div className="p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-3 border border-red-100 animate-fade-in">
              <AlertCircle size={20} />
              {error}
            </div>
          )}

          {result && (
            <div className="animate-fade-in space-y-6">
              <div className="flex justify-between items-start border-b border-gray-100 pb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">{result.customerName}</h3>
                  <p className="text-gray-500 font-mono">{result.licensePlate}</p>
                </div>
                <span className={`px-4 py-1 rounded-full text-sm font-bold ${getStatusColor(result.status)}`}>
                  {result.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-gray-500 mb-1">Kendaraan</p>
                  <p className="font-semibold text-gray-800 flex items-center gap-2">
                    {result.vehicleType.toLowerCase().includes('motor') || result.vehicleType.toLowerCase().includes('vario') ? <Bike size={16}/> : <Car size={16}/>}
                    {result.vehicleType}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                   <p className="text-gray-500 mb-1">Kode Servis</p>
                   <p className="font-mono font-semibold text-gray-800">{result.id}</p>
                </div>
              </div>

              <div className="space-y-2">
                 <p className="text-sm text-gray-500">Keluhan</p>
                 <p className="text-gray-800 font-medium">{result.problemDescription}</p>
              </div>

              {result.status === ServiceStatus.COMPLETED && (
                <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl">
                  <h4 className="font-bold text-emerald-800 mb-1">Kendaraan Siap Diambil</h4>
                  <p className="text-sm text-emerald-700">Silakan menuju kasir untuk melakukan pembayaran dan pengambilan kunci.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8 text-sm">
          <div>
            <h4 className="text-white font-bold mb-4">SMKS Muhammadiyah Cangkringan</h4>
            <div className="space-y-2">
              <p className="flex items-center gap-2"><MapPin size={16} /> Jl. Cangkringan No. 1, Sleman, DIY</p>
              <p className="flex items-center gap-2"><Phone size={16} /> (0274) 123456</p>
              <p className="flex items-center gap-2"><Clock size={16} /> Senin - Jumat: 07:30 - 16:00 WIB</p>
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Layanan TEFA</h4>
            <ul className="space-y-2">
              <li>Servis Ringan & Berat (TKRO)</li>
              <li>Tune Up & Ganti Oli (TBSM)</li>
              <li>Spooring & Balancing</li>
              <li>Cafetaria & Merchandise</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Tentang Sistem</h4>
            <p>Sistem ini dirancang dengan keamanan tinggi, responsif, dan real-time untuk mendukung transparansi layanan publik.</p>
            <div className="mt-4 flex items-center gap-2 text-xs">
                <span className="bg-slate-800 px-2 py-1 rounded border border-slate-700">v1.0.0</span>
                <span className="text-emerald-500">● System Operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicTracking;