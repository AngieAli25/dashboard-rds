'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { teamApi } from '@/lib/api';
import { TeamMember, SERVIZIO_CHOICES, FASE_PROCESSO_CHOICES, SEO_STATO_CHOICES } from '@/types';

interface ClientFiltersProps {
  filters: {
    search: string;
    operatore: string;
    servizio: string;
    fase_processo: string;
    seo_stato: string;
    scadenza_filter: string;
  };
  onFiltersChange: (filters: any) => void;
  onClearFilters: () => void;
}

export function ClientFilters({ filters, onFiltersChange, onClearFilters }: ClientFiltersProps) {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const members = await teamApi.getAll();
        setTeamMembers(members);
      } catch (error) {
        console.error('Error fetching team members:', error);
      }
    };

    fetchTeamMembers();
  }, []);

  const handleFilterChange = (key: string, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  const scadenzaOptions = [
    { value: '', label: 'Tutte le scadenze' },
    { value: 'oggi', label: 'Oggi' },
    { value: 'settimana', label: 'Questa settimana' },
    { value: 'mese', label: 'Questo mese' },
  ];

  const teamOptions = [
    { value: '', label: 'Tutti gli operatori' },
    ...teamMembers.map(member => ({
      value: member.id.toString(),
      label: member.name,
    })),
  ];

  const servizioOptions = [
    { value: '', label: 'Tutti i servizi' },
    ...SERVIZIO_CHOICES,
  ];

  const faseOptions = [
    { value: '', label: 'Tutte le fasi' },
    ...FASE_PROCESSO_CHOICES,
  ];

  const seoOptions = [
    { value: '', label: 'Tutti gli stati SEO' },
    ...SEO_STATO_CHOICES,
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Cerca cliente..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex-1">
          <Select
            value={filters.operatore}
            onChange={(value) => handleFilterChange('operatore', value as string)}
            options={teamOptions}
            placeholder="Operatore"
          />
        </div>
        
        <div className="flex-1">
          <Select
            value={filters.servizio}
            onChange={(value) => handleFilterChange('servizio', value as string)}
            options={servizioOptions}
            placeholder="Servizio"
          />
        </div>
        
        <div className="flex-1">
          <Select
            value={filters.fase_processo}
            onChange={(value) => handleFilterChange('fase_processo', value as string)}
            options={faseOptions}
            placeholder="Fase processo"
          />
        </div>
        
        <div className="flex-1">
          <Select
            value={filters.seo_stato}
            onChange={(value) => handleFilterChange('seo_stato', value as string)}
            options={seoOptions}
            placeholder="Stato SEO"
          />
        </div>
        
        <div className="flex-1">
          <Select
            value={filters.scadenza_filter}
            onChange={(value) => handleFilterChange('scadenza_filter', value as string)}
            options={scadenzaOptions}
            placeholder="Scadenza"
          />
        </div>
        
        <Button
          variant="outline"
          onClick={onClearFilters}
          className="flex items-center text-blue-600 hover:text-blue-800 border-blue-600 hover:border-blue-800 whitespace-nowrap"
        >
          <X className="h-4 w-4 mr-1" />
          Azzera filtri
        </Button>
      </div>
    </div>
  );
}