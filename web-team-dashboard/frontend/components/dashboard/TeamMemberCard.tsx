'use client';

import { User, Briefcase } from 'lucide-react';
import { TeamWorkload } from '@/types';
import { cn } from '@/lib/utils';

interface TeamMemberCardProps {
  member: TeamWorkload;
}

export function TeamMemberCard({ member }: TeamMemberCardProps) {
  const roleColors = {
    'Sviluppatore Web': 'bg-primary-50 text-primary-700 border-primary-200',
    'SEO Specialist': 'bg-accent-50 text-accent-700 border-accent-200',
  };

  const roleColor = roleColors[member.role as keyof typeof roleColors] || 'bg-gray-50 text-gray-700 border-gray-200';

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="bg-gray-100 rounded-full p-2 mr-3">
            <User className="h-5 w-5 text-gray-600" />
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