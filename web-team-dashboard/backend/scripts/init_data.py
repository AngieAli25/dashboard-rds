#!/usr/bin/env python
"""
Script per inizializzare il database con i dati base del team
"""
import os
import sys
import django

# Aggiungi il path del progetto
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.clients.models import TeamMember, Client
from datetime import date, timedelta


def create_team_members():
    team_data = [
        {'name': 'Federica', 'role': 'developer'},
        {'name': 'Marta', 'role': 'developer'},
        {'name': 'Edoardo', 'role': 'developer'},
        {'name': 'Virginia', 'role': 'seo'},
    ]
    
    for member_data in team_data:
        member, created = TeamMember.objects.get_or_create(
            name=member_data['name'],
            defaults=member_data
        )
        if created:
            print(f"Creato membro del team: {member.name}")
        else:
            print(f"Membro del team già esistente: {member.name}")


def create_sample_clients():
    # Ottieni membri del team
    federica = TeamMember.objects.get(name='Federica')
    marta = TeamMember.objects.get(name='Marta')
    edoardo = TeamMember.objects.get(name='Edoardo')
    virginia = TeamMember.objects.get(name='Virginia')
    
    sample_clients = [
        {
            'nome_attivita': 'Ristorante Da Mario',
            'account_riferimento': 'Mario Rossi',
            'tipologia_cliente': 'A',
            'servizio': 'sito_vetrina',
            'operatore': federica,
            'fase_processo': 'implementazione',
            'scadenza': date.today() + timedelta(days=7),
            'note': 'Cliente storico, necessita restyling completo'
        },
        {
            'nome_attivita': 'E-commerce Fashion Store',
            'account_riferimento': 'Anna Bianchi',
            'tipologia_cliente': 'AAA',
            'servizio': 'ecommerce',
            'operatore': marta,
            'fase_processo': 'presentazione',
            'seo_stato': 'analisi',
            'scadenza': date.today() + timedelta(days=14),
            'note': 'Progetto importante, budget elevato'
        },
        {
            'nome_attivita': 'Studio Legale Avvocati',
            'account_riferimento': 'Dr. Verdi',
            'tipologia_cliente': 'B',
            'servizio': 'sito_strutturato',
            'operatore': edoardo,
            'fase_processo': 'da_mettere_online',
            'scadenza': date.today() + timedelta(days=3),
        },
        {
            'nome_attivita': 'Blog Ricette Nonna',
            'account_riferimento': 'Giulia Neri',
            'tipologia_cliente': 'B',
            'servizio': 'blog',
            'operatore': federica,
            'fase_processo': 'gestione_mantenimento',
            'seo_stato': 'gestione_blog',
        },
        {
            'nome_attivita': 'Azienda Idraulici',
            'account_riferimento': 'Franco Blu',
            'tipologia_cliente': 'A',
            'servizio': 'landing_page',
            'operatore': marta,
            'fase_processo': 'stand_by',
            'note': 'In attesa di contenuti dal cliente'
        }
    ]
    
    for client_data in sample_clients:
        client, created = Client.objects.get_or_create(
            nome_attivita=client_data['nome_attivita'],
            defaults=client_data
        )
        if created:
            print(f"Creato cliente: {client.nome_attivita}")
        else:
            print(f"Cliente già esistente: {client.nome_attivita}")


def main():
    print("Inizializzazione dati del team...")
    create_team_members()
    print("\nCreazione clienti di esempio...")
    create_sample_clients()
    print("\nInizializzazione completata!")


if __name__ == '__main__':
    main()