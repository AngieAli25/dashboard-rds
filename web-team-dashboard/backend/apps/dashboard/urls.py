from django.urls import path
from .views import dashboard_stats, team_workload

urlpatterns = [
    path('stats/', dashboard_stats, name='dashboard-stats'),
    path('team-workload/', team_workload, name='team-workload'),
]