-- Importazione dati da Django
-- Generato automaticamente

-- Disabilita temporaneamente i vincoli
SET session_replication_role = replica;

-- Import Team Members
INSERT INTO team_members (id, name, role, active, created_at, updated_at) VALUES
  (1, 'Federica', 'developer', true, '2025-09-17T13:49:56.782Z', '2025-09-17T13:49:56.782Z'),
  (2, 'Marta', 'developer', true, '2025-09-17T13:49:56.783Z', '2025-09-17T13:49:56.783Z'),
  (3, 'Edoardo', 'developer', true, '2025-09-17T13:49:56.784Z', '2025-09-17T13:49:56.784Z'),
  (4, 'Virginia', 'seo', true, '2025-09-17T13:49:56.784Z', '2025-09-17T13:49:56.784Z');
SELECT setval('team_members_id_seq', (SELECT MAX(id) FROM team_members));

-- Import Clients
INSERT INTO clients (id, nome_attivita, account_riferimento, tipologia_cliente, servizio, data_richiesta, operatore_id, fase_processo, seo_stato, scadenza, note, created_at, updated_at) VALUES
  (41, 'Worklab', 'Baratta', 'AAA', 'sito_vetrina', '2025-07-15', 1, 'in_revisione', 'analisi', '2025-09-26', 'in attesa di feedback da cliente', '2025-10-02T14:50:36.089Z', '2025-10-02T14:53:38.395Z'),
  (42, 'Worklab', 'Baratta', 'AAA', 'landing_page', '2025-07-15', 1, 'in_revisione', 'analisi', '2025-09-26', 'in attesa di feedback da cliente', '2025-10-02T14:50:36.090Z', '2025-10-02T14:53:38.396Z'),
  (43, 'D come Dalia', 'Del Foro', 'B', 'sito_strutturato', '2025-09-17', 1, 'implementazione', 'analisi', '2025-10-03', 'Restyling', '2025-10-02T14:50:36.091Z', '2025-10-02T14:53:38.398Z'),
  (44, 'La Piazzetta', 'Rubinato', 'A', 'sito_vetrina', '2025-09-05', 1, 'implementazione', 'analisi', '2025-10-10', '', '2025-10-02T14:50:36.091Z', '2025-10-02T14:53:38.401Z'),
  (45, 'Fidilink', 'Clerici', 'AAA', 'sito_strutturato', '2025-01-03', 1, 'in_revisione', 'gestione_seo', NULL, 'in attesa di feedback da cliente', '2025-10-02T14:50:36.092Z', '2025-10-02T15:53:52.857Z'),
  (46, 'Depaoli', 'Sciascia', 'AAA', 'sito_strutturato', '2025-06-17', 1, 'da_mettere_online', 'analisi', '2025-09-30', 'Restyling', '2025-10-02T14:50:36.092Z', '2025-10-02T14:53:38.396Z'),
  (47, 'Yoromi', 'Rubinato', 'B', 'app_webapp', '2025-07-14', 3, 'in_revisione', '', '2025-09-30', '', '2025-10-02T14:50:36.093Z', '2025-10-02T14:53:38.397Z'),
  (48, 'Vela Azzurra', 'Rubinato', 'AAA', 'sito_strutturato', '2025-04-14', 3, 'presentazione', 'analisi', '2025-10-20', '', '2025-10-02T14:50:36.093Z', '2025-10-02T14:53:38.404Z'),
  (49, 'SAPG Compliance', 'Recchimuzzi', 'A', 'landing_page', '2025-05-29', 3, 'in_revisione', 'analisi', '2025-09-30', '', '2025-10-02T14:50:36.094Z', '2025-10-02T14:53:38.397Z'),
  (50, 'Sotto la polvere', 'Rubinato', 'B', 'sito_strutturato', '2025-06-13', 3, 'presentazione', 'analisi', '2025-09-30', 'Shopify', '2025-10-02T14:50:36.095Z', '2025-10-02T14:53:38.397Z'),
  (51, 'Nuova Corrente', 'Carnelli', 'AAA', 'app_webapp', '2025-04-14', 3, 'implementazione', '', '2025-12-23', '', '2025-10-02T14:50:36.095Z', '2025-10-02T14:53:38.406Z'),
  (52, 'Imeta srl', 'Rubinato', 'AAA', 'sito_vetrina', '2025-09-05', 3, 'prima_call', 'analisi', '2025-10-31', 'Restyling', '2025-10-02T14:50:36.096Z', '2025-10-02T14:53:38.405Z'),
  (53, '3VI', 'Molinari', 'A', 'landing_page', '2025-09-16', 3, 'implementazione', 'analisi', '2025-10-31', 'Fil con Cursor', '2025-10-02T14:50:36.096Z', '2025-10-02T14:53:38.404Z'),
  (54, 'Vendruscolo', 'Del Foro', 'B', 'landing_page', '2025-09-19', 3, 'implementazione', 'analisi', '2025-10-31', 'Gianlu con Cursor', '2025-10-02T14:50:36.097Z', '2025-10-02T14:53:38.405Z'),
  (55, 'Core mio', 'Clerici', 'AAA', 'sito_strutturato', '2025-05-16', 2, 'presentazione', 'analisi', '2025-10-15', '', '2025-10-02T14:50:36.097Z', '2025-10-02T14:53:38.403Z'),
  (56, 'Rehabita', 'Recchimuzzi', 'B', 'landing_page', '2025-08-06', 2, 'in_revisione', '', '2025-10-07', '', '2025-10-02T14:50:36.098Z', '2025-10-02T14:53:38.400Z'),
  (57, 'Rehabita', 'Recchimuzzi', 'B', 'sito_strutturato', '2025-08-06', 2, 'presentazione', 'analisi', '2025-10-07', '', '2025-10-02T14:50:36.098Z', '2025-10-02T14:53:38.400Z'),
  (58, 'Calistea', 'Rubinato', 'AAA', 'ecommerce', '2025-05-09', 2, 'implementazione', 'analisi', '2025-10-10', '', '2025-10-02T14:50:36.099Z', '2025-10-02T14:53:38.401Z'),
  (59, 'TWA consulting', 'Sciascia', 'B', 'sito_vetrina', '2025-06-12', 2, 'implementazione', 'analisi', '2025-10-10', '', '2025-10-02T14:50:36.100Z', '2025-10-02T14:53:38.402Z'),
  (60, 'Lucchetti Marmi', 'Colombo F.', 'AAA', 'sito_strutturato', '2025-02-17', 2, 'in_revisione', 'analisi', '2025-10-07', '', '2025-10-02T14:50:36.101Z', '2025-10-02T14:53:38.399Z'),
  (61, 'Fiscal Focus', 'Longoni', 'AAA', 'landing_page', '2025-07-18', 2, 'presentazione', '', '2025-10-02', '', '2025-10-02T14:50:36.102Z', '2025-10-02T14:53:38.398Z'),
  (62, 'Acqua Doctor snc', 'Del Foro', 'AAA', 'landing_page', '2025-09-09', 2, 'prima_call', '', '2025-10-12', '', '2025-10-02T14:50:36.103Z', '2025-10-02T14:53:38.402Z'),
  (63, 'Acqua Doctor snc', 'Del Foro', 'AAA', 'sito_strutturato', '2025-09-10', 2, 'prima_call', '', '2025-10-12', '', '2025-10-02T14:50:36.103Z', '2025-10-02T14:53:38.403Z'),
  (64, 'Centro Risarcimento Salute', 'Carnelli', 'B', 'sito_vetrina', '2025-09-23', 2, 'presentazione', '', '2025-10-10', 'Sito fatto con AI (la home Micol il resto Marta)', '2025-10-02T14:50:36.104Z', '2025-10-02T14:53:38.401Z'),
  (65, 'Tr compositi', 'Gagianesi', 'A', 'sito_strutturato', '2025-10-16', 2, 'in_revisione', 'analisi', '2025-10-03', '', '2025-10-02T14:50:36.104Z', '2025-10-02T15:44:51.967Z'),
  (66, 'Trattoria Morè', 'Colombo F.', 'A', 'gestione', '2025-10-02', 2, 'gestione', '', NULL, '', '2025-10-02T14:50:36.105Z', '2025-10-02T15:43:48.782Z'),
  (67, 'Estetica Le Muse', 'Ferrian', 'AAA', 'gestione', '2025-10-02', 2, 'gestione', '', NULL, '', '2025-10-02T14:50:36.106Z', '2025-10-02T15:43:41.716Z'),
  (68, 'Yoko', 'Sciascia', 'AAA', 'gestione', '2025-10-02', 2, 'gestione', '', NULL, '', '2025-10-02T14:50:36.106Z', '2025-10-02T15:43:54.147Z'),
  (69, 'Bmed', 'Baratta', 'A', 'gestione', '2025-10-02', 2, 'gestione', '', NULL, '', '2025-10-02T14:50:36.107Z', '2025-10-02T15:43:37.265Z'),
  (70, 'Forensia', 'Federica C.', 'AAA', 'sito_strutturato', '2025-09-23', 2, 'prima_call', '', '2025-10-16', 'Progetto grafico', '2025-10-02T14:50:36.107Z', '2025-10-02T14:53:38.403Z'),
  (71, 'BZ consulting', 'Federica C.', 'AAA', 'landing_page', '2025-10-02', 2, 'in_revisione', '', NULL, '', '2025-10-02T14:50:36.108Z', '2025-10-02T14:50:36.108Z'),
  (73, 'Moby Dick', 'Ramini', 'A', 'gestione', '2026-07-20', 1, 'gestione', '', NULL, 'Gestione e-commerce', '2025-10-02T15:48:29.489Z', '2025-10-02T15:50:32.045Z');
SELECT setval('clients_id_seq', (SELECT MAX(id) FROM clients));

-- Riabilita i vincoli
SET session_replication_role = DEFAULT;

-- Summary
-- Team Members: 4
-- Clients: 32
-- Project History: 0
-- Monthly Snapshots: 0