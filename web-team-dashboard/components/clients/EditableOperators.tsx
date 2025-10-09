'use client';

import { useState, useRef, useEffect } from 'react';
import { Check } from 'lucide-react';
import { TeamMember } from '@/types';

interface EditableOperatorsProps {
  operators: TeamMember[];
  allOperators: TeamMember[];
  onSave: (operatorIds: number[]) => void;
}

export function EditableOperators({ operators, allOperators, onSave }: EditableOperatorsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>(operators.map(op => op.id));
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        handleSave();
      }
    };

    if (isEditing) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isEditing, selectedIds]);

  const handleSave = () => {
    setIsEditing(false);
    const originalIds = operators.map(op => op.id).sort();
    const newIds = [...selectedIds].sort();

    // Only save if changed
    if (JSON.stringify(originalIds) !== JSON.stringify(newIds)) {
      onSave(selectedIds);
    }
  };

  const toggleOperator = (operatorId: number) => {
    setSelectedIds(prev => {
      if (prev.includes(operatorId)) {
        return prev.filter(id => id !== operatorId);
      } else {
        return [...prev, operatorId];
      }
    });
  };

  const getAvatarStyles = (memberId: number) => {
    const avatarStyles = [
      { bg: 'bg-blue-50', text: 'text-blue-600' },
      { bg: 'bg-purple-50', text: 'text-purple-600' },
      { bg: 'bg-green-50', text: 'text-green-600' },
      { bg: 'bg-orange-50', text: 'text-orange-600' },
      { bg: 'bg-pink-50', text: 'text-pink-600' },
      { bg: 'bg-indigo-50', text: 'text-indigo-600' },
      { bg: 'bg-teal-50', text: 'text-teal-600' },
      { bg: 'bg-yellow-50', text: 'text-yellow-600' },
    ];
    const index = (memberId - 1) % avatarStyles.length;
    return avatarStyles[index];
  };

  if (!isEditing) {
    return (
      <div
        className="flex items-center gap-1 cursor-pointer hover:opacity-70 transition-opacity"
        onClick={() => setIsEditing(true)}
      >
        {operators.length > 0 ? (
          operators.map((op) => {
            const initial = op.name.charAt(0).toUpperCase();
            const style = getAvatarStyles(op.id);
            return (
              <div
                key={op.id}
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold ${style.bg} ${style.text}`}
                title={op.name}
              >
                {initial}
              </div>
            );
          })
        ) : (
          <span className="text-sm text-gray-400">-</span>
        )}
      </div>
    );
  }

  return (
    <div ref={dropdownRef} className="relative">
      <div className="absolute top-0 left-0 z-50 bg-white border border-gray-300 rounded-lg shadow-lg min-w-[200px]">
        <div className="p-2 max-h-64 overflow-y-auto">
          {allOperators.map((operator) => {
            const isSelected = selectedIds.includes(operator.id);
            const initial = operator.name.charAt(0).toUpperCase();
            const style = getAvatarStyles(operator.id);

            return (
              <div
                key={operator.id}
                onClick={() => toggleOperator(operator.id)}
                className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
              >
                <div className="flex items-center justify-center w-5 h-5 border border-gray-300 rounded">
                  {isSelected && (
                    <Check className="w-4 h-4 text-primary-600" />
                  )}
                </div>
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-semibold ${style.bg} ${style.text}`}
                >
                  {initial}
                </div>
                <span className="text-sm text-gray-700">{operator.name}</span>
                <span className="text-xs text-gray-400 ml-auto">
                  {operator.role === 'developer' ? 'Dev' : 'SEO'}
                </span>
              </div>
            );
          })}
        </div>
        {allOperators.length === 0 && (
          <div className="p-4 text-sm text-gray-500 text-center">
            Nessun operatore disponibile
          </div>
        )}
      </div>
    </div>
  );
}
