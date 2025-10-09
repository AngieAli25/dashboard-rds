import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const teamMembers = await prisma.teamMember.findMany({
      where: {
        active: true,
      },
      include: {
        clients: {
          where: {
            faseProcesso: {
              in: ['prima_call', 'implementazione', 'in_revisione', 'presentazione', 'da_mettere_online', 'gestione'],
            },
          },
        },
      },
    });

    const workloadData = teamMembers.map((member) => {
      // Group clients by service type
      const clientTypes: Record<string, any[]> = {};

      member.clients.forEach((client) => {
        const serviceType = client.servizio;
        if (!clientTypes[serviceType]) {
          clientTypes[serviceType] = [];
        }
        clientTypes[serviceType].push({
          nome: client.nomeAttivita,
          fase: client.faseProcesso,
          scadenza: client.scadenza?.toISOString().split('T')[0] || null,
        });
      });

      return {
        id: member.id,
        name: member.name,
        role: member.role,
        total_clients: member.clients.length,
        active_clients: member.clients.length,
        client_types: clientTypes,
      };
    });

    return NextResponse.json(workloadData);
  } catch (error) {
    console.error('Error fetching workload:', error);
    return NextResponse.json(
      { error: 'Failed to fetch workload' },
      { status: 500 }
    );
  }
}
