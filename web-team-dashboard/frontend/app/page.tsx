'use client';

import { useEffect, useState } from 'react';
import { Users, Clock, Briefcase, TrendingUp } from 'lucide-react';
import { KPICard } from '@/components/dashboard/KPICard';
import { TeamMemberCard } from '@/components/dashboard/TeamMemberCard';
import { dashboardApi } from '@/lib/api';
import { DashboardStats, TeamWorkload } from '@/types';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [teamWorkload, setTeamWorkload] = useState<TeamWorkload[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsData, workloadData] = await Promise.all([
          dashboardApi.getStats(),
          dashboardApi.getTeamWorkload(),
        ]);
        
        setStats(statsData);
        setTeamWorkload(workloadData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Errore nel caricamento dei dati');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
              <div className="h-48 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <KPICard
            title="Clienti Attivi"
            value={stats.clienti_attivi}
            icon={Users}
            color="blue"
          />
          <KPICard
            title="Clienti in Stand-by"
            value={stats.clienti_standby}
            icon={Clock}
            color="yellow"
          />
          <KPICard
            title="Clienti in Mantenimento"
            value={stats.clienti_mantenimento}
            icon={Briefcase}
            color="green"
          />
        </div>
      )}

      {/* Team Workload */}
      <div>
        <div className="flex items-center mb-6">
          <TrendingUp className="h-6 w-6 text-primary-600 mr-2" />
          <h2 className="text-2xl font-bold text-gray-900">
            Carico di Lavoro del Team
          </h2>
        </div>
        
        {teamWorkload.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {teamWorkload.map((member) => (
              <TeamMemberCard key={member.id} member={member} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nessun dato disponibile
            </h3>
            <p className="text-gray-500">
              Non ci sono membri del team o clienti assegnati al momento.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}