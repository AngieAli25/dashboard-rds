from rest_framework import serializers
from .models import Client, TeamMember, ProjectHistory, MonthlySnapshot


class TeamMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamMember
        fields = '__all__'


class ClientSerializer(serializers.ModelSerializer):
    operatore_detail = TeamMemberSerializer(source='operatore', read_only=True)
    is_active = serializers.ReadOnlyField()
    is_maintenance = serializers.ReadOnlyField()
    is_standby = serializers.ReadOnlyField()
    
    class Meta:
        model = Client
        fields = '__all__'
        
    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['servizio_display'] = instance.get_servizio_display()
        data['fase_processo_display'] = instance.get_fase_processo_display()
        data['seo_stato_display'] = instance.get_seo_stato_display()
        data['tipologia_cliente_display'] = instance.get_tipologia_cliente_display()
        return data


class ProjectHistorySerializer(serializers.ModelSerializer):
    client_detail = ClientSerializer(source='client', read_only=True)
    operator_detail = TeamMemberSerializer(source='operator', read_only=True)
    
    class Meta:
        model = ProjectHistory
        fields = '__all__'


class MonthlySnapshotSerializer(serializers.ModelSerializer):
    class Meta:
        model = MonthlySnapshot
        fields = '__all__'