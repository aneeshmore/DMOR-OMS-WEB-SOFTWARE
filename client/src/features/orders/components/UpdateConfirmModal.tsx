import React from 'react';
import { Modal, Button, Select } from '@/components/ui';
import { AlertTriangle, CheckCircle, Package, FileText } from 'lucide-react';

interface QuotationItem {
  productName: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  lineTotal: number;
}

interface TermOption {
  value: string;
  label: string;
}

interface UpdateConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
  quotationNo?: string;
  totalAmount?: number;
  companyName?: string;
  salespersonName?: string;
  deliveryAddress?: string;
  remarks?: string;
  items?: QuotationItem[];
  paymentTerms?: string;
  deliveryTerms?: string;
  onPaymentTermsChange?: (value: string) => void;
  onDeliveryTermsChange?: (value: string) => void;
  paymentTermsOptions?: TermOption[];
  deliveryTermsOptions?: TermOption[];
}

const UpdateConfirmModal: React.FC<UpdateConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
  quotationNo = '',
  totalAmount = 0,
  companyName = '',
  salespersonName = '',
  deliveryAddress = '',
  remarks = '',
  items = [],
  paymentTerms = '',
  deliveryTerms = '',
  onPaymentTermsChange,
  onDeliveryTermsChange,
  paymentTermsOptions = [],
  deliveryTermsOptions = [],
}) => {
  if (!isOpen) return null;

  // Calculate GST
  const gstAmount = totalAmount * 0.18;
  const grandTotal = totalAmount + gstAmount;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Quotation Update" size="lg">
      <div className="space-y-5 max-h-[80vh] overflow-y-auto">
        {/* Warning Banner */}
        <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-amber-800">Confirm Update</h4>
            <p className="text-sm text-amber-700 mt-1">
              You are about to update quotation <strong>{quotationNo}</strong>. This will replace
              the existing quotation data and reset the status to pending approval.
            </p>
          </div>
        </div>

        {/* Quotation Details */}
        <div className="bg-[var(--surface)] p-4 rounded-lg border border-[var(--border)]">
          <h4 className="font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
            <FileText size={16} className="text-purple-600" />
            Quotation Details
          </h4>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">Quotation No:</span>
              <span className="font-mono font-medium text-purple-600">{quotationNo}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">Company:</span>
              <span className="font-medium text-[var(--text-primary)]">{companyName || 'N/A'}</span>
            </div>
            {salespersonName && (
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Salesperson:</span>
                <span className="font-medium text-[var(--text-primary)]">{salespersonName}</span>
              </div>
            )}
            {deliveryAddress && (
              <div className="flex flex-col gap-1">
                <span className="text-[var(--text-secondary)]">Delivery Address:</span>
                <div className="p-2 bg-[var(--surface-secondary)] rounded border border-[var(--border)] text-sm text-[var(--text-primary)]">
                  {deliveryAddress}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Editable Terms */}
        <div className="bg-[var(--surface)] p-4 rounded-lg border border-[var(--border)]">
          <h4 className="font-semibold text-[var(--text-primary)] mb-3">Terms & Conditions</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Payment Terms */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Payment Terms <span className="text-red-500">*</span>
              </label>
              {onPaymentTermsChange && paymentTermsOptions.length > 0 ? (
                <Select
                  value={paymentTerms}
                  onChange={e => onPaymentTermsChange(e.target.value)}
                  options={paymentTermsOptions}
                  fullWidth
                />
              ) : (
                <div className="p-2 bg-[var(--surface-secondary)] rounded border border-[var(--border)] text-sm">
                  {paymentTerms || 'Not specified'}
                </div>
              )}
            </div>

            {/* Delivery Terms */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Delivery Terms <span className="text-red-500">*</span>
              </label>
              {onDeliveryTermsChange && deliveryTermsOptions.length > 0 ? (
                <Select
                  value={deliveryTerms}
                  onChange={e => onDeliveryTermsChange(e.target.value)}
                  options={deliveryTermsOptions}
                  fullWidth
                />
              ) : (
                <div className="p-2 bg-[var(--surface-secondary)] rounded border border-[var(--border)] text-sm">
                  {deliveryTerms || 'Not specified'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Items List */}
        {items.length > 0 && (
          <div className="bg-[var(--surface)] p-4 rounded-lg border border-[var(--border)]">
            <h4 className="font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
              <Package size={16} className="text-indigo-600" />
              Items ({items.length})
            </h4>

            <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
              {items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center p-2 bg-[var(--surface-secondary)] rounded border border-[var(--border)]"
                >
                  <div className="flex-1">
                    <p className="font-medium text-sm text-[var(--text-primary)]">
                      {item.productName}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)]">
                      {item.quantity} × ₹{item.unitPrice.toFixed(2)}
                      {item.discount > 0 && (
                        <span className="text-orange-600 ml-1">(-{item.discount}%)</span>
                      )}
                    </p>
                  </div>
                  <span className="font-semibold text-sm text-[var(--primary)]">
                    ₹{item.lineTotal.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Subtotal, GST, Total */}
            <div className="pt-3 mt-3 border-t border-[var(--border)] space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-[var(--text-secondary)]">Subtotal:</span>
                <span className="font-medium text-[var(--text-primary)]">
                  ₹{totalAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-[var(--text-secondary)]">GST (18%):</span>
                <span className="font-medium text-[var(--text-primary)]">
                  ₹{gstAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-dashed border-[var(--border)]">
                <span className="font-semibold text-[var(--text-primary)]">Grand Total:</span>
                <span className="font-bold text-lg text-[var(--primary)]">
                  ₹{grandTotal.toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] italic text-right">
                (Incl. 18% GST)
              </p>
            </div>
          </div>
        )}

        {/* Remarks */}
        {remarks && (
          <div className="bg-[var(--surface)] p-3 rounded-lg border border-[var(--border)]">
            <p className="text-xs text-[var(--text-secondary)] mb-1">Remarks:</p>
            <p className="text-sm text-[var(--text-primary)]">{remarks}</p>
          </div>
        )}

        {/* Info Note */}
        <div className="text-xs text-[var(--text-secondary)] bg-blue-50 border border-blue-100 p-3 rounded-lg flex items-start gap-2">
          <CheckCircle size={14} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <span>
            <strong>Note:</strong> After updating, the quotation will be sent for approval again.
            You can track its status in the quotations table.
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end pt-2 border-t border-[var(--border)] sticky bottom-0 bg-[var(--background)] pb-1">
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={onConfirm}
            disabled={loading || !paymentTerms || !deliveryTerms}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
          >
            {loading ? 'Updating...' : 'Confirm Update'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default UpdateConfirmModal;
