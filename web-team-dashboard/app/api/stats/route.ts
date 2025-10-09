import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const activeClients = await prisma.client.count({
      where: {
        faseProcesso: {
          in: ['prima_call', 'implementazione', 'presentazione', 'da_mettere_online'],
        },
      },
    });

    const standbyClients = await prisma.client.count({
      where: {
        faseProcesso: 'stand_by',
      },
    });

    const maintenanceClients = await prisma.client.count({
      where: {
        OR: [
          { servizio: 'mantenimento' },
          { faseProcesso: 'mantenimento' },
        ],
      },
    });

    return NextResponse.json({
      clienti_attivi: activeClients,
      clienti_standby: standbyClients,
      clienti_mantenimento: maintenanceClients,
      totale_clienti: activeClients + standbyClients + maintenanceClients,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
