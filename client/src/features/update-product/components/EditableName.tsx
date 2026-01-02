import React, { useState, useRef, useEffect } from 'react';
import { Pencil, Check, X, ExternalLink } from 'lucide-react';

interface EditableNameProps {
  value: string;
  editedValue?: string;
  onEdit: (newValue: string) => void;
  isEdited: boolean;
  className?: string;
  onNameClick?: () => void;
}

const EditableName: React.FC<EditableNameProps> = ({
  value,
  editedValue,
  onEdit,
  isEdited,
  className = '',
  onNameClick,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(editedValue ?? value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    setTempValue(editedValue ?? value);
  }, [editedValue, value]);

  const handleConfirm = () => {
    const trimmedValue = tempValue.trim();
    if (trimmedValue && trimmedValue !== value) {
      onEdit(trimmedValue);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempValue(editedValue ?? value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleConfirm();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="text"
          value={tempValue}
          onChange={e => setTempValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleConfirm}
          className="flex-1 px-2 py-1 border border-[var(--primary)] rounded bg-[var(--background)] text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
        />
        <button
          onClick={handleConfirm}
          className="p-1 text-green-500 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
          title="Confirm"
        >
          <Check size={16} />
        </button>
        <button
          onClick={handleCancel}
          className="p-1 text-red-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
          title="Cancel"
        >
          <X size={16} />
        </button>
      </div>
    );
  }

  return (
    <div className={`group flex items-center gap-2 ${className}`}>
      {onNameClick ? (
        <button
          onClick={onNameClick}
          className={`transition-colors text-left hover:underline cursor-pointer ${
            isEdited
              ? 'text-[var(--primary)] font-medium'
              : 'text-[var(--text-primary)] hover:text-[var(--primary)]'
          }`}
          title="Click to edit in Master Product"
        >
          {editedValue ?? value}
        </button>
      ) : (
        <span
          className={`transition-colors ${
            isEdited ? 'text-[var(--primary)] font-medium' : 'text-[var(--text-primary)]'
          }`}
        >
          {editedValue ?? value}
        </span>
      )}
      {onNameClick && (
        <ExternalLink
          size={14}
          className="opacity-0 group-hover:opacity-50 text-[var(--text-secondary)] transition-opacity"
        />
      )}
      <button
        onClick={() => setIsEditing(true)}
        className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 text-[var(--text-secondary)] hover:text-[var(--primary)] hover:bg-[var(--surface-hover)] rounded"
        title="Quick edit name"
      >
        <Pencil size={14} />
        <span className="text-xs">Edit</span>
      </button>
    </div>
  );
};

export default EditableName;
