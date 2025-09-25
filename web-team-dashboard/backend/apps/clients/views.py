from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, Count
from datetime import datetime, timedelta
from .models import Client, TeamMember, ProjectHistory, MonthlySnapshot
from .serializers import (
    ClientSerializer, TeamMemberSerializer,
    ProjectHistorySerializer, MonthlySnapshotSerializer
)


class TeamMemberViewSet(viewsets.ModelViewSet):
    queryset = TeamMember.objects.all()
    serializer_class = TeamMemberSerializer
    
    @action(detail=False, methods=['get'])
    def workload(self, request):
        team_members = TeamMember.objects.filter(active=True)
        workload_data = []
        
        for member in team_members:
            clients = Client.objects.filter(operatore=member, fase_processo__in=[
                'prima_call', 'implementazione', 'presentazione', 
                'da_mettere_online', 'gestione_mantenimento'
            ])
            
            workload_data.append({
                'id': member.id,
                'name': member.name,
                'role': member.role,
                'total_clients': clients.count(),
                'clients': ClientSerializer(clients, many=True).data
            })
        
        return Response(workload_data)


class ClientViewSet(viewsets.ModelViewSet):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['operatore', 'servizio', 'fase_processo', 'tipologia_cliente', 'seo_stato']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filtro per nome attività
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(nome_attivita__icontains=search) |
                Q(account_riferimento__icontains=search)
            )
        
        # Filtro per scadenza
        scadenza_filter = self.request.query_params.get('scadenza_filter', None)
        if scadenza_filter:
            today = datetime.now().date()
            if scadenza_filter == 'oggi':
                queryset = queryset.filter(scadenza=today)
            elif scadenza_filter == 'settimana':
                week_end = today + timedelta(days=7)
                queryset = queryset.filter(scadenza__range=[today, week_end])
            elif scadenza_filter == 'mese':
                month_end = today + timedelta(days=30)
                queryset = queryset.filter(scadenza__range=[today, month_end])
        
        return queryset
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        active_clients = Client.objects.filter(
            fase_processo__in=['prima_call', 'implementazione', 'presentazione', 'da_mettere_online']
        ).count()
        
        standby_clients = Client.objects.filter(fase_processo='stand_by').count()
        
        maintenance_clients = Client.objects.filter(
            Q(servizio='mantenimento') | Q(fase_processo='gestione_mantenimento')
        ).count()
        
        return Response({
            'clienti_attivi': active_clients,
            'clienti_standby': standby_clients,
            'clienti_mantenimento': maintenance_clients
        })
    
    @action(detail=False, methods=['post'])
    def bulk_update(self, request):
        updates = request.data.get('updates', [])
        updated_clients = []
        
        for update in updates:
            client_id = update.get('id')
            if client_id:
                client = Client.objects.filter(id=client_id).first()
                if client:
                    serializer = ClientSerializer(client, data=update, partial=True)
                    if serializer.is_valid():
                        serializer.save()
                        updated_clients.append(serializer.data)
        
        return Response({'updated': updated_clients})


class ProjectHistoryViewSet(viewsets.ModelViewSet):
    queryset = ProjectHistory.objects.all()
    serializer_class = ProjectHistorySerializer
    
    @action(detail=False, methods=['get'])
    def trends(self, request):
        # Analisi degli ultimi 6 mesi
        six_months_ago = datetime.now() - timedelta(days=180)
        history = ProjectHistory.objects.filter(
            data_inizio__gte=six_months_ago
        )
        
        # Raggruppa per mese
        monthly_data = {}
        for project in history:
            month_key = f"{project.data_inizio.year}-{project.data_inizio.month:02d}"
            if month_key not in monthly_data:
                monthly_data[month_key] = {
                    'completed': 0,
                    'started': 0
                }
            monthly_data[month_key]['started'] += 1
            if project.data_completamento:
                monthly_data[month_key]['completed'] += 1
        
        return Response(monthly_data)
    
    @action(detail=False, methods=['get'])
    def performance(self, request):
        # Performance per operatore
        team_members = TeamMember.objects.filter(active=True)
        performance_data = []
        
        for member in team_members:
            completed_projects = ProjectHistory.objects.filter(
                operator=member,
                data_completamento__isnull=False
            ).count()
            
            avg_completion_time = ProjectHistory.objects.filter(
                operator=member,
                data_completamento__isnull=False
            ).extra(
                select={'completion_time': 'data_completamento - data_inizio'}
            ).values_list('completion_time', flat=True)
            
            avg_days = sum([ct.days for ct in avg_completion_time]) / len(avg_completion_time) if avg_completion_time else 0
            
            performance_data.append({
                'name': member.name,
                'completed_projects': completed_projects,
                'avg_completion_days': avg_days
            })
        
        return Response(performance_data)


class MonthlySnapshotViewSet(viewsets.ModelViewSet):
    queryset = MonthlySnapshot.objects.all()
    serializer_class = MonthlySnapshotSerializer
    
    @action(detail=False, methods=['post'])
    def create_current(self, request):
        now = datetime.now()
        
        # Calcola statistiche correnti
        active_clients = Client.objects.filter(
            fase_processo__in=['prima_call', 'implementazione', 'presentazione', 'da_mettere_online']
        ).count()
        
        standby_clients = Client.objects.filter(fase_processo='stand_by').count()
        
        maintenance_clients = Client.objects.filter(
            Q(servizio='mantenimento') | Q(fase_processo='gestione_mantenimento')
        ).count()
        
        # Crea o aggiorna snapshot
        snapshot, created = MonthlySnapshot.objects.update_or_create(
            mese=now.month,
            anno=now.year,
            defaults={
                'clienti_attivi': active_clients,
                'clienti_standby': standby_clients,
                'clienti_mantenimento': maintenance_clients,
                'data_json': {
                    'timestamp': now.isoformat(),
                    'details': {
                        'per_operatore': [
                            {
                                'name': tm.name,
                                'count': tm.clienti.count()
                            } for tm in TeamMember.objects.filter(active=True)
                        ]
                    }
                }
            }
        )
        
        return Response(MonthlySnapshotSerializer(snapshot).data)