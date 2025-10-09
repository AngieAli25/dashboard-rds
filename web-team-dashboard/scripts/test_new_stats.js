const { Client } = require('pg');

const connectionString = "postgres://dc6c3d9469bd9c468867fef0b21861f4f079d11d9b9ec808abab9a74b5f59d49:sk_CjgXUEcmgR4sqlYP_FlE9@db.prisma.io:5432/postgres?sslmode=require";

async function testNewStats() {
  console.log('🧪 Test Nuova Logica Statistiche\n');

  const client = new Client({ connectionString });

  try {
    await client.connect();

    // NUOVA LOGICA: Clienti Attivi (con in_revisione e gestione)
    const attivi = await client.query(`
      SELECT COUNT(*) FROM clients
      WHERE fase_processo IN ('prima_call', 'implementazione', 'in_revisione', 'presentazione', 'da_mettere_online', 'gestione')
    `);

    // Stand-by
    const standby = await client.query(`
      SELECT COUNT(*) FROM clients
      WHERE fase_processo = 'stand_by'
    `);

    // Mantenimento
    const mantenimento = await client.query(`
      SELECT COUNT(*) FROM clients
      WHERE servizio = 'mantenimento' OR fase_processo = 'mantenimento'
    `);

    const totale = parseInt(attivi.rows[0].count) + parseInt(standby.rows[0].count) + parseInt(mantenimento.rows[0].count);

    console.log('📊 NUOVE STATISTICHE:');
    console.log(`   ✅ Clienti ATTIVI: ${attivi.rows[0].count}`);
    console.log(`   ⏸️  Clienti STAND-BY: ${standby.rows[0].count}`);
    console.log(`   🔧 Clienti MANTENIMENTO: ${mantenimento.rows[0].count}`);
    console.log(`   📈 TOTALE: ${totale}`);

    console.log('\n✅ Ora dovrebbe mostrare 32 clienti attivi come prima!');

  } catch (error) {
    console.error('❌ Errore:', error.message);
  } finally {
    await client.end();
  }
}

testNewStats();
