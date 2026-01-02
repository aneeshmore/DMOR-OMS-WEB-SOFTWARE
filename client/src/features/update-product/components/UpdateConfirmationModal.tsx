import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { AlertTriangle } from 'lucide-react';

interface ChangeRecord {
  name: string;
  changes: { field: string; oldValue: any; newValue: any }[];
}

interface UpdateConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  changes?: ChangeRecord[];
}

const UpdateConfirmationModal: React.FC<UpdateConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Update',
  description = 'Are you sure you want to update these products? This action cannot be undone.',
  changes = [],
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" showCloseButton={false}>
      <div className="flex flex-col p-4 max-h-[80vh]">
        <div className="flex flex-col items-center text-center mb-4">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-500">{description}</p>
        </div>

        {changes.length > 0 && (
          <div className="flex-1 overflow-y-auto border rounded-lg mb-6 bg-gray-50 p-4">
            <h4 className="font-semibold text-gray-700 mb-3">Changes to be saved:</h4>
            <div className="space-y-4">
              {changes.map((record, idx) => (
                <div key={idx} className="bg-white p-3 rounded shadow-sm border border-gray-100">
                  <div className="font-medium text-gray-900 mb-2">{record.name}</div>
                  <ul className="text-sm space-y-1">
                    {record.changes.map((change, cIdx) => (
                      <li key={cIdx} className="text-gray-600 flex justify-between">
                        <span className="capitalize">
                          {change.field.replace(/([A-Z])/g, ' $1').trim()}:
                        </span>
                        <span className="font-medium">
                          {change.oldValue} <span className="text-gray-400 mx-1">→</span>{' '}
                          <span className="text-green-600">{change.newValue}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3 w-full mt-auto">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            Confirm Update
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default UpdateConfirmationModal;
