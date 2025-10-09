'use client';

import { Briefcase } from 'lucide-react';
import { TeamWorkload } from '@/types';
import { cn } from '@/lib/utils';

interface TeamMemberCardProps {
  member: TeamWorkload;
}

export function TeamMemberCard({ member }: TeamMemberCardProps) {
  // Avatar colors based on member name
  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-yellow-500',
      'bg-red-500',
      'bg-teal-500',
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  // Role badge colors
  const roleColors = {
    'developer': 'bg-teal-100 text-teal-800',
    'seo': 'bg-purple-100 text-purple-800',
  };

  const roleColor = roleColors[member.role as keyof typeof roleColors] || 'bg-gray-100 text-gray-800';
  const avatarColor = getAvatarColor(member.name);
  const initial = member.name.charAt(0).toUpperCase();

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className={cn('rounded-full w-10 h-10 flex items-center justify-center mr-3 text-white font-bold text-lg', avatarColor)}>
            {initial}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
            <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', roleColor)}>
              {member.role}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900">{member.total_clients}</p>
          <p className="text-sm text-gray-500">Clienti totali</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">Clienti attivi:</span>
          <span className="text-sm font-semibold text-green-600">{member.active_clients}</span>
        </div>

        {Object.keys(member.client_types).length > 0 && (
          <div className="border-t border-gray-100 pt-3">
            <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Briefcase className="h-4 w-4 mr-1" />
              Progetti in corso:
            </h4>
            <div className="space-y-2">
              {Object.entries(member.client_types)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([serviceType, clients]) => (
                <div key={serviceType} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-800">{serviceType}</span>
                    <span className="text-xs font-medium text-gray-900">{clients.length}</span>
                  </div>
                  <div className="space-y-1">
                    {clients.map((client, index) => (
                      <div key={index} className="text-xs text-blue-600 font-light pl-2">
                        {client.nome}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {Object.keys(member.client_types).length === 0 && (
          <div className="text-center py-4">
            <p className="text-sm text-gray-500">Nessun progetto attivo</p>
          </div>
        )}
      </div>
    </div>
  );
}