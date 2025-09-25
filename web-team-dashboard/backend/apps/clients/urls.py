from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ClientViewSet, TeamMemberViewSet,
    ProjectHistoryViewSet, MonthlySnapshotViewSet
)

router = DefaultRouter()
router.register(r'clients', ClientViewSet)
router.register(r'team-members', TeamMemberViewSet)
router.register(r'project-history', ProjectHistoryViewSet)
router.register(r'snapshots', MonthlySnapshotViewSet)

urlpatterns = [
    path('', include(router.urls)),
]