'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, Calendar, Users, Briefcase, BarChart3, LineChart, PieChart } from 'lucide-react';
import { KPICard } from '@/components/dashboard/KPICard';
import { ProjectHistory, MonthlySnapshot } from '@/types';
import toast from 'react-hot-toast';

export default function StoricoPage() {
  const [projectHistory, setProjectHistory] = useState<ProjectHistory[]>([]);
  const [snapshots, setSnapshots] = useState<MonthlySnapshot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulazione dati per ora, da sostituire con chiamate API reali
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Dati simulati per lo storico progetti
        const simulatedHistory: ProjectHistory[] = [
          {
            id: 1,
            client_name: "Ristorante Da Marco",
            team_member_name: "Federica",
            service: "sito_vetrina",
            service_display: "Sito Vetrina",
            start_date: "2025-08-15",
            completion_date: "2025-09-10",
            duration_days: 26,
            notes: "Progetto completato con successo",
            created_at: "2025-09-10T10:00:00Z"
          },
          {
            id: 2,
            client_name: "Studio Dentistico Smile",
            team_member_name: "Marta",
            service: "landing_page",
            service_display: "Landing Page",
            start_date: "2025-08-20",
            completion_date: "2025-09-05",
            duration_days: 16,
            notes: "Cliente molto soddisfatto",
            created_at: "2025-09-05T14:30:00Z"
          },
          {
            id: 3,
            client_name: "Negozio Abbigliamento Fashion",
            team_member_name: "Edoardo",
            service: "ecommerce",
            service_display: "E-commerce",
            start_date: "2025-07-01",
            completion_date: "2025-08-30",
            duration_days: 60,
            notes: "Progetto complesso con integrazione pagamenti",
            created_at: "2025-08-30T16:45:00Z"
          }
        ];

        // Dati simulati per gli snapshot mensili
        const simulatedSnapshots: MonthlySnapshot[] = [
          {
            id: 1,
            month: 9,
            year: 2025,
            active_clients: 5,
            standby_clients: 2,
            maintenance_clients: 3,
            total_clients: 10,
            created_at: "2025-09-01T00:00:00Z"
          },
          {
            id: 2,
            month: 8,
            year: 2025,
            active_clients: 7,
            standby_clients: 1,
            maintenance_clients: 2,
            total_clients: 10,
            created_at: "2025-08-01T00:00:00Z"
          },
          {
            id: 3,
            month: 7,
            year: 2025,
            active_clients: 6,
            standby_clients: 3,
            maintenance_clients: 1,
            total_clients: 10,
            created_at: "2025-07-01T00:00:00Z"
          }
        ];

        await new Promise(resolve => setTimeout(resolve, 1000)); // Simula loading
        
        setProjectHistory(simulatedHistory);
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
  const totalProjects = projectHistory.length;
  const avgDuration = Math.round(
    projectHistory.reduce((acc, project) => acc + project.duration_days, 0) / totalProjects
  );
  const currentMonth = snapshots[0];
  const previousMonth = snapshots[1];
  const growthRate = previousMonth 
    ? Math.round(((currentMonth.total_clients - previousMonth.total_clients) / previousMonth.total_clients) * 100)
    : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Storico e Analisi
        </h1>
        <p className="text-gray-600">
          Panoramica delle performance del team e andamento dei progetti
        </p>
      </div>

      {/* Metriche Principali */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KPICard
          title="Progetti Completati"
          value={totalProjects}
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
          title="Crescita Mensile"
          value={`${growthRate}%`}
          icon={TrendingUp}
          color={growthRate > 0 ? "green" : "red"}
        />
        <KPICard
          title="Clienti Totali"
          value={currentMonth?.total_clients || 0}
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
              {snapshots.map((snapshot) => (
                <tr key={snapshot.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900">
                    {new Date(snapshot.year, snapshot.month - 1).toLocaleDateString('it-IT', { 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex px-2 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800">
                      {snapshot.active_clients}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex px-2 py-1 text-sm font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      {snapshot.standby_clients}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex px-2 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">
                      {snapshot.maintenance_clients}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-gray-900">
                    {snapshot.total_clients}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
              {projectHistory.map((project) => (
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
        
        {projectHistory.length === 0 && (
          <div className="text-center py-12">
            <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nessun progetto completato
            </h3>
            <p className="text-gray-500">
              I progetti completati appariranno qui una volta finalizzati.
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
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {projectHistory.filter(p => p.team_member_name === 'Federica').length}
            </div>
            <div className="text-sm text-gray-600">Progetti Federica</div>
          </div>
          
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="text-2xl font-bold text-green-600 mb-2">
              {projectHistory.filter(p => p.team_member_name === 'Marta').length}
            </div>
            <div className="text-sm text-gray-600">Progetti Marta</div>
          </div>
          
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="text-2xl font-bold text-purple-600 mb-2">
              {projectHistory.filter(p => p.team_member_name === 'Edoardo').length}
            </div>
            <div className="text-sm text-gray-600">Progetti Edoardo</div>
          </div>
        </div>
      </div>
    </div>
  );
}

