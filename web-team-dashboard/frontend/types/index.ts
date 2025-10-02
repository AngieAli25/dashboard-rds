export interface TeamMember {
  id: number;
  name: string;
  role: 'developer' | 'seo';
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: number;
  nome_attivita: string;
  account_riferimento: string;
  tipologia_cliente: 'AAA' | 'A' | 'B';
  servizio: 'sito_vetrina' | 'sito_strutturato' | 'ecommerce' | 'landing_page' | 'app_webapp' | 'blog' | 'mantenimento' | 'gestione';
  servizio_display: string;
  data_richiesta: string;
  operatore: number | null;
  operatore_detail?: TeamMember;
  fase_processo: string;
  fase_processo_display: string;
  seo_stato: string;
  seo_stato_display: string;
  scadenza: string | null;
  note: string;
  is_active: boolean;
  is_maintenance: boolean;
  is_standby: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProjectHistory {
  id: number;
  client: number;
  client_detail?: Client;
  operator: number | null;
  operator_detail?: TeamMember;
  data_inizio: string;
  data_completamento: string | null;
  servizio: string;
  note: string;
  created_at: string;
}

export interface MonthlySnapshot {
  id: number;
  mese: number;
  anno: number;
  clienti_attivi: number;
  clienti_standby: number;
  clienti_mantenimento: number;
  data_json: any;
  created_at: string;
}

export interface DashboardStats {
  clienti_attivi: number;
  clienti_standby: number;
  clienti_mantenimento: number;
  totale_clienti: number;
}

export interface TeamWorkload {
  id: number;
  name: string;
  role: string;
  total_clients: number;
  active_clients: number;
  client_types: {
    [key: string]: Array<{
      nome: string;
      fase: string;
      scadenza: string | null;
    }>;
  };
}

export interface ApiResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export const SERVIZIO_CHOICES = [
  { value: 'sito_vetrina', label: 'Sito Vetrina' },
  { value: 'sito_strutturato', label: 'Sito Strutturato' },
  { value: 'ecommerce', label: 'E-commerce' },
  { value: 'landing_page', label: 'Landing Page' },
  { value: 'app_webapp', label: 'App/Webapp' },
  { value: 'blog', label: 'Blog' },
  { value: 'mantenimento', label: 'Mantenimento' },
  { value: 'gestione', label: 'Gestione' },
];

export const FASE_PROCESSO_CHOICES = [
  { value: 'prima_call', label: 'Prima call' },
  { value: 'implementazione', label: 'Implementazione' },
  { value: 'in_revisione', label: 'In revisione' },
  { value: 'presentazione', label: 'Presentazione' },
  { value: 'da_mettere_online', label: 'Da mettere online' },
  { value: 'online', label: 'Online' },
  { value: 'gestione', label: 'Gestione' },
  { value: 'mantenimento', label: 'Mantenimento' },
  { value: 'stand_by', label: 'Stand-by' },
  { value: 'insoluto', label: 'Insoluto' },
  { value: 'da_fare', label: 'Da fare' },
];

export const SEO_STATO_CHOICES = [
  { value: '', label: 'Nessuno' },
  { value: 'call', label: 'Call' },
  { value: 'analisi', label: 'Analisi' },
  { value: 'ottimizzazione_testi', label: 'Ottimizzazione Testi' },
  { value: 'yoast_seo', label: 'Yoast SEO' },
  { value: 'gestione_blog', label: 'Gestione Blog' },
  { value: 'gestione_seo', label: 'Gestione SEO' },
  { value: 'report', label: 'Report' },
];

export const TIPOLOGIA_CLIENTE_CHOICES = [
  { value: 'AAA', label: 'AAA' },
  { value: 'A', label: 'A' },
  { value: 'B', label: 'B' },
];