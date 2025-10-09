import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const snapshots = await prisma.monthlySnapshot.findMany({
      orderBy: [
        { anno: 'desc' },
        { mese: 'desc' },
      ],
    });

    const transformedSnapshots = snapshots.map((snapshot) => ({
      id: snapshot.id,
      mese: snapshot.mese,
      anno: snapshot.anno,
      clienti_attivi: snapshot.clientiAttivi,
      clienti_standby: snapshot.clientiStandby,
      clienti_mantenimento: snapshot.clientiMantenimento,
      data_json: snapshot.dataJson,
      created_at: snapshot.createdAt.toISOString(),
    }));

    return NextResponse.json({
      count: transformedSnapshots.length,
      next: null,
      previous: null,
      results: transformedSnapshots,
    });
  } catch (error) {
    console.error('Error fetching snapshots:', error);
    return NextResponse.json(
      { error: 'Failed to fetch snapshots' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const snapshot = await prisma.monthlySnapshot.create({
      data: {
        mese: body.mese,
        anno: body.anno,
        clientiAttivi: body.clienti_attivi || 0,
        clientiStandby: body.clienti_standby || 0,
        clientiMantenimento: body.clienti_mantenimento || 0,
        dataJson: body.data_json || {},
      },
    });

    return NextResponse.json({
      id: snapshot.id,
      mese: snapshot.mese,
      anno: snapshot.anno,
      clienti_attivi: snapshot.clientiAttivi,
      clienti_standby: snapshot.clientiStandby,
      clienti_mantenimento: snapshot.clientiMantenimento,
      data_json: snapshot.dataJson,
      created_at: snapshot.createdAt.toISOString(),
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating snapshot:', error);
    return NextResponse.json(
      { error: 'Failed to create snapshot' },
      { status: 500 }
    );
  }
}
