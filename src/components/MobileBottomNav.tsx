import React from 'react';
import { 
  LayoutDashboard, Network, Rocket, Users, Wallet, Zap, ShieldCheck 
} from 'lucide-react';
import { useWeb3Store } from '../store/useWeb3Store';

export default function MobileBottomNav() {
  const { activeView, setActiveView } = useWeb3Store();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'matrix', label: 'X5 Matrix', icon: <Network size={18} /> },
    { id: 'plans', label: 'Plans', icon: <Rocket size={18} /> },
    { id: 'referrals', label: 'Team', icon: <Users size={18} /> },
    { id: 'wallet', label: 'Wallet', icon: <Wallet size={18} /> },
    { id: 'capping', label: 'Capping', icon: <Zap size={18} /> },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-md border-t border-border-theme px-2 py-2 flex items-center justify-around shadow-2xl">
      {navItems.map((item) => {
        const isActive = activeView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id as any)}
            className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all ${
              isActive ? 'text-accent-red font-black scale-105' : 'text-sub hover:text-prime'
            }`}
          >
            {item.icon}
            <span className="text-[10px] font-mono mt-0.5">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
