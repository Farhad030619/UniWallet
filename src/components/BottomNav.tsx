
import React from 'react';
import { BudgetIcon, CommunityIcon, DealsIcon, ProfileIcon, SparklesIcon } from './icons';
import type { View } from '../App';

interface BottomNavProps {
  activeView: View;
  setActiveView: (view: View) => void;
}

const NavItem: React.FC<{
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
  isSpecial?: boolean;
}> = ({ label, icon, isActive, onClick, isSpecial = false }) => {
  const activeClasses = isSpecial 
    ? 'text-white' 
    : 'text-blue-600 dark:text-blue-400';
  const inactiveClasses = 'text-gray-500 dark:text-gray-400';

  if (isSpecial) {
    return (
      <button onClick={onClick} className="flex flex-col items-center justify-center space-y-1 relative -top-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
          {icon}
        </div>
        <span className={`text-xs font-bold ${isActive ? activeClasses : inactiveClasses}`}>{label}</span>
      </button>
    );
  }

  return (
    <button onClick={onClick} className="flex flex-col items-center justify-center space-y-1 w-full p-2 transition-colors duration-200">
      {icon}
      <span className={`text-xs font-medium ${isActive ? activeClasses : inactiveClasses}`}>{label}</span>
    </button>
  );
};


const BottomNav: React.FC<BottomNavProps> = ({ activeView, setActiveView }) => {
  const navItems = [
    { view: 'budget' as View, label: 'Budget', icon: <BudgetIcon className="w-6 h-6" /> },
    { view: 'community' as View, label: 'Community', icon: <CommunityIcon className="w-6 h-6" /> },
    { view: 'cashbuddy' as View, label: 'CashBuddy AI', icon: <SparklesIcon className="w-8 h-8 text-white" />, isSpecial: true },
    { view: 'deals' as View, label: 'Deals', icon: <DealsIcon className="w-6 h-6" /> },
    { view: 'profile' as View, label: 'Profile', icon: <ProfileIcon className="w-6 h-6" /> },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 shadow-t-lg">
      <div className="flex justify-around items-center h-16">
        {navItems.map(item => (
          <NavItem
            key={item.view}
            label={item.label}
            icon={item.icon}
            isActive={activeView === item.view}
            onClick={() => setActiveView(item.view)}
            isSpecial={item.isSpecial}
          />
        ))}
      </div>
    </div>
  );
};

export default BottomNav;
