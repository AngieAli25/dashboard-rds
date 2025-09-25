'use client';

import { useState, useEffect, useRef } from 'react';
import { Check, X, Edit2 } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { TIPOLOGIA_CLIENTE_CHOICES, SERVIZIO_CHOICES, FASE_PROCESSO_CHOICES } from '@/types';

interface EditableCellProps {
  value: string | number | null;
  type: 'text' | 'select' | 'date' | 'badge';
  options?: Array<{ value: string; label: string }>;
  onSave: (newValue: string) => void;
  className?: string;
  placeholder?: string;
  displayValue?: string;
}

export function EditableCell({ 
  value, 
  type, 
  options = [], 
  onSave, 
  className = '',
  placeholder = '',
  displayValue
}: EditableCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value?.toString() || '');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    onSave(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value?.toString() || '');
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const formatValue = (val: string | number | null) => {
    if (!val) return '-';
    
    if (type === 'date' && val) {
      return new Date(val.toString()).toLocaleDateString('it-IT');
    }
    
    if (type === 'badge') {
      const badgeClass = val === 'AAA' ? 'bg-red-100 text-red-800' :
                        val === 'A' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800';
      return (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${badgeClass}`}>
          {val}
        </span>
      );
    }
    
    if (type === 'select' && options.length > 0) {
      const option = options.find(opt => opt.value === val.toString());
      return option ? option.label : val.toString();
    }
    
    return val.toString();
  };

  const getDisplayValue = () => {
    if (displayValue) return displayValue;
    return formatValue(value);
  };

  if (isEditing) {
    return (
      <div className="flex items-center space-x-2">
        {type === 'select' ? (
          <Select
            value={editValue}
            onChange={(val) => setEditValue(val as string)}
            options={options}
            className="flex-1"
          />
        ) : type === 'date' ? (
          <Input
            ref={inputRef}
            type="date"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
          />
        ) : (
          <Input
            ref={inputRef}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="flex-1"
          />
        )}
        <Button
          size="sm"
          onClick={handleSave}
          className="p-1 h-6 w-6"
        >
          <Check className="h-3 w-3" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleCancel}
          className="p-1 h-6 w-6"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center group">
      <span className={className}>{getDisplayValue()}</span>
      <button
        onClick={() => setIsEditing(true)}
        className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded"
      >
        <Edit2 className="h-3 w-3 text-gray-400" />
      </button>
    </div>
  );
}
