const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Load .env file
require('dotenv').config();

const connectionString = process.env.PRISMA_DATABASE_URL || process.env.POSTGRES_URL;

async function applyMigration() {
  console.log('🔄 Applicando migration per operatori multipli...\n');

  const client = new Client({ connectionString });

  try {
    await client.connect();
    console.log('✅ Connesso al database\n');

    // Read migration SQL
    const migrationSql = fs.readFileSync(
      path.join(__dirname, '../prisma/migrations/20251009123952_add_multiple_operators/migration.sql'),
      'utf8'
    );

    console.log('📝 Eseguendo migration SQL...\n');
    await client.query(migrationSql);

    console.log('✅ Migration applicata con successo!');
    console.log('\n📊 Verifico i dati migrati...\n');

    // Verify
    const result = await client.query('SELECT COUNT(*) FROM client_operators');
    console.log(`✅ Trovati ${result.rows[0].count} assegnamenti operatore-cliente`);

  } catch (error) {
    console.error('❌ Errore durante la migration:', error.message);
    throw error;
  } finally {
    await client.end();
  }
}

applyMigration();
