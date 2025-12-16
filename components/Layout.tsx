import React from 'react';
import { UserRole } from '../types';
import { LayoutDashboard, Users, Wrench, ShoppingCart, LogOut, ShieldCheck, History, CreditCard } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  role: UserRole;
  setRole: (role: UserRole) => void;
  title: string;
  activeView: string;
  setActiveView: (view: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, role, setRole, title, activeView, setActiveView }) => {
  const getRoleColor = () => {
    switch (role) {
      case UserRole.ADMIN: return 'bg-slate-800';
      case UserRole.SA: return 'bg-blue-800';
      case UserRole.MECHANIC: return 'bg-orange-700';
      case UserRole.CASHIER: return 'bg-emerald-700';
      default: return 'bg-blue-900';
    }
  };

  const getRoleName = () => {
    if (role === UserRole.SA) return 'Service Advisor';
    return role.charAt(0) + role.slice(1).toLowerCase();
  };

  const NavButton = ({ view, icon: Icon, label }: { view: string, icon: any, label: string }) => (
    <button 
      onClick={() => setActiveView(view)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${activeView === view ? 'bg-white/20 font-bold' : 'bg-transparent hover:bg-white/10'}`}
    >
      <Icon size={18} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <aside className={`w-64 ${getRoleColor()} text-white flex flex-col shadow-xl transition-colors duration-300`}>
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
             {/* Logo Placeholder */}
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-900 font-bold text-xl">
              M
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">SMK PK</h1>
              <p className="text-xs text-white/70">Muhammadiyah Cangkringan</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <div className="px-4 py-2 bg-white/10 rounded-lg mb-4">
            <p className="text-xs uppercase tracking-wider text-white/60 mb-1">Current User</p>
            <p className="font-medium">{getRoleName()}</p>
          </div>

          <NavButton view="dashboard" icon={LayoutDashboard} label="Dashboard" />
          
          {(role === UserRole.SA || role === UserRole.ADMIN) && (
             <NavButton view="reception" icon={Users} label="Service Reception" />
          )}

          {role === UserRole.MECHANIC && (
             <NavButton view="jobs" icon={Wrench} label="My Jobs" />
          )}

          {(role === UserRole.CASHIER || role === UserRole.SA || role === UserRole.ADMIN) && (
             <NavButton view="pos" icon={CreditCard} label="Point of Sales" />
          )}

          {(role === UserRole.ADMIN || role === UserRole.SA) && (
             <NavButton view="inventory" icon={ShoppingCart} label="Inventory" />
          )}

          {(role === UserRole.ADMIN || role === UserRole.SA) && (
             <NavButton view="history" icon={History} label="Service History" />
          )}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={() => setRole(UserRole.PUBLIC)}
            className="w-full flex items-center gap-2 justify-center px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors text-sm font-medium"
          >
            <LogOut size={16} />
            Logout
          </button>
          <div className="mt-4 flex items-center justify-center gap-1 text-xs text-white/40">
            <ShieldCheck size={12} />
            <span>System Secure & Encrypted</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white shadow-sm border-b border-gray-200 flex items-center justify-between px-8">
            <h2 className="text-xl font-bold text-gray-800">{title}</h2>
            <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-500">
                    Semboyan: <span className="text-blue-600">Religius</span>, <span className="text-emerald-600">Unggul</span>, <span className="text-orange-600">Kompeten</span>
                </span>
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold">
                    {role[0]}
                </div>
            </div>
        </header>

        {/* View Area */}
        <div className="flex-1 overflow-y-auto p-8">
            {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;