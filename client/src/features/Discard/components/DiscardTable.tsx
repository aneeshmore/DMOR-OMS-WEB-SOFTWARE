import React from 'react';
import { DiscardEntry } from '../types';

interface DiscardTableProps {
  data: DiscardEntry[];
}

// Helper to get type label and color
const getTypeInfo = (type: string | undefined) => {
  switch (type) {
    case 'RM':
      return { label: 'Raw Material', bgColor: 'bg-amber-100', textColor: 'text-amber-700' };
    case 'PM':
      return {
        label: 'Packaging Material',
        bgColor: 'bg-purple-100',
        textColor: 'text-purple-700',
      };
    case 'FG':
      return { label: 'Finished Good', bgColor: 'bg-green-100', textColor: 'text-green-700' };
    default:
      return { label: 'Unknown', bgColor: 'bg-gray-100', textColor: 'text-gray-700' };
  }
};

export const DiscardTable: React.FC<DiscardTableProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-[var(--surface)] rounded-lg shadow-sm p-8 text-center text-[var(--text-secondary)] border border-[var(--border)]">
        No discard records found.
      </div>
    );
  }

  return (
    <div className="bg-[var(--surface)] rounded-lg shadow-sm overflow-hidden border border-[var(--border)]">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-[var(--text-primary)] uppercase bg-[var(--surface-secondary)]">
            <tr>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3">Product</th>
              <th className="px-6 py-3">Discarded Qty</th>
              <th className="px-6 py-3">Remaining Stock</th>
              <th className="px-6 py-3">Reason</th>
            </tr>
          </thead>
          <tbody>
            {data.map(entry => {
              const typeInfo = getTypeInfo(entry.productType);
              return (
                <tr
                  key={entry.discardId}
                  className="border-b border-[var(--border)] hover:bg-[var(--surface-hover)]"
                >
                  <td className="px-6 py-4">{new Date(entry.discardDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${typeInfo.bgColor} ${typeInfo.textColor}`}
                    >
                      {typeInfo.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-[var(--text-primary)]">
                    {entry.productName || `Product #${entry.productId}`}
                  </td>
                  <td className="px-6 py-4 text-red-600 font-medium">
                    -{Number(entry.quantity).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-blue-600 font-medium">
                    {entry.currentStock !== undefined && entry.currentStock !== null
                      ? Number(entry.currentStock).toFixed(2)
                      : '-'}
                  </td>
                  <td className="px-6 py-4 text-[var(--text-secondary)]">{entry.reason || '-'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
