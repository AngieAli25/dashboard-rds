"""
Script per esportare i dati dal database Django in formato JSON
compatibile con l'importazione in Prisma/Postgres.

Esegui questo script dalla directory del backend Django:
cd backend
python manage.py shell < ../web-team-dashboard/scripts/export_django_data.py > ../web-team-dashboard/scripts/django_export.json
"""

import json
import sys
from apps.clients.models import TeamMember, Client, ProjectHistory, MonthlySnapshot

def export_data():
    data = {
        'team_members': [],
        'clients': [],
        'project_history': [],
        'monthly_snapshots': []
    }

    # Export Team Members
    for member in TeamMember.objects.all():
        data['team_members'].append({
            'id': member.id,
            'name': member.name,
            'role': member.role,
            'active': member.active,
            'created_at': member.created_at.isoformat() if member.created_at else None,
            'updated_at': member.updated_at.isoformat() if member.updated_at else None,
        })

    # Export Clients
    for client in Client.objects.all():
        data['clients'].append({
            'id': client.id,
            'nome_attivita': client.nome_attivita,
            'account_riferimento': client.account_riferimento,
            'tipologia_cliente': client.tipologia_cliente,
            'servizio': client.servizio,
            'data_richiesta': client.data_richiesta.isoformat() if client.data_richiesta else None,
            'operatore_id': client.operatore_id,
            'fase_processo': client.fase_processo,
            'seo_stato': client.seo_stato,
            'scadenza': client.scadenza.isoformat() if client.scadenza else None,
            'note': client.note,
            'created_at': client.created_at.isoformat() if client.created_at else None,
            'updated_at': client.updated_at.isoformat() if client.updated_at else None,
        })

    # Export Project History
    for project in ProjectHistory.objects.all():
        data['project_history'].append({
            'id': project.id,
            'client_id': project.client_id,
            'operator_id': project.operator_id,
            'data_inizio': project.data_inizio.isoformat() if project.data_inizio else None,
            'data_completamento': project.data_completamento.isoformat() if project.data_completamento else None,
            'servizio': project.servizio,
            'note': project.note,
            'created_at': project.created_at.isoformat() if project.created_at else None,
        })

    # Export Monthly Snapshots
    for snapshot in MonthlySnapshot.objects.all():
        data['monthly_snapshots'].append({
            'id': snapshot.id,
            'mese': snapshot.mese,
            'anno': snapshot.anno,
            'clienti_attivi': snapshot.clienti_attivi,
            'clienti_standby': snapshot.clienti_standby,
            'clienti_mantenimento': snapshot.clienti_mantenimento,
            'data_json': snapshot.data_json,
            'created_at': snapshot.created_at.isoformat() if snapshot.created_at else None,
        })

    return data

if __name__ == '__main__':
    data = export_data()
    print(json.dumps(data, indent=2, ensure_ascii=False))

    # Stampa statistiche su stderr per non interferire con JSON
    sys.stderr.write(f"\n✅ Esportati:\n")
    sys.stderr.write(f"   - {len(data['team_members'])} membri del team\n")
    sys.stderr.write(f"   - {len(data['clients'])} clienti\n")
    sys.stderr.write(f"   - {len(data['project_history'])} progetti storici\n")
    sys.stderr.write(f"   - {len(data['monthly_snapshots'])} snapshot mensili\n")
