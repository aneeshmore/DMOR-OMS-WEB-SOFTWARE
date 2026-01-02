import React from 'react';
import { ShoppingCart, FileText } from 'lucide-react';

type ViewMode = 'orders' | 'quotations';

interface ModeIndicatorBannerProps {
  viewMode: ViewMode;
}

const ModeIndicatorBanner: React.FC<ModeIndicatorBannerProps> = ({ viewMode }) => {
  return (
    <div
      className={`relative overflow-hidden rounded-xl p-4 transition-all duration-500 ${
        viewMode === 'orders'
          ? 'bg-gradient-to-r from-blue-500/10 via-blue-400/5 to-transparent border border-blue-200/50'
          : 'bg-gradient-to-r from-purple-500/10 via-indigo-400/5 to-transparent border border-purple-200/50'
      }`}
    >
      {/* Decorative Elements */}
      <div
        className={`absolute -right-8 -top-8 w-32 h-32 rounded-full blur-3xl transition-colors duration-500 ${
          viewMode === 'orders' ? 'bg-blue-400/20' : 'bg-purple-400/20'
        }`}
      />
      <div
        className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full blur-2xl transition-colors duration-500 ${
          viewMode === 'orders' ? 'bg-blue-300/20' : 'bg-indigo-300/20'
        }`}
      />

      <div className="relative flex items-center gap-4">
        <div
          className={`flex items-center justify-center w-12 h-12 rounded-xl shadow-lg transition-all duration-500 ${
            viewMode === 'orders'
              ? 'bg-gradient-to-br from-blue-500 to-blue-600'
              : 'bg-gradient-to-br from-purple-500 to-indigo-600'
          }`}
        >
          {viewMode === 'orders' ? (
            <ShoppingCart className="text-white" size={24} />
          ) : (
            <FileText className="text-white" size={24} />
          )}
        </div>

        <div>
          <h3
            className={`font-semibold text-lg transition-colors duration-300 ${
              viewMode === 'orders' ? 'text-blue-700' : 'text-purple-700'
            }`}
          >
            {viewMode === 'orders' ? 'Order Mode' : 'Quotation Mode'}
          </h3>
          <p className="text-sm text-[var(--text-secondary)]">
            {viewMode === 'orders'
              ? 'Create orders directly for immediate processing and dispatch planning'
              : 'Create quotations for customer review and approval before converting to orders'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ModeIndicatorBanner;
