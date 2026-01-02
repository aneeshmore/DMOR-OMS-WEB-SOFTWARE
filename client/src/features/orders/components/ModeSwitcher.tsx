import React from 'react';
import { ShoppingCart, FileText } from 'lucide-react';

type ViewMode = 'orders' | 'quotations';

interface ModeSwitcherProps {
  viewMode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
}

const ModeSwitcher: React.FC<ModeSwitcherProps> = ({ viewMode, onModeChange }) => {
  return (
    <div className="relative flex items-center backdrop-blur-sm bg-[var(--surface)]/80 border border-[var(--border)] rounded-xl p-1 shadow-lg">
      {/* Animated Background Indicator */}
      <div
        className={`absolute top-1 bottom-1 transition-all duration-300 ease-out rounded-lg ${
          viewMode === 'orders'
            ? 'left-1 bg-gradient-to-r from-blue-500 to-blue-600'
            : 'left-[calc(50%)] bg-gradient-to-r from-purple-500 to-indigo-600'
        }`}
        style={{
          width: 'calc(50% - 4px)',
        }}
      />

      {/* Orders Tab */}
      <button
        onClick={() => onModeChange('orders')}
        className={`relative z-10 flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 min-w-[130px] justify-center ${
          viewMode === 'orders'
            ? 'text-white'
            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
        }`}
      >
        <ShoppingCart size={16} className={viewMode === 'orders' ? 'animate-pulse' : ''} />
        <span>Orders</span>
      </button>

      {/* Quotations Tab */}
      <button
        onClick={() => onModeChange('quotations')}
        className={`relative z-10 flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 min-w-[130px] justify-center ${
          viewMode === 'quotations'
            ? 'text-white'
            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
        }`}
      >
        <FileText size={16} className={viewMode === 'quotations' ? 'animate-pulse' : ''} />
        <span>Quotations</span>
      </button>
    </div>
  );
};

export default ModeSwitcher;
export type { ViewMode };
