import React from 'react';
import { LayoutDashboard, Hand, Settings, Terminal, Radio } from 'lucide-react';
import { useEarbudStore } from '../stores/useEarbudStore';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onConnect: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onConnect }) => {
  const { isConnected, statusText } = useEarbudStore();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'gestures', label: 'Gestures', icon: Hand },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'devtools', label: 'Dev Tools', icon: Terminal },
  ];

  return (
    <aside className="w-48 bg-[#141419] border-r border-white/10 flex flex-col justify-between p-4 h-screen">
      <div>
        {/* App Title */}
        <div className="flex items-center gap-2 mb-6 px-2">
          <Radio className="w-5 h-5 text-green-400" />
          <span className="font-bold text-sm text-white tracking-wide">OPPO Companion</span>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-all ${
                  active
                    ? 'bg-white/15 text-white shadow-lg border border-white/10'
                    : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-green-400' : 'text-gray-400'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Connection Controls & Status Badge */}
      <div className="space-y-3 pt-4 border-t border-white/10">
        <button
          onClick={onConnect}
          className={`w-full py-2 px-3 rounded-xl font-semibold text-xs transition-all ${
            isConnected
              ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
              : 'bg-green-500 text-black hover:bg-green-400 shadow-lg shadow-green-500/20'
          }`}
        >
          {isConnected ? 'Disconnect' : 'Connect'}
        </button>

        <div className="flex items-center gap-2 px-2">
          <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-500'}`} />
          <span className="text-[11px] text-gray-400 truncate">{statusText}</span>
        </div>
      </div>
    </aside>
  );
};
