#!/usr/bin/env python3
"""
Script per importare i dati dal CSV di Google Sheets nel database Django
"""
import os
import sys
import django
from datetime import datetime
import csv
from io import StringIO

# Setup Django
sys.path.append('/Users/fede.ramini/Dashboard siti web/web-team-dashboard/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.clients.models import Client, TeamMember

# Dati CSV del Google Sheets
CSV_DATA = """Data di richiesta,Cliente,Account,Tipologia,Operatore,Servizio,Fase del processo,SEO,Scadenza,Note
15/07,Worklab,Baratta,AAA,Federica,Sito vetrina,In revisione,Analisi,26/09,in attesa di feedback da cliente
15/07,Worklab,Baratta,AAA,Federica,Landing page,In revisione,Analisi,26/09,in attesa di feedback da cliente
17/09,D come Dalia,Del Foro,B,Federica,Sito strutturato,Implementazione,Analisi,03/10,Restyling
05/09,La Piazzetta,Rubinato,A,Federica,Sito vetrina,Implementazione,Analisi,10/10,
03/01,Fidilink,Clerici,AAA,Federica,Sito strutturato,In revisione,Gestione SEO,29/07,in attesa di feedback da cliente
17/06,Depaoli,Sciascia,AAA,Federica,Sito strutturato,Da mettere online,Analisi,30/09,Restyling
14/07,Yoromi,Rubinato,B,Edoardo,App/webapp,In revisione,,30/09,
14/04,Vela Azzurra,Rubinato,AAA,Edoardo,Sito strutturato,Presentazione,Analisi,20/10,
29/05,SAPG Compliance,Recchimuzzi,A,Edoardo,Landing page,In revisione,Analisi,30/09,
13/06,Sotto la polvere,Rubinato,B,Edoardo,Sito strutturato,Presentazione,Analisi,30/09,Shopify
14/04,Nuova Corrente,Carnelli,AAA,Edoardo,App/webapp,Implementazione,,23/12,
05/09,Imeta srl,Rubinato,AAA,Edoardo,Sito vetrina,Prima call,Analisi,31/10,Restyling
16/09,3VI,Molinari,A,Edoardo,Landing page,Implementazione,Analisi,31/10,Fil con Cursor
19/09,Vendruscolo,Del Foro,B,Edoardo,Landing page,Implementazione,Analisi,31/10,Gianlu con Cursor
16/05,Core mio,Clerici,AAA,Marta,Sito strutturato,Presentazione,Analisi,15/10,
06/08,Rehabita,Recchimuzzi,B,Marta,Landing page,In revisione,,07/10,
06/08,Rehabita,Recchimuzzi,B,Marta,Sito strutturato,Presentazione,Analisi,07/10,
09/05,Calistea,Rubinato,AAA,Marta,Ecommerce,Implementazione,Analisi,10/10,
12/06,TWA consulting,Sciascia,B,Marta,Sito vetrina,Implementazione,Analisi,10/10,
17/02,Lucchetti Marmi,Colombo F.,AAA,Marta,Sito strutturato,In revisione,Analisi,07/10,
18/07,Fiscal Focus,Longoni,AAA,Marta,Landing page,Presentazione,,02/10,
09/09,Acqua Doctor snc,Del Foro,AAA,Marta,Landing page,Prima call,,12/10,
10/09,Acqua Doctor snc,Del Foro,AAA,Marta,Sito strutturato,Prima call,,12/10,
23/09,Centro Risarcimento Salute,Carnelli,B,Marta,Sito vetrina,Presentazione,,10/10,Sito fatto con AI (la home Micol il resto Marta)
16/10,Tr compositi,Marta,A,Marta,Sito strutturato,In revisione,Analisi,03/10,
,Trattoria Morè,Colombo F.,A,Marta,Sito strutturato,Gestione,,,
,Estetica Le Muse,Ferrian,AAA,Marta,Ecommerce,Gestione,,,
,Yoko,Sciascia,AAA,Marta,Ecommerce,Gestione,,,
,Bmed,Baratta,A,Marta,Sito strutturato,Gestione,,,
23/09,Forensia,Federica C.,AAA,Marta,Sito strutturato,Prima call,,16/10,Progetto grafico
,BZ consulting,Federica C.,AAA,Marta,Landing page,In revisione,,,"""

def parse_date(date_str):
    """Converte data dal formato dd/mm al formato completo assumendo anno 2024"""
    if not date_str or date_str.strip() == '':
        return None
    
    try:
        # Formato dd/mm
        day, month = date_str.split('/')
        # Assumiamo anno 2024
        return datetime(2024, int(month), int(day)).date()
    except ValueError:
        print(f"Errore nel parsing della data: {date_str}")
        return None

def map_servizio(servizio_excel):
    """Mappa i servizi dal CSV ai valori del modello Django"""
    mapping = {
        'Sito vetrina': 'sito_vetrina',
        'Sito strutturato': 'sito_strutturato',
        'Sito': 'sito_strutturato',
        'Landing page': 'landing_page',
        'App/webapp': 'app_webapp',
        'E-commerce': 'ecommerce',
        'Ecommerce': 'ecommerce',
        'Blog': 'blog',
        'Mantenimento': 'mantenimento',
        'Gestione': 'gestione',
    }
    return mapping.get(servizio_excel, 'sito_vetrina')

def map_fase_processo(fase_excel):
    """Mappa le fasi del processo dal CSV ai valori del modello Django"""
    mapping = {
        'In revisione': 'in_revisione',
        'Implementazione': 'implementazione',
        'Da mettere online': 'da_mettere_online',
        'Presentazione': 'presentazione',
        'Online': 'online',
        'Gestione': 'gestione',
        'Mantenimento': 'mantenimento',
        'Stand-by': 'stand_by',
        'Insoluto': 'insoluto',
        'Da fare': 'da_fare',
        'Prima call': 'prima_call',
    }
    return mapping.get(fase_excel, 'da_fare')

def map_seo_stato(seo_excel):
    """Mappa gli stati SEO dal CSV ai valori del modello Django"""
    mapping = {
        'Analisi': 'analisi',
        'Gestione SEO': 'gestione_seo',
        'Call': 'call',
        'Ottimizzazione Testi': 'ottimizzazione_testi',
        'Yoast SEO': 'yoast_seo',
        'Gestione Blog': 'gestione_blog',
        'Report': 'report',
    }
    return mapping.get(seo_excel, '')

def get_or_create_team_member(nome_operatore):
    """Ottiene o crea un membro del team"""
    if not nome_operatore:
        return None
    
    team_member, created = TeamMember.objects.get_or_create(
        name=nome_operatore,
        defaults={
            'role': 'developer',  # Default role
            'active': True
        }
    )
    if created:
        print(f"Creato nuovo membro del team: {nome_operatore}")
    
    return team_member

def import_data():
    """Importa i dati dal CSV nel database"""
    
    # Prima rimuoviamo tutti i clienti esistenti
    print("Rimozione dati esistenti...")
    Client.objects.all().delete()
    
    # Leggiamo il CSV
    csv_reader = csv.DictReader(StringIO(CSV_DATA))
    
    clients_created = 0
    
    for row in csv_reader:
        try:
            # Parsing dei dati
            data_richiesta = parse_date(row['Data di richiesta'])
            scadenza = parse_date(row['Scadenza'])
            operatore = get_or_create_team_member(row['Operatore'])
            
            # Creazione del cliente
            client = Client.objects.create(
                nome_attivita=row['Cliente'],
                account_riferimento=row['Account'],
                tipologia_cliente=row['Tipologia'],
                servizio=map_servizio(row['Servizio']),
                data_richiesta=data_richiesta if data_richiesta else datetime.now().date(),
                operatore=operatore,
                fase_processo=map_fase_processo(row['Fase del processo']),
                seo_stato=map_seo_stato(row['SEO']),
                scadenza=scadenza,
                note=row['Note'] if row['Note'] else ''
            )
            
            clients_created += 1
            print(f"Creato cliente: {client.nome_attivita}")
            
        except Exception as e:
            print(f"Errore nell'importazione del cliente {row['Cliente']}: {e}")
            continue
    
    print(f"\nImportazione completata! Creati {clients_created} clienti.")

if __name__ == '__main__':
    import_data()