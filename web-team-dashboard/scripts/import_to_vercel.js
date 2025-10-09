const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Connection string di Vercel Postgres
const connectionString = "postgres://dc6c3d9469bd9c468867fef0b21861f4f079d11d9b9ec808abab9a74b5f59d49:sk_CjgXUEcmgR4sqlYP_FlE9@db.prisma.io:5432/postgres?sslmode=require";

async function importData() {
  console.log('🚀 Connessione al database Vercel Postgres...\n');

  const client = new Client({
    connectionString: connectionString,
  });

  try {
    // Connetti al database
    await client.connect();
    console.log('✅ Connesso al database!\n');

    // Leggi il file SQL
    const sqlFile = path.join(__dirname, 'import_data.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');

    console.log('📄 File SQL caricato. Inizio importazione...\n');

    // Esegui l'SQL
    const result = await client.query(sql);

    console.log('✅ Importazione completata con successo!\n');

    // Verifica i dati importati
    console.log('🔍 Verifica dati importati:\n');

    const teamCount = await client.query('SELECT COUNT(*) FROM team_members');
    console.log(`   - Team Members: ${teamCount.rows[0].count}`);

    const clientCount = await client.query('SELECT COUNT(*) FROM clients');
    console.log(`   - Clients: ${clientCount.rows[0].count}`);

    const historyCount = await client.query('SELECT COUNT(*) FROM project_history');
    console.log(`   - Project History: ${historyCount.rows[0].count}`);

    const snapshotCount = await client.query('SELECT COUNT(*) FROM monthly_snapshots');
    console.log(`   - Monthly Snapshots: ${snapshotCount.rows[0].count}`);

    console.log('\n🎉 Import completato! Ora puoi aprire la tua app su Vercel e vedere tutti i dati.');

  } catch (error) {
    console.error('❌ Errore durante l\'importazione:', error.message);
    console.error('\nDettagli errore:', error);
    process.exit(1);
  } finally {
    await client.end();
    console.log('\n✅ Connessione chiusa.');
  }
}

// Esegui l'import
importData();
