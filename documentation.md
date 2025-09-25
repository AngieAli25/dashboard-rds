# Web Team Dashboard - Brief

## Descrizione  
Creare una web app per gestire il team siti web di meravigliä Lab, agenzia di marketing creativa. Questa webapp ha il compito di facilitare il responsabile del team nella gestione dei clienti, task assegnati, carico di lavoro e scadenze. Il team è composto da 4 persone: 3 sviluppatori web (Federica, Marta, Edoardo) e 1 SEO specialist (Virginia). Deve essere molto semplice nella lettura con confronti mensili, tabelle e dati che si aggiornano in tempo reale.

## Stack Tecnologico  
- **Framework**: Next.js 15.4  
- **Styling**: TailwindCSS 4.1  
- **Runtime**: Python 3.13  
- **Framework**: Django 5.2  
- **DBMS**: PostgreSQL 17

DESIGN SYSTEM:  
* Colore principale: #247DFF (blu meravigliä)  
* Genera una palette completa partendo da questo blu:  
   * Sfumature più chiare per sfondi  
   * Toni più scuri per testi e CTA  
   * Colori complementari per accenti: #F59532  
   * Grigi neutri per testi secondari

Typography: Poppins

## Funzionalità Core

### 1. Dashboard Principale  
- **KPI principali**:   
  - Clienti Attivi Totali (progetti in corso)
  - Clienti in Stand-by (temporaneamente fermi)  
  - Clienti con Mantenimento Attivo (gestione/mantenimento sito)
- **Gestione Individuale**: 4 box per ogni membro del team
  - Nome della persona
  - Numero complessivo di clienti gestiti attualmente

  - Lista dei clienti/progetti in gestione con relativa tipologia di lavorazione

### 2. Gestione Team  
**Team membri**:
- Federica (sviluppatore web)
- Marta (sviluppatore web) 
- Edoardo (sviluppatore web)
- Virginia (SEO specialist)

**Tipologie di lavorazione web**:
- Sito vetrina
- Sito strutturato
- E-commerce
- Landing page
- Blog
- Mantenimento

**Tipologie di lavorazione SEO** (per Virginia):
- Call
- Analisi
- Ottimizzazione testi
- Yoast SEO
- Gestione blog
- Gestione SEO
- Report

### 3. Interfaccia Clienti  
- **Sezione superiore**: 3 card KPI (riprendono i numeri della Dashboard)
- **Filtri**:
  - Cerca nome attività/cliente (ricerca testuale)
  - Operatore (tendina: Federica, Marta, Edoardo, Virginia)
  - Servizio (tendina: sito vetrina, sito strutturato, e-commerce, landing page, gestione SEO, blog, mantenimento)
  - Scadenza (filtra per data/settimana/mese)
  - Fase del processo (tendina)
  - Pulsante "Azzera filtri"

- **Tabella clienti** con colonne:
  1. Nome attività (testo editabile)
  2. Account di riferimento (testo editabile)
  3. Tipologia cliente (tendina: AAA, A, B)
  4. Servizio (tendina)
  5. Data richiesta (data ordinabile)
  6. Operatore (tendina: Federica, Marta, Edoardo, Virginia)
  7. Fase processo (tendina: prima call, implementazione, presentazione, da mettere online, online, gestione/mantenimento, stand-by, insoluto)
  8. SEO (tendina: call, analisi, ottimizzazione testi, Yoast SEO, gestione blog, gestione SEO, report)
  9. Scadenza (data ordinabile - **ORDINE DEFAULT**, scadenze più prossime in alto)
  10. Note (testo editabile con pulsante Salva)

- **Funzionalità**:
  - Tutti i campi editabili con salvataggio automatico (eccetto Note)
  - Pulsante "Aggiungi Cliente"
  - Colonna SEO sempre visibile per tutti i clienti

### 4. Popup "Aggiungi Cliente"  
**Campi richiesti**:
- Nome attività (testo editabile)
- Account di riferimento (testo editabile)
- Tipologia cliente (tendina: AAA, A, B)
- Servizio (tendina: sito vetrina, sito strutturato, e-commerce, landing page, mantenimento)
- Checkbox SEO (se flaggato → Fase processo = "Da fare" automaticamente)
- Data richiesta (default: data attuale)
- Note (testo editabile)
- Pulsante "Salva" per confermare inserimento

**Logica**:
- I campi Operatore, Fase del processo (se SEO non flaggato), SEO e Scadenza rimangono vuoti
- Vengono editati successivamente dai membri del team nella tabella

### 5. Interfaccia Storico  
- **Andamento carico di lavoro**: Grafici temporali del carico di lavoro del team
- **Progetti completati**: Statistiche sui progetti completati per periodo
- **Performance individuali**: Metriche di performance per ogni membro del team
- **Tempi di completamento**: Statistiche sui tempi di completamento dei progetti
- **Confronti mensili**: Analisi comparative tra diversi periodi

### 6. Logica Business  
- **Clienti Attivi**: Clienti con progetti in corso di lavorazione
- **Clienti Stand-by**: Clienti su cui i lavori sono temporaneamente fermi
- **Clienti Mantenimento**: Clienti con servizio di gestione/mantenimento attivo
- **Ordinamento default**: Tabella ordinata per scadenza (più prossime in alto)
- **Salvataggio**: Automatico per tutti i campi eccetto Note (pulsante Salva richiesto)
- **Filtri**: Possibilità di filtrare per operatore, servizio, fase, scadenza
- **Export dati**: Funzionalità di esportazione delle informazioni

### 7. Stati e Fasi del Processo  
**Fasi standard**:
- Prima call
- Implementazione  
- Presentazione
- Da mettere online
- Online
- Gestione/mantenimento
- Stand-by
- Insoluto

**Stati SEO specifici**:
- Call
- Analisi
- Ottimizzazione testi
- Yoast SEO
- Gestione blog
- Gestione SEO
- Report

### 8. Struttura Database  
**Tabelle principali**:
- **Clienti**: id, nome_attivita, account_riferimento, tipologia_cliente, servizio, data_richiesta, operatore, fase_processo, seo_stato, scadenza, note, created_at, updated_at
- **Team**: id, nome, ruolo, attivo
- **Storico_progetti**: id, cliente_id, operatore_id, data_inizio, data_completamento, servizio, note
- **Snapshots_mensili**: id, mese, anno, clienti_attivi, clienti_standby, clienti_mantenimento, created_at

### 9. API Endpoints  
**Dashboard**:
- GET /api/dashboard/stats - KPI principali
- GET /api/dashboard/team-workload - Carico di lavoro per membro

**Clienti**:
- GET /api/clienti - Lista clienti con filtri
- POST /api/clienti - Aggiungi nuovo cliente
- PUT /api/clienti/{id} - Modifica cliente
- DELETE /api/clienti/{id} - Elimina cliente

**Storico**:
- GET /api/storico/trends - Andamenti temporali
- GET /api/storico/performance - Performance team
- GET /api/storico/completati - Progetti completati

### 10. Responsive Design  
- Design responsive per desktop, tablet e mobile
- Priorità alla visualizzazione desktop per uso in ufficio
- Tabelle scrollabili orizzontalmente su mobile
- Menu laterale collassabile su schermi piccoli