from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Q, Count
from apps.clients.models import Client, TeamMember


@api_view(['GET'])
def dashboard_stats(request):
    # Clienti in stand-by
    standby_clients = Client.objects.filter(fase_processo='stand_by').count()
    
    # Clienti in mantenimento (servizio mantenimento o fase mantenimento, NON gestione)
    maintenance_clients = Client.objects.filter(
        Q(servizio='mantenimento') | Q(fase_processo='mantenimento')
    ).count()
    
    # Clienti attivi: tutti meno quelli in stand-by, insoluti, online e in mantenimento (ma gestione è attivo)
    active_clients = Client.objects.exclude(
        fase_processo__in=['stand_by', 'insoluto', 'online']
    ).exclude(
        Q(servizio='mantenimento') | Q(fase_processo='mantenimento')
    ).count()
    
    return Response({
        'clienti_attivi': active_clients,
        'clienti_standby': standby_clients,
        'clienti_mantenimento': maintenance_clients,
        'totale_clienti': active_clients + standby_clients + maintenance_clients
    })


@api_view(['GET'])
def team_workload(request):
    team_members = TeamMember.objects.filter(active=True)
    workload_data = []
    
    for member in team_members:
        clients = Client.objects.filter(operatore=member)
        # Usa la stessa logica aggiornata per is_active (gestione è attivo)
        active_clients = clients.exclude(
            fase_processo__in=['stand_by', 'insoluto', 'online']
        ).exclude(
            Q(servizio='mantenimento') | Q(fase_processo='mantenimento')
        )
        
        # Raggruppa clienti per tipologia di lavorazione
        client_types = {}
        for client in active_clients:
            service = client.get_servizio_display()
            if service not in client_types:
                client_types[service] = []
            client_types[service].append({
                'nome': client.nome_attivita,
                'fase': client.get_fase_processo_display(),
                'scadenza': client.scadenza
            })
        
        workload_data.append({
            'id': member.id,
            'name': member.name,
            'role': member.get_role_display(),
            'total_clients': clients.count(),
            'active_clients': active_clients.count(),
            'client_types': client_types
        })
    
    return Response(workload_data)