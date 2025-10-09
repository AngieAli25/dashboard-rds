const { Client } = require('pg');

const connectionString = "postgres://dc6c3d9469bd9c468867fef0b21861f4f079d11d9b9ec808abab9a74b5f59d49:sk_CjgXUEcmgR4sqlYP_FlE9@db.prisma.io:5432/postgres?sslmode=require";

async function verifyData() {
  console.log('🔍 Verifica Dati Dashboard\n');

  const client = new Client({ connectionString });

  try {
    await client.connect();

    // Totale clienti
    const total = await client.query('SELECT COUNT(*) FROM clients');
    console.log(`📊 TOTALE CLIENTI: ${total.rows[0].count}\n`);

    // Clienti per fase_processo
    const byFase = await client.query(`
      SELECT fase_processo, COUNT(*) as count
      FROM clients
      GROUP BY fase_processo
      ORDER BY count DESC
    `);

    console.log('📋 CLIENTI PER FASE PROCESSO:');
    byFase.rows.forEach(row => {
      console.log(`   ${row.fase_processo || '(vuoto)'}: ${row.count}`);
    });

    // Clienti per servizio
    console.log('\n📋 CLIENTI PER SERVIZIO:');
    const byServizio = await client.query(`
      SELECT servizio, COUNT(*) as count
      FROM clients
      GROUP BY servizio
      ORDER BY count DESC
    `);
    byServizio.rows.forEach(row => {
      console.log(`   ${row.servizio}: ${row.count}`);
    });

    // Calcolo statistiche come nel codice
    console.log('\n📊 CALCOLO STATISTICHE (come nel codice):');

    // Clienti Attivi (fase_processo in: prima_call, implementazione, presentazione, da_mettere_online)
    const attivi = await client.query(`
      SELECT COUNT(*) FROM clients
      WHERE fase_processo IN ('prima_call', 'implementazione', 'presentazione', 'da_mettere_online')
    `);
    console.log(`   ✅ Clienti ATTIVI: ${attivi.rows[0].count}`);

    // Clienti Stand-by (fase_processo = 'stand_by')
    const standby = await client.query(`
      SELECT COUNT(*) FROM clients
      WHERE fase_processo = 'stand_by'
    `);
    console.log(`   ⏸️  Clienti STAND-BY: ${standby.rows[0].count}`);

    // Clienti Mantenimento (servizio = 'mantenimento' OR fase_processo = 'mantenimento')
    const mantenimento = await client.query(`
      SELECT COUNT(*) FROM clients
      WHERE servizio = 'mantenimento' OR fase_processo = 'mantenimento'
    `);
    console.log(`   🔧 Clienti MANTENIMENTO: ${mantenimento.rows[0].count}`);

    // Dettaglio clienti attivi
    console.log('\n📝 DETTAGLIO CLIENTI ATTIVI:');
    const dettaglioAttivi = await client.query(`
      SELECT nome_attivita, fase_processo
      FROM clients
      WHERE fase_processo IN ('prima_call', 'implementazione', 'presentazione', 'da_mettere_online')
      ORDER BY fase_processo, nome_attivita
    `);
    dettaglioAttivi.rows.forEach(row => {
      console.log(`   - ${row.nome_attivita} (${row.fase_processo})`);
    });

  } catch (error) {
    console.error('❌ Errore:', error.message);
  } finally {
    await client.end();
  }
}

verifyData();
