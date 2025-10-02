'use client';

import { useEffect, useState } from 'react';
import { Plus, Users, Filter, Download, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { clientsApi, teamApi } from '@/lib/api';
import { Client, TeamMember } from '@/types';
import { ClientFilters } from '@/components/clients/ClientFilters';
import { AddClientModal } from '@/components/clients/AddClientModal';
import { EditableCell } from '@/components/clients/EditableCell';
import { KPICard } from '@/components/dashboard/KPICard';
import { TIPOLOGIA_CLIENTE_CHOICES, SERVIZIO_CHOICES, FASE_PROCESSO_CHOICES, SEO_STATO_CHOICES } from '@/types';
import toast from 'react-hot-toast';

export default function ClientiPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    operatore: '',
    servizio: '',
    fase_processo: '',
    scadenza: ''
  });
  const [sortConfig, setSortConfig] = useState<{
    key: 'data_richiesta' | 'scadenza' | null;
    direction: 'asc' | 'desc';
  }>({
    key: 'data_richiesta',
    direction: 'desc'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [clientsData, membersData] = await Promise.all([
          clientsApi.getAll(),
          teamApi.getAll(),
        ]);
        
        setClients(clientsData.results);
        setTeamMembers(membersData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Errore nel caricamento dei dati');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleClientUpdate = async (clientId: number, data: Partial<Client>) => {
    try {
      const updatedClient = await clientsApi.update(clientId, data);
      setClients(prev => 
        prev.map(client => 
          client.id === clientId ? updatedClient : client
        )
      );
      toast.success('Cliente aggiornato');
    } catch (error) {
      console.error('Error updating client:', error);
      toast.error('Errore nell\'aggiornamento');
    }
  };

  const handleClientAdd = async (data: any) => {
    try {
      const newClient = await clientsApi.create(data);
      setClients(prev => [newClient, ...prev]);
      setIsAddModalOpen(false);
      toast.success('Cliente aggiunto');
    } catch (error) {
      console.error('Error adding client:', error);
      toast.error('Errore nell\'aggiunta del cliente');
    }
  };

  const handleFieldUpdate = async (clientId: number, field: string, value: string) => {
    try {
      const updateData = { [field]: value };
      const updatedClient = await clientsApi.update(clientId, updateData);
      setClients(prev => 
        prev.map(client => 
          client.id === clientId ? updatedClient : client
        )
      );
      toast.success('Campo aggiornato');
    } catch (error) {
      console.error('Error updating field:', error);
      toast.error('Errore nell\'aggiornamento del campo');
    }
  };

  const handleSort = (key: 'data_richiesta' | 'scadenza') => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: 'data_richiesta' | 'scadenza') => {
    if (sortConfig.key !== key) {
      return <ChevronsUpDown className="h-4 w-4 text-gray-400" />;
    }
    return sortConfig.direction === 'asc' ? 
      <ChevronUp className="h-4 w-4 text-gray-600" /> : 
      <ChevronDown className="h-4 w-4 text-gray-600" />;
  };

  // Calculate KPIs
  const activeClients = clients.filter(c => c.is_active && !c.is_standby && !c.is_maintenance).length;
  const standbyClients = clients.filter(c => c.is_standby).length;
  const maintenanceClients = clients.filter(c => c.is_maintenance).length;

  // Create options for selects
  const teamOptions = [
    { value: '', label: 'Non assegnato' },
    ...teamMembers.map(member => ({
      value: member.id.toString(),
      label: member.name,
    })),
  ];

  // Filter and sort clients
  const filteredAndSortedClients = clients
    .filter(client => {
      const matchesSearch = !filters.search || 
        client.nome_attivita.toLowerCase().includes(filters.search.toLowerCase()) ||
        client.account_riferimento.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesOperatore = !filters.operatore || 
        client.operatore?.toString() === filters.operatore;
      
      const matchesServizio = !filters.servizio || 
        client.servizio === filters.servizio;
      
      const matchesFase = !filters.fase_processo || 
        client.fase_processo === filters.fase_processo;

      return matchesSearch && matchesOperatore && matchesServizio && matchesFase;
    })
    .sort((a, b) => {
      if (!sortConfig.key) return 0;
      
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (!aValue && !bValue) return 0;
      if (!aValue) return 1;
      if (!bValue) return -1;
      
      const dateA = new Date(aValue);
      const dateB = new Date(bValue);
      
      if (sortConfig.direction === 'asc') {
        return dateA.getTime() - dateB.getTime();
      } else {
        return dateB.getTime() - dateA.getTime();
      }
    });

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
              <div className="h-16 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-end">
        <div className="flex gap-3">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Aggiungi Cliente
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard
          title="Clienti Attivi"
          value={activeClients}
          icon={Users}
          color="blue"
        />
        <KPICard
          title="Clienti in Stand-by"
          value={standbyClients}
          icon={Users}
          color="yellow"
        />
        <KPICard
          title="Clienti in Mantenimento"
          value={maintenanceClients}
          icon={Users}
          color="green"
        />
      </div>

      {/* Filters */}
      <ClientFilters
        filters={filters}
        onFiltersChange={setFilters}
        onClearFilters={() => setFilters({
          search: '',
          operatore: '',
          servizio: '',
          fase_processo: '',
          scadenza: ''
        })}
      />

      {/* Clients Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  <button
                    onClick={() => handleSort('data_richiesta')}
                    className="flex items-center space-x-1 hover:text-gray-700 transition-colors"
                  >
                    <span>DATA DI RICHIESTA</span>
                    {getSortIcon('data_richiesta')}
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CLIENTE
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  TIPOLOGIA
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  OPERATORE
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SERVIZIO
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  FASE DEL PROCESSO
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SEO
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('scadenza')}
                    className="flex items-center space-x-1 hover:text-gray-700 transition-colors"
                  >
                    <span>SCADENZA</span>
                    {getSortIcon('scadenza')}
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  NOTE
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAndSortedClients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <EditableCell
                      value={client.data_richiesta}
                      type="date"
                      onSave={(value) => handleFieldUpdate(client.id, 'data_richiesta', value)}
                    />
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap max-w-[200px]">
                    <div className="space-y-1">
                      <EditableCell
                        value={client.nome_attivita}
                        type="text"
                        onSave={(value) => handleFieldUpdate(client.id, 'nome_attivita', value)}
                        className="text-sm font-medium text-gray-900 truncate block"
                        placeholder="Nome attività"
                      />
                      <EditableCell
                        value={client.account_riferimento}
                        type="text"
                        onSave={(value) => handleFieldUpdate(client.id, 'account_riferimento', value)}
                        className="text-sm text-gray-500 truncate block"
                        placeholder="Account riferimento"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <EditableCell
                      value={client.tipologia_cliente}
                      type="badge-select"
                      options={TIPOLOGIA_CLIENTE_CHOICES}
                      onSave={(value) => handleFieldUpdate(client.id, 'tipologia_cliente', value)}
                    />
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <EditableCell
                      value={client.operatore?.toString() || ''}
                      type="select"
                      options={teamOptions}
                      onSave={(value) => handleFieldUpdate(client.id, 'operatore', value)}
                      displayValue={client.operatore_detail?.name || 'Non assegnato'}
                    />
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <EditableCell
                      value={client.servizio}
                      type="select"
                      options={SERVIZIO_CHOICES}
                      onSave={(value) => handleFieldUpdate(client.id, 'servizio', value)}
                    />
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <EditableCell
                      value={client.fase_processo}
                      type="select"
                      options={FASE_PROCESSO_CHOICES}
                      onSave={(value) => handleFieldUpdate(client.id, 'fase_processo', value)}
                    />
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <EditableCell
                      value={client.seo_stato}
                      type="select"
                      options={SEO_STATO_CHOICES}
                      onSave={(value) => handleFieldUpdate(client.id, 'seo_stato', value)}
                    />
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <EditableCell
                      value={client.scadenza}
                      type="date"
                      onSave={(value) => handleFieldUpdate(client.id, 'scadenza', value)}
                    />
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <EditableCell
                      value={client.note}
                      type="text"
                      onSave={(value) => handleFieldUpdate(client.id, 'note', value)}
                      className="max-w-xs truncate"
                      placeholder="Aggiungi note..."
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredAndSortedClients.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nessun cliente trovato
            </h3>
            <p className="text-gray-500">
              {clients.length === 0 
                ? "Non ci sono clienti registrati al momento."
                : "Prova a modificare i filtri di ricerca."
              }
            </p>
          </div>
        )}
      </div>

      {/* Add Client Modal */}
      <AddClientModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleClientAdd}
        teamMembers={teamMembers}
      />
    </div>
  );
}
