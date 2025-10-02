#!/usr/bin/env python3
"""
Script per aggiornare tutte le date dal 2024 al 2025
"""
import os
import sys
import django
from datetime import datetime, date

# Setup Django
sys.path.append('/Users/fede.ramini/Dashboard siti web/web-team-dashboard/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.clients.models import Client

def update_dates_to_2025():
    """Aggiorna tutte le date dal 2024 al 2025"""
    
    clients = Client.objects.all()
    updated_count = 0
    
    for client in clients:
        updated = False
        
        # Aggiorna data_richiesta se è del 2024
        if client.data_richiesta and client.data_richiesta.year == 2024:
            new_date = client.data_richiesta.replace(year=2025)
            client.data_richiesta = new_date
            updated = True
            print(f"Aggiornata data_richiesta per {client.nome_attivita}: {client.data_richiesta}")
        
        # Aggiorna scadenza se è del 2024
        if client.scadenza and client.scadenza.year == 2024:
            new_date = client.scadenza.replace(year=2025)
            client.scadenza = new_date
            updated = True
            print(f"Aggiornata scadenza per {client.nome_attivita}: {client.scadenza}")
        
        if updated:
            client.save()
            updated_count += 1
    
    print(f"\nAggiornamento completato! {updated_count} clienti aggiornati.")

if __name__ == '__main__':
    update_dates_to_2025()