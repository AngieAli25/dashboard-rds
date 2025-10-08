'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, Calendar, Users, Briefcase, BarChart3, LineChart, PieChart, ChevronLeft, ChevronRight } from 'lucide-react';
import { KPICard } from '@/components/dashboard/KPICard';
import { ProjectHistory, MonthlySnapshot, Client, TeamMember } from '@/types';
import { clientsApi, teamApi } from '@/lib/api';
import toast from 'react-hot-toast';

export default function StoricoPage() {
  const [projectHistory, setProjectHistory] = useState<ProjectHistory[]>([]);
  const [snapshots, setSnapshots] = useState<MonthlySnapshot[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Stati per la visualizzazione espansa
  const [snapshotsExpanded, setSnapshotsExpanded] = useState(false);
  const [projectsExpanded, setProjectsExpanded] = useState(false);
  const [snapshotsPage, setSnapshotsPage] = useState(0);
  const [projectsPage, setProjectsPage] = useState(0);
  const itemsPerPage = 10;
  const initialItemsCount = 3;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch real clients and team data
        const [clientsData, membersData] = await Promise.all([
          clientsApi.getAll(),
          teamApi.getAll(),
        ]);
        
        setClients(clientsData.results);
        setTeamMembers(membersData);
        
        // Nessun dato simulato - usiamo solo progetti reali

        // Calcola dati reali per il mese corrente
        const currentDate = new Date();
        const realActiveClients = clientsData.results.filter(client => 
          client.fase_processo !== 'stand_by' && 
          client.fase_processo !== 'insoluto' && 
          client.fase_processo !== 'online' &&
          client.servizio !== 'mantenimento' && 
          client.fase_processo !== 'mantenimento'
        ).length;
        const realStandbyClients = clientsData.results.filter(client => client.fase_processo === 'stand_by').length;
        const realMaintenanceClients = clientsData.results.filter(client => 
          client.servizio === 'mantenimento' || client.fase_processo === 'mantenimento'
        ).length;
        
        // Snapshot con solo dati reali dal mese corrente in poi (ottobre 2025+)
        const simulatedSnapshots: MonthlySnapshot[] = [];
        
        // Solo mese corrente se siamo in ottobre 2025 o dopo
        if (currentDate.getFullYear() >= 2025 && currentDate.getMonth() >= 9) { // Ottobre = mese 9 (0-based)
          simulatedSnapshots.push({
            id: 1,
            mese: currentDate.getMonth() + 1,
            anno: currentDate.getFullYear(),
            clienti_attivi: realActiveClients,
            clienti_standby: realStandbyClients,
            clienti_mantenimento: realMaintenanceClients,
            data_json: {},
            created_at: `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-01T00:00:00Z`
          });
        }

        await new Promise(resolve => setTimeout(resolve, 1000)); // Simula loading
        
        setProjectHistory([]);
        setSnapshots(simulatedSnapshots);
      } catch (error) {
        console.error('Error fetching historical data:', error);
        toast.error('Errore nel caricamento dei dati storici');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-96"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
              <div className="h-16 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Calcoli per le metriche
  const currentMonth = snapshots[0];
  const currentDate = new Date();
  const currentMonthNumber = currentDate.getMonth() + 1; // getMonth() restituisce 0-11
  const currentYear = currentDate.getFullYear();
  
  // Progetti completati nel mese corrente (fase "online")
  const onlineClients = clients.filter(client => client.fase_processo === 'online');
  const projectsCompletedThisMonth = onlineClients.filter(client => {
    const updatedDate = new Date(client.updated_at);
    return updatedDate.getMonth() + 1 === currentMonthNumber && 
           updatedDate.getFullYear() === currentYear;
  });
  
  const totalProjectsThisMonth = projectsCompletedThisMonth.length;
  
  // Calcolo durata media reale: da data_richiesta a quando passano online
  const avgDuration = totalProjectsThisMonth > 0 ? Math.round(
    projectsCompletedThisMonth.reduce((acc, client) => {
      const startDate = new Date(client.data_richiesta);
      const endDate = new Date(client.updated_at);
      const durationDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      return acc + durationDays;
    }, 0) / totalProjectsThisMonth
  ) : 0;
  
  // Calcolo media progetti per persona nel mese corrente (dati reali)
  const teamSize = 4; // Federica, Marta, Edoardo, Virginia
  const realActiveClientsCount = clients.filter(client => 
    client.fase_processo !== 'stand_by' && 
    client.fase_processo !== 'insoluto' && 
    client.fase_processo !== 'online' &&
    client.servizio !== 'mantenimento' && 
    client.fase_processo !== 'mantenimento'
  ).length;
  const avgProjectsPerPerson = Math.round((realActiveClientsCount / teamSize) * 10) / 10;

  // Visualizzazione snapshots
  const displayedSnapshots = snapshotsExpanded 
    ? snapshots.slice(snapshotsPage * itemsPerPage, (snapshotsPage + 1) * itemsPerPage)
    : snapshots.slice(0, initialItemsCount);
  const totalSnapshotsPages = Math.ceil(snapshots.length / itemsPerPage);

  // Progetti completati reali (clienti con fase "online")
  const completedProjects = onlineClients.map(client => ({
    id: client.id,
    client_name: client.nome_attivita,
    team_member_name: client.operatore_detail?.name || 'Non assegnato',
    service: client.servizio,
    service_display: client.servizio_display || client.servizio,
    start_date: client.data_richiesta,
    completion_date: client.updated_at,
    duration_days: Math.ceil((new Date(client.updated_at).getTime() - new Date(client.data_richiesta).getTime()) / (1000 * 60 * 60 * 24)),
    notes: client.note || '',
    created_at: client.updated_at
  })).sort((a, b) => new Date(b.completion_date).getTime() - new Date(a.completion_date).getTime());

  // Visualizzazione progetti
  const displayedProjects = projectsExpanded 
    ? completedProjects.slice(projectsPage * itemsPerPage, (projectsPage + 1) * itemsPerPage)
    : completedProjects.slice(0, initialItemsCount);
  const totalProjectsPages = Math.ceil(completedProjects.length / itemsPerPage);

  // Funzioni per gestire espansione
  const handleSnapshotsExpand = () => {
    setSnapshotsExpanded(true);
    setSnapshotsPage(0);
  };

  const handleSnapshotsCollapse = () => {
    setSnapshotsExpanded(false);
    setSnapshotsPage(0);
  };

  const handleProjectsExpand = () => {
    setProjectsExpanded(true);
    setProjectsPage(0);
  };

  const handleProjectsCollapse = () => {
    setProjectsExpanded(false);
    setProjectsPage(0);
  };

  return (
    <div className="space-y-8">
      {/* Metriche Principali */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KPICard
          title="Progetti Completati"
          value={totalProjectsThisMonth}
          icon={Briefcase}
          color="blue"
        />
        <KPICard
          title="Durata Media Progetti"
          value={`${avgDuration} gg`}
          icon={Calendar}
          color="green"
        />
        <KPICard
          title="Media Progetti/Persona"
          value={avgProjectsPerPerson}
          icon={BarChart3}
          color="orange"
        />
        <KPICard
          title="Clienti Totali"
          value={clients.length}
          icon={Users}
          color="purple"
        />
      </div>

      {/* Andamento Mensile */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center mb-6">
          <BarChart3 className="h-6 w-6 text-primary-600 mr-2" />
          <h2 className="text-xl font-bold text-gray-900">
            Andamento Clienti Mensile
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Mese</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Clienti Attivi</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Stand-by</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Mantenimento</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Totale</th>
              </tr>
            </thead>
            <tbody>
              {displayedSnapshots.map((snapshot) => (
                <tr key={snapshot.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900">
                    {new Date(snapshot.anno, snapshot.mese - 1).toLocaleDateString('it-IT', {
                      month: 'long',
                      year: 'numeric'
                    })}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex px-2 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800">
                      {snapshot.clienti_attivi}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex px-2 py-1 text-sm font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      {snapshot.clienti_standby}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex px-2 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">
                      {snapshot.clienti_mantenimento}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-gray-900">
                    {snapshot.clienti_attivi + snapshot.clienti_standby + snapshot.clienti_mantenimento}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Controlli visualizzazione snapshots */}
        <div className="mt-4">
          {!snapshotsExpanded ? (
            // Mostra "Mostra altro" se ci sono più di 3 elementi
            snapshots.length > initialItemsCount && (
              <button
                onClick={handleSnapshotsExpand}
                className="w-full py-2 text-sm text-primary-600 hover:text-primary-700 border border-primary-200 rounded-md hover:bg-primary-50 transition-colors"
              >
                Mostra altro ({snapshots.length - initialItemsCount} altri)
              </button>
            )
          ) : (
            // Controlli quando espanso
            <div className="space-y-3">
              {/* Controlli paginazione */}
              {totalSnapshotsPages > 1 && (
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Pagina {snapshotsPage + 1} di {totalSnapshotsPages} ({snapshots.length} totali)
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSnapshotsPage(prev => Math.max(0, prev - 1))}
                      disabled={snapshotsPage === 0}
                      className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setSnapshotsPage(prev => Math.min(totalSnapshotsPages - 1, prev + 1))}
                      disabled={snapshotsPage === totalSnapshotsPages - 1}
                      className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
              {/* Pulsante Mostra meno */}
              <button
                onClick={handleSnapshotsCollapse}
                className="w-full py-2 text-sm text-gray-600 hover:text-gray-700 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
              >
                Mostra meno
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Progetti Completati */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center mb-6">
          <LineChart className="h-6 w-6 text-primary-600 mr-2" />
          <h2 className="text-xl font-bold text-gray-900">
            Progetti Completati Recenti
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Cliente</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Servizio</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Operatore</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Durata</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Completamento</th>
              </tr>
            </thead>
            <tbody>
              {displayedProjects.map((project) => (
                <tr key={project.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">
                    {project.client_name}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {project.service_display}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {project.team_member_name}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex px-2 py-1 text-sm font-semibold rounded-full bg-gray-100 text-gray-800">
                      {project.duration_days} giorni
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {new Date(project.completion_date).toLocaleDateString('it-IT')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Controlli visualizzazione progetti */}
        <div className="mt-4">
          {!projectsExpanded ? (
            // Mostra "Mostra altro" se ci sono più di 3 elementi
            completedProjects.length > initialItemsCount && (
              <button
                onClick={handleProjectsExpand}
                className="w-full py-2 text-sm text-primary-600 hover:text-primary-700 border border-primary-200 rounded-md hover:bg-primary-50 transition-colors"
              >
                Mostra altro ({completedProjects.length - initialItemsCount} altri)
              </button>
            )
          ) : (
            // Controlli quando espanso
            <div className="space-y-3">
              {/* Controlli paginazione */}
              {totalProjectsPages > 1 && (
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Pagina {projectsPage + 1} di {totalProjectsPages} ({completedProjects.length} totali)
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setProjectsPage(prev => Math.max(0, prev - 1))}
                      disabled={projectsPage === 0}
                      className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setProjectsPage(prev => Math.min(totalProjectsPages - 1, prev + 1))}
                      disabled={projectsPage === totalProjectsPages - 1}
                      className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
              {/* Pulsante Mostra meno */}
              <button
                onClick={handleProjectsCollapse}
                className="w-full py-2 text-sm text-gray-600 hover:text-gray-700 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
              >
                Mostra meno
              </button>
            </div>
          )}
        </div>
        
        {completedProjects.length === 0 && (
          <div className="text-center py-12">
            <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nessun progetto completato
            </h3>
            <p className="text-gray-500">
              I progetti completati appariranno qui una volta messi online.
            </p>
          </div>
        )}
      </div>

      {/* Performance del Team */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center mb-6">
          <Users className="h-6 w-6 text-primary-600 mr-2" />
          <h2 className="text-xl font-bold text-gray-900">
            Performance del Team
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {teamMembers.map((member, index) => {
            const memberCompletedProjects = projectsCompletedThisMonth.filter(
              client => client.operatore === member.id
            ).length;
            
            const colors = ['text-blue-600', 'text-green-600', 'text-purple-600', 'text-orange-600'];
            const colorClass = colors[index % colors.length];
            
            return (
              <div key={member.id} className="text-center p-4 border border-gray-200 rounded-lg">
                <div className={`text-2xl font-bold ${colorClass} mb-2`}>
                  {memberCompletedProjects}
                </div>
                <div className="text-sm text-gray-600">Progetti {member.name}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

