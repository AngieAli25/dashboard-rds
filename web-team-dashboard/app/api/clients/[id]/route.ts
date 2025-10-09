import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr);

    const client = await prisma.client.findUnique({
      where: { id },
      include: {
        operators: {
          include: {
            teamMember: true,
          },
        },
      },
    });

    if (!client) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      );
    }

    const transformedClient = {
      id: client.id,
      nome_attivita: client.nomeAttivita,
      account_riferimento: client.accountRiferimento,
      tipologia_cliente: client.tipologiaCliente,
      servizio: client.servizio,
      data_richiesta: client.dataRichiesta?.toISOString().split('T')[0] || '',
      operatori: client.operators.map(op => op.teamMember.id),
      operatori_details: client.operators.map(op => ({
        id: op.teamMember.id,
        name: op.teamMember.name,
        role: op.teamMember.role,
        active: op.teamMember.active,
        created_at: op.teamMember.createdAt.toISOString(),
        updated_at: op.teamMember.updatedAt.toISOString(),
      })),
      // Keep backward compatibility
      operatore: client.operators[0]?.teamMember.id || null,
      operatore_detail: client.operators[0] ? {
        id: client.operators[0].teamMember.id,
        name: client.operators[0].teamMember.name,
        role: client.operators[0].teamMember.role,
        active: client.operators[0].teamMember.active,
        created_at: client.operators[0].teamMember.createdAt.toISOString(),
        updated_at: client.operators[0].teamMember.updatedAt.toISOString(),
      } : undefined,
      fase_processo: client.faseProcesso,
      seo_stato: client.seoStato,
      scadenza: client.scadenza?.toISOString().split('T')[0] || null,
      note: client.note,
      is_active: !['stand_by', 'insoluto', 'online'].includes(client.faseProcesso),
      is_maintenance: client.servizio === 'mantenimento' || client.faseProcesso === 'mantenimento',
      is_standby: client.faseProcesso === 'stand_by',
      created_at: client.createdAt.toISOString(),
      updated_at: client.updatedAt.toISOString(),
    };

    return NextResponse.json(transformedClient);
  } catch (error) {
    console.error('Error fetching client:', error);
    return NextResponse.json(
      { error: 'Failed to fetch client' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr);
    const body = await request.json();

    // Build update data
    const updateData: any = {};

    if (body.nome_attivita !== undefined) updateData.nomeAttivita = body.nome_attivita;
    if (body.account_riferimento !== undefined) updateData.accountRiferimento = body.account_riferimento;
    if (body.tipologia_cliente !== undefined) updateData.tipologiaCliente = body.tipologia_cliente;
    if (body.servizio !== undefined) updateData.servizio = body.servizio;
    if (body.data_richiesta !== undefined) updateData.dataRichiesta = body.data_richiesta ? new Date(body.data_richiesta) : null;
    if (body.fase_processo !== undefined) updateData.faseProcesso = body.fase_processo;
    if (body.seo_stato !== undefined) updateData.seoStato = body.seo_stato;
    if (body.scadenza !== undefined) updateData.scadenza = body.scadenza ? new Date(body.scadenza) : null;
    if (body.note !== undefined) updateData.note = body.note;

    // Handle operators update
    if (body.operatori !== undefined || body.operatore !== undefined) {
      const operatoriIds = body.operatori || (body.operatore ? [parseInt(body.operatore)] : []);

      // Delete existing operators and create new ones
      await prisma.clientOperator.deleteMany({
        where: { clientId: id },
      });

      if (operatoriIds.length > 0) {
        await prisma.clientOperator.createMany({
          data: operatoriIds.map((teamMemberId: number) => ({
            clientId: id,
            teamMemberId,
          })),
        });
      }
    }

    const client = await prisma.client.update({
      where: { id },
      data: updateData,
      include: {
        operators: {
          include: {
            teamMember: true,
          },
        },
      },
    });

    const transformedClient = {
      id: client.id,
      nome_attivita: client.nomeAttivita,
      account_riferimento: client.accountRiferimento,
      tipologia_cliente: client.tipologiaCliente,
      servizio: client.servizio,
      data_richiesta: client.dataRichiesta?.toISOString().split('T')[0] || '',
      operatori: client.operators.map(op => op.teamMember.id),
      operatori_details: client.operators.map(op => ({
        id: op.teamMember.id,
        name: op.teamMember.name,
        role: op.teamMember.role,
        active: op.teamMember.active,
        created_at: op.teamMember.createdAt.toISOString(),
        updated_at: op.teamMember.updatedAt.toISOString(),
      })),
      // Keep backward compatibility
      operatore: client.operators[0]?.teamMember.id || null,
      operatore_detail: client.operators[0] ? {
        id: client.operators[0].teamMember.id,
        name: client.operators[0].teamMember.name,
        role: client.operators[0].teamMember.role,
        active: client.operators[0].teamMember.active,
        created_at: client.operators[0].teamMember.createdAt.toISOString(),
        updated_at: client.operators[0].teamMember.updatedAt.toISOString(),
      } : undefined,
      fase_processo: client.faseProcesso,
      seo_stato: client.seoStato,
      scadenza: client.scadenza?.toISOString().split('T')[0] || null,
      note: client.note,
      is_active: !['stand_by', 'insoluto', 'online'].includes(client.faseProcesso),
      is_maintenance: client.servizio === 'mantenimento' || client.faseProcesso === 'mantenimento',
      is_standby: client.faseProcesso === 'stand_by',
      created_at: client.createdAt.toISOString(),
      updated_at: client.updatedAt.toISOString(),
    };

    return NextResponse.json(transformedClient);
  } catch (error) {
    console.error('Error updating client:', error);
    return NextResponse.json(
      { error: 'Failed to update client' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr);

    await prisma.client.delete({
      where: { id },
    });

    return NextResponse.json({ success: true }, { status: 204 });
  } catch (error) {
    console.error('Error deleting client:', error);
    return NextResponse.json(
      { error: 'Failed to delete client' },
      { status: 500 }
    );
  }
}
