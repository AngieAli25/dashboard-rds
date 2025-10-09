import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    // Active clients: all clients EXCEPT those with state online, stand_by, insoluto or service type mantenimento
    const activeClients = await prisma.client.count({
      where: {
        AND: [
          {
            faseProcesso: {
              notIn: ['online', 'stand_by', 'insoluto'],
            },
          },
          {
            servizio: {
              not: 'mantenimento',
            },
          },
        ],
      },
    });

    const standbyClients = await prisma.client.count({
      where: {
        faseProcesso: 'stand_by',
      },
    });

    const maintenanceClients = await prisma.client.count({
      where: {
        servizio: 'mantenimento',
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
