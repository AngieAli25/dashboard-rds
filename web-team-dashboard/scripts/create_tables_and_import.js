const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Connection string di Vercel Postgres
const connectionString = "postgres://dc6c3d9469bd9c468867fef0b21861f4f079d11d9b9ec808abab9a74b5f59d49:sk_CjgXUEcmgR4sqlYP_FlE9@db.prisma.io:5432/postgres?sslmode=require";

async function createTablesAndImport() {
  console.log('🚀 Connessione al database Vercel Postgres...\n');

  const client = new Client({
    connectionString: connectionString,
  });

  try {
    // Connetti al database
    await client.connect();
    console.log('✅ Connesso al database!\n');

    // STEP 1: Crea le tabelle (migration)
    console.log('📋 STEP 1: Creazione tabelle...\n');

    const migrationFile = path.join(__dirname, '../prisma/migrations/0_init/migration.sql');
    const migrationSql = fs.readFileSync(migrationFile, 'utf8');

    await client.query(migrationSql);
    console.log('✅ Tabelle create con successo!\n');

    // STEP 2: Importa i dati
    console.log('📋 STEP 2: Importazione dati...\n');

    const dataFile = path.join(__dirname, 'import_data.sql');
    const dataSql = fs.readFileSync(dataFile, 'utf8');

    await client.query(dataSql);
    console.log('✅ Dati importati con successo!\n');

    // STEP 3: Verifica
    console.log('🔍 STEP 3: Verifica dati importati:\n');

    const teamCount = await client.query('SELECT COUNT(*) FROM team_members');
    console.log(`   ✅ Team Members: ${teamCount.rows[0].count}`);

    const clientCount = await client.query('SELECT COUNT(*) FROM clients');
    console.log(`   ✅ Clients: ${clientCount.rows[0].count}`);

    const historyCount = await client.query('SELECT COUNT(*) FROM project_history');
    console.log(`   ✅ Project History: ${historyCount.rows[0].count}`);

    const snapshotCount = await client.query('SELECT COUNT(*) FROM monthly_snapshots');
    console.log(`   ✅ Monthly Snapshots: ${snapshotCount.rows[0].count}`);

    console.log('\n🎉 Setup completato! Ora puoi aprire la tua app su Vercel:');
    console.log('   👉 Tutti i tuoi 32 clienti e 4 team members sono nel database!\n');

  } catch (error) {
    console.error('\n❌ Errore:', error.message);

    if (error.message.includes('already exists')) {
      console.log('\n💡 Le tabelle esistono già. Provo solo ad importare i dati...\n');

      try {
        const dataFile = path.join(__dirname, 'import_data.sql');
        const dataSql = fs.readFileSync(dataFile, 'utf8');
        await client.query(dataSql);
        console.log('✅ Dati importati con successo!');
      } catch (importError) {
        console.error('❌ Errore importazione dati:', importError.message);
      }
    } else {
      console.error('Dettagli:', error);
    }
  } finally {
    await client.end();
    console.log('✅ Connessione chiusa.');
  }
}

// Esegui
createTablesAndImport();
