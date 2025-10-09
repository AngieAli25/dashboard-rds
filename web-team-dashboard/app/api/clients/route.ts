import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search');
    const operatore = searchParams.get('operatore');
    const servizio = searchParams.get('servizio');
    const faseProcesso = searchParams.get('fase_processo');
    const seoStato = searchParams.get('seo_stato');
    const scadenzaFilter = searchParams.get('scadenza_filter');

    // Build where clause
    const where: any = {};

    if (search) {
      where.OR = [
        { nomeAttivita: { contains: search, mode: 'insensitive' } },
        { accountRiferimento: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (operatore) {
      where.operatoreId = parseInt(operatore);
    }

    if (servizio) {
      where.servizio = servizio;
    }

    if (faseProcesso) {
      where.faseProcesso = faseProcesso;
    }

    if (seoStato) {
      where.seoStato = seoStato;
    }

    // Scadenza filter
    if (scadenzaFilter) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (scadenzaFilter === 'oggi') {
        where.scadenza = today;
      } else if (scadenzaFilter === 'settimana') {
        const weekEnd = new Date(today);
        weekEnd.setDate(weekEnd.getDate() + 7);
        where.scadenza = {
          gte: today,
          lte: weekEnd,
        };
      } else if (scadenzaFilter === 'mese') {
        const monthEnd = new Date(today);
        monthEnd.setDate(monthEnd.getDate() + 30);
        where.scadenza = {
          gte: today,
          lte: monthEnd,
        };
      }
    }

    const clients = await prisma.client.findMany({
      where,
      include: {
        operatore: true,
      },
      orderBy: [
        { dataRichiesta: 'desc' },
        { nomeAttivita: 'asc' },
      ],
    });

    // Transform to match frontend expectations
    const transformedClients = clients.map((client) => ({
      id: client.id,
      nome_attivita: client.nomeAttivita,
      account_riferimento: client.accountRiferimento,
      tipologia_cliente: client.tipologiaCliente,
      servizio: client.servizio,
      servizio_display: getServizioDisplay(client.servizio),
      data_richiesta: client.dataRichiesta?.toISOString().split('T')[0] || '',
      operatore: client.operatoreId,
      operatore_detail: client.operatore ? {
        id: client.operatore.id,
        name: client.operatore.name,
        role: client.operatore.role as 'developer' | 'seo',
        active: client.operatore.active,
        created_at: client.operatore.createdAt.toISOString(),
        updated_at: client.operatore.updatedAt.toISOString(),
      } : undefined,
      fase_processo: client.faseProcesso,
      fase_processo_display: getFaseProcessoDisplay(client.faseProcesso),
      seo_stato: client.seoStato,
      seo_stato_display: getSeoStatoDisplay(client.seoStato),
      scadenza: client.scadenza?.toISOString().split('T')[0] || null,
      note: client.note,
      is_active: !['stand_by', 'insoluto', 'online'].includes(client.faseProcesso),
      is_maintenance: client.servizio === 'mantenimento' || client.faseProcesso === 'mantenimento',
      is_standby: client.faseProcesso === 'stand_by',
      created_at: client.createdAt.toISOString(),
      updated_at: client.updatedAt.toISOString(),
    }));

    return NextResponse.json({
      count: transformedClients.length,
      next: null,
      previous: null,
      results: transformedClients,
    });
  } catch (error) {
    console.error('Error fetching clients:', error);
    return NextResponse.json(
      { error: 'Failed to fetch clients' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const client = await prisma.client.create({
      data: {
        nomeAttivita: body.nome_attivita,
        accountRiferimento: body.account_riferimento || '',
        tipologiaCliente: body.tipologia_cliente,
        servizio: body.servizio,
        dataRichiesta: body.data_richiesta ? new Date(body.data_richiesta) : new Date(),
        operatoreId: body.operatore ? parseInt(body.operatore) : null,
        faseProcesso: body.fase_processo || '',
        seoStato: body.seo_stato || '',
        scadenza: body.scadenza ? new Date(body.scadenza) : null,
        note: body.note || '',
      },
      include: {
        operatore: true,
      },
    });

    // Transform response
    const transformedClient = {
      id: client.id,
      nome_attivita: client.nomeAttivita,
      account_riferimento: client.accountRiferimento,
      tipologia_cliente: client.tipologiaCliente,
      servizio: client.servizio,
      servizio_display: getServizioDisplay(client.servizio),
      data_richiesta: client.dataRichiesta?.toISOString().split('T')[0] || '',
      operatore: client.operatoreId,
      operatore_detail: client.operatore ? {
        id: client.operatore.id,
        name: client.operatore.name,
        role: client.operatore.role as 'developer' | 'seo',
        active: client.operatore.active,
        created_at: client.operatore.createdAt.toISOString(),
        updated_at: client.operatore.updatedAt.toISOString(),
      } : undefined,
      fase_processo: client.faseProcesso,
      fase_processo_display: getFaseProcessoDisplay(client.faseProcesso),
      seo_stato: client.seoStato,
      seo_stato_display: getSeoStatoDisplay(client.seoStato),
      scadenza: client.scadenza?.toISOString().split('T')[0] || null,
      note: client.note,
      is_active: !['stand_by', 'insoluto', 'online'].includes(client.faseProcesso),
      is_maintenance: client.servizio === 'mantenimento' || client.faseProcesso === 'mantenimento',
      is_standby: client.faseProcesso === 'stand_by',
      created_at: client.createdAt.toISOString(),
      updated_at: client.updatedAt.toISOString(),
    };

    return NextResponse.json(transformedClient, { status: 201 });
  } catch (error) {
    console.error('Error creating client:', error);
    return NextResponse.json(
      { error: 'Failed to create client' },
      { status: 500 }
    );
  }
}

// Helper functions for display names
function getServizioDisplay(servizio: string): string {
  const map: Record<string, string> = {
    'sito_vetrina': 'Sito Vetrina',
    'sito_strutturato': 'Sito Strutturato',
    'ecommerce': 'E-commerce',
    'landing_page': 'Landing Page',
    'app_webapp': 'App/Webapp',
    'blog': 'Blog',
    'mantenimento': 'Mantenimento',
    'gestione': 'Gestione',
  };
  return map[servizio] || servizio;
}

function getFaseProcessoDisplay(fase: string): string {
  const map: Record<string, string> = {
    'prima_call': 'Prima call',
    'implementazione': 'Implementazione',
    'in_revisione': 'In revisione',
    'presentazione': 'Presentazione',
    'da_mettere_online': 'Da mettere online',
    'online': 'Online',
    'gestione': 'Gestione',
    'mantenimento': 'Mantenimento',
    'stand_by': 'Stand-by',
    'insoluto': 'Insoluto',
    'da_fare': 'Da fare',
  };
  return map[fase] || fase;
}

function getSeoStatoDisplay(stato: string): string {
  const map: Record<string, string> = {
    '': 'Nessuno',
    'call': 'Call',
    'analisi': 'Analisi',
    'ottimizzazione_testi': 'Ottimizzazione Testi',
    'yoast_seo': 'Yoast SEO',
    'gestione_blog': 'Gestione Blog',
    'gestione_seo': 'Gestione SEO',
    'report': 'Report',
  };
  return map[stato] || stato;
}
