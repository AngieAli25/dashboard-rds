from django.contrib import admin
from .models import Client, TeamMember, ProjectHistory, MonthlySnapshot


@admin.register(TeamMember)
class TeamMemberAdmin(admin.ModelAdmin):
    list_display = ['name', 'role', 'active', 'created_at']
    list_filter = ['role', 'active']
    search_fields = ['name']


@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = ['nome_attivita', 'tipologia_cliente', 'servizio', 
                    'operatore', 'fase_processo', 'scadenza']
    list_filter = ['tipologia_cliente', 'servizio', 'fase_processo', 
                   'operatore', 'seo_stato']
    search_fields = ['nome_attivita', 'account_riferimento']
    date_hierarchy = 'data_richiesta'


@admin.register(ProjectHistory)
class ProjectHistoryAdmin(admin.ModelAdmin):
    list_display = ['client', 'operator', 'servizio', 
                    'data_inizio', 'data_completamento']
    list_filter = ['servizio', 'operator']
    date_hierarchy = 'data_inizio'


@admin.register(MonthlySnapshot)
class MonthlySnapshotAdmin(admin.ModelAdmin):
    list_display = ['__str__', 'clienti_attivi', 
                    'clienti_standby', 'clienti_mantenimento', 'created_at']
    list_filter = ['anno']