import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const history = await prisma.projectHistory.findMany({
      include: {
        client: true,
        operator: true,
      },
      orderBy: {
        dataInizio: 'desc',
      },
    });

    const transformedHistory = history.map((project) => ({
      id: project.id,
      client: project.clientId,
      client_detail: project.client ? {
        id: project.client.id,
        nome_attivita: project.client.nomeAttivita,
        account_riferimento: project.client.accountRiferimento,
        tipologia_cliente: project.client.tipologiaCliente,
        servizio: project.client.servizio,
      } : undefined,
      operator: project.operatorId,
      operator_detail: project.operator ? {
        id: project.operator.id,
        name: project.operator.name,
        role: project.operator.role,
        active: project.operator.active,
        created_at: project.operator.createdAt.toISOString(),
        updated_at: project.operator.updatedAt.toISOString(),
      } : undefined,
      data_inizio: project.dataInizio.toISOString().split('T')[0],
      data_completamento: project.dataCompletamento?.toISOString().split('T')[0] || null,
      servizio: project.servizio,
      note: project.note,
      created_at: project.createdAt.toISOString(),
    }));

    return NextResponse.json({
      count: transformedHistory.length,
      next: null,
      previous: null,
      results: transformedHistory,
    });
  } catch (error) {
    console.error('Error fetching project history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project history' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const project = await prisma.projectHistory.create({
      data: {
        clientId: body.client,
        operatorId: body.operator || null,
        dataInizio: new Date(body.data_inizio),
        dataCompletamento: body.data_completamento ? new Date(body.data_completamento) : null,
        servizio: body.servizio,
        note: body.note || '',
      },
      include: {
        client: true,
        operator: true,
      },
    });

    return NextResponse.json({
      id: project.id,
      client: project.clientId,
      operator: project.operatorId,
      data_inizio: project.dataInizio.toISOString().split('T')[0],
      data_completamento: project.dataCompletamento?.toISOString().split('T')[0] || null,
      servizio: project.servizio,
      note: project.note,
      created_at: project.createdAt.toISOString(),
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating project history:', error);
    return NextResponse.json(
      { error: 'Failed to create project history' },
      { status: 500 }
    );
  }
}
