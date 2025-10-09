const { Client } = require('pg');

const connectionString = "postgres://dc6c3d9469bd9c468867fef0b21861f4f079d11d9b9ec808abab9a74b5f59d49:sk_CjgXUEcmgR4sqlYP_FlE9@db.prisma.io:5432/postgres?sslmode=require";

async function testCorrectStats() {
  console.log('🧪 Test Logica Statistiche Corretta\n');

  const client = new Client({ connectionString });

  try {
    await client.connect();

    // LOGICA CORRETTA: Clienti Attivi = tutti TRANNE online, stand_by, insoluto e servizio=mantenimento
    const attivi = await client.query(`
      SELECT COUNT(*) FROM clients
      WHERE fase_processo NOT IN ('online', 'stand_by', 'insoluto')
        AND servizio != 'mantenimento'
    `);

    // Stand-by
    const standby = await client.query(`
      SELECT COUNT(*) FROM clients
      WHERE fase_processo = 'stand_by'
    `);

    // Mantenimento (solo servizio)
    const mantenimento = await client.query(`
      SELECT COUNT(*) FROM clients
      WHERE servizio = 'mantenimento'
    `);

    const totale = parseInt(attivi.rows[0].count) + parseInt(standby.rows[0].count) + parseInt(mantenimento.rows[0].count);

    console.log('📊 STATISTICHE CORRETTE:');
    console.log(`   ✅ Clienti ATTIVI: ${attivi.rows[0].count}`);
    console.log(`   ⏸️  Clienti STAND-BY: ${standby.rows[0].count}`);
    console.log(`   🔧 Clienti MANTENIMENTO: ${mantenimento.rows[0].count}`);
    console.log(`   📈 TOTALE: ${totale}`);

    console.log('\n🔍 Verifica dettagli clienti attivi:');
    const dettagliAttivi = await client.query(`
      SELECT fase_processo, servizio, COUNT(*) as count
      FROM clients
      WHERE fase_processo NOT IN ('online', 'stand_by', 'insoluto')
        AND servizio != 'mantenimento'
      GROUP BY fase_processo, servizio
      ORDER BY fase_processo, servizio
    `);

    dettagliAttivi.rows.forEach(row => {
      console.log(`   - ${row.fase_processo} / ${row.servizio}: ${row.count}`);
    });

  } catch (error) {
    console.error('❌ Errore:', error.message);
  } finally {
    await client.end();
  }
}

testCorrectStats();
