import React from 'react';
import { AppView } from '../types';

interface SidebarProps {
  currentView: AppView;
  onViewChange: (view: AppView) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  const menuItems = [
    { id: AppView.AD_WIZARD, label: 'Ad Wizard', icon: 'fa-wand-magic-sparkles', color: 'text-yellow-500' },
    { id: AppView.CREATIVE_STUDIO, label: 'Creative Studio', icon: 'fa-layer-group', color: 'text-purple-500' },
    { id: AppView.TREND_SCOUT, label: 'Trend Scout', icon: 'fa-compass', color: 'text-blue-500' },
    { id: AppView.PRODUCT_ANALYZER, label: 'Product Audit', icon: 'fa-chart-pie', color: 'text-emerald-500' },
  ];

  return (
    <div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Studio<span className="text-blue-500">Gen</span>
        </h1>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              currentView === item.id 
                ? 'bg-gray-800 text-white shadow-md border-l-4 border-blue-500' 
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <i className={`fa-solid ${item.icon} ${currentView === item.id ? item.color : 'text-gray-600'} w-5`}></i>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-800">
         <div className="bg-gray-800 rounded p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-400 to-blue-600 flex items-center justify-center font-bold text-white text-xs">
              AI
            </div>
            <div>
              <p className="text-sm text-white">Gemini Pro</p>
              <p className="text-xs text-green-400">● Online</p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Sidebar;