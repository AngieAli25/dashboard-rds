const fs = require('fs');
const path = require('path');

// Leggi il file JSON esportato da Django
const djangoData = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'django_export.json'), 'utf8')
);

// Funzione helper per escape SQL strings
function escapeSqlString(str) {
  if (str === null || str === undefined) return 'NULL';
  return "'" + String(str).replace(/'/g, "''") + "'";
}

function formatDate(dateStr) {
  if (!dateStr) return 'NULL';
  return escapeSqlString(dateStr.split('T')[0]);
}

function formatTimestamp(dateStr) {
  if (!dateStr) return 'NOW()';
  return escapeSqlString(dateStr);
}

// SQL output
let sql = [];

// Header
sql.push('-- Importazione dati da Django');
sql.push('-- Generato automaticamente\n');

// Disabilita trigger temporaneamente per import più veloce
sql.push('-- Disabilita temporaneamente i vincoli');
sql.push('SET session_replication_role = replica;\n');

// Gruppo dati per modello
const teamMembers = [];
const clients = [];
const projectHistory = [];
const monthlySnapshots = [];

djangoData.forEach(item => {
  switch(item.model) {
    case 'clients.teammember':
      teamMembers.push(item);
      break;
    case 'clients.client':
      clients.push(item);
      break;
    case 'clients.projecthistory':
      projectHistory.push(item);
      break;
    case 'clients.monthlysnapshot':
      monthlySnapshots.push(item);
      break;
  }
});

// Import Team Members
if (teamMembers.length > 0) {
  sql.push('-- Import Team Members');
  sql.push('INSERT INTO team_members (id, name, role, active, created_at, updated_at) VALUES');

  const memberValues = teamMembers.map((item, idx) => {
    const f = item.fields;
    const isLast = idx === teamMembers.length - 1;
    return `  (${item.pk}, ${escapeSqlString(f.name)}, ${escapeSqlString(f.role)}, ${f.active}, ${formatTimestamp(f.created_at)}, ${formatTimestamp(f.updated_at)})${isLast ? ';' : ','}`;
  });

  sql.push(...memberValues);
  sql.push(`SELECT setval('team_members_id_seq', (SELECT MAX(id) FROM team_members));\n`);
}

// Import Clients
if (clients.length > 0) {
  sql.push('-- Import Clients');
  sql.push('INSERT INTO clients (id, nome_attivita, account_riferimento, tipologia_cliente, servizio, data_richiesta, operatore_id, fase_processo, seo_stato, scadenza, note, created_at, updated_at) VALUES');

  const clientValues = clients.map((item, idx) => {
    const f = item.fields;
    const isLast = idx === clients.length - 1;
    const operatoreId = f.operatore ? f.operatore : 'NULL';
    return `  (${item.pk}, ${escapeSqlString(f.nome_attivita)}, ${escapeSqlString(f.account_riferimento)}, ${escapeSqlString(f.tipologia_cliente)}, ${escapeSqlString(f.servizio)}, ${formatDate(f.data_richiesta)}, ${operatoreId}, ${escapeSqlString(f.fase_processo)}, ${escapeSqlString(f.seo_stato)}, ${formatDate(f.scadenza)}, ${escapeSqlString(f.note)}, ${formatTimestamp(f.created_at)}, ${formatTimestamp(f.updated_at)})${isLast ? ';' : ','}`;
  });

  sql.push(...clientValues);
  sql.push(`SELECT setval('clients_id_seq', (SELECT MAX(id) FROM clients));\n`);
}

// Import Project History
if (projectHistory.length > 0) {
  sql.push('-- Import Project History');
  sql.push('INSERT INTO project_history (id, client_id, operator_id, data_inizio, data_completamento, servizio, note, created_at) VALUES');

  const historyValues = projectHistory.map((item, idx) => {
    const f = item.fields;
    const isLast = idx === projectHistory.length - 1;
    const operatorId = f.operator ? f.operator : 'NULL';
    return `  (${item.pk}, ${f.client}, ${operatorId}, ${formatDate(f.data_inizio)}, ${formatDate(f.data_completamento)}, ${escapeSqlString(f.servizio)}, ${escapeSqlString(f.note)}, ${formatTimestamp(f.created_at)})${isLast ? ';' : ','}`;
  });

  sql.push(...historyValues);
  sql.push(`SELECT setval('project_history_id_seq', (SELECT MAX(id) FROM project_history));\n`);
}

// Import Monthly Snapshots
if (monthlySnapshots.length > 0) {
  sql.push('-- Import Monthly Snapshots');
  sql.push('INSERT INTO monthly_snapshots (id, mese, anno, clienti_attivi, clienti_standby, clienti_mantenimento, data_json, created_at) VALUES');

  const snapshotValues = monthlySnapshots.map((item, idx) => {
    const f = item.fields;
    const isLast = idx === monthlySnapshots.length - 1;
    const dataJson = f.data_json ? escapeSqlString(JSON.stringify(f.data_json)) : "'{}'";
    return `  (${item.pk}, ${f.mese}, ${f.anno}, ${f.clienti_attivi}, ${f.clienti_standby}, ${f.clienti_mantenimento}, ${dataJson}::jsonb, ${formatTimestamp(f.created_at)})${isLast ? ';' : ','}`;
  });

  sql.push(...snapshotValues);
  sql.push(`SELECT setval('monthly_snapshots_id_seq', (SELECT MAX(id) FROM monthly_snapshots));\n`);
}

// Riabilita vincoli
sql.push('-- Riabilita i vincoli');
sql.push('SET session_replication_role = DEFAULT;\n');

// Summary
sql.push('-- Summary');
sql.push(`-- Team Members: ${teamMembers.length}`);
sql.push(`-- Clients: ${clients.length}`);
sql.push(`-- Project History: ${projectHistory.length}`);
sql.push(`-- Monthly Snapshots: ${monthlySnapshots.length}`);

// Scrivi il file SQL
const output = sql.join('\n');
fs.writeFileSync(path.join(__dirname, 'import_data.sql'), output);

console.log('✅ File SQL generato: scripts/import_data.sql');
console.log(`\nStatistiche:`);
console.log(`  - ${teamMembers.length} membri del team`);
console.log(`  - ${clients.length} clienti`);
console.log(`  - ${projectHistory.length} progetti storici`);
console.log(`  - ${monthlySnapshots.length} snapshot mensili`);
console.log(`\nTotale righe SQL: ${sql.length}`);
