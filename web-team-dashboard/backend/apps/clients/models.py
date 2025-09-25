from django.db import models
from django.contrib.auth.models import User


class TeamMember(models.Model):
    ROLE_CHOICES = [
        ('developer', 'Sviluppatore Web'),
        ('seo', 'SEO Specialist'),
    ]
    
    name = models.CharField(max_length=100)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Membro del Team"
        verbose_name_plural = "Membri del Team"
        ordering = ['name']
    
    def __str__(self):
        return self.name


class Client(models.Model):
    TIPOLOGIA_CHOICES = [
        ('AAA', 'AAA'),
        ('A', 'A'),
        ('B', 'B'),
    ]
    
    SERVIZIO_CHOICES = [
        ('sito_vetrina', 'Sito Vetrina'),
        ('sito_strutturato', 'Sito Strutturato'),
        ('ecommerce', 'E-commerce'),
        ('landing_page', 'Landing Page'),
        ('blog', 'Blog'),
        ('mantenimento', 'Mantenimento'),
    ]
    
    FASE_PROCESSO_CHOICES = [
        ('prima_call', 'Prima Call'),
        ('implementazione', 'Implementazione'),
        ('presentazione', 'Presentazione'),
        ('da_mettere_online', 'Da Mettere Online'),
        ('online', 'Online'),
        ('gestione_mantenimento', 'Gestione/Mantenimento'),
        ('stand_by', 'Stand-by'),
        ('insoluto', 'Insoluto'),
        ('da_fare', 'Da Fare'),
    ]
    
    SEO_STATO_CHOICES = [
        ('', 'Nessuno'),
        ('call', 'Call'),
        ('analisi', 'Analisi'),
        ('ottimizzazione_testi', 'Ottimizzazione Testi'),
        ('yoast_seo', 'Yoast SEO'),
        ('gestione_blog', 'Gestione Blog'),
        ('gestione_seo', 'Gestione SEO'),
        ('report', 'Report'),
    ]
    
    nome_attivita = models.CharField(max_length=200)
    account_riferimento = models.CharField(max_length=200, blank=True)
    tipologia_cliente = models.CharField(max_length=3, choices=TIPOLOGIA_CHOICES)
    servizio = models.CharField(max_length=50, choices=SERVIZIO_CHOICES)
    data_richiesta = models.DateField(auto_now_add=True)
    operatore = models.ForeignKey(TeamMember, on_delete=models.SET_NULL, null=True, blank=True, related_name='clienti')
    fase_processo = models.CharField(max_length=50, choices=FASE_PROCESSO_CHOICES, blank=True)
    seo_stato = models.CharField(max_length=50, choices=SEO_STATO_CHOICES, blank=True)
    scadenza = models.DateField(null=True, blank=True)
    note = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Cliente"
        verbose_name_plural = "Clienti"
        ordering = ['scadenza', 'nome_attivita']
    
    def __str__(self):
        return self.nome_attivita
    
    @property
    def is_active(self):
        return self.fase_processo not in ['stand_by', 'insoluto', 'online']
    
    @property
    def is_maintenance(self):
        return self.servizio == 'mantenimento' or self.fase_processo == 'gestione_mantenimento'
    
    @property
    def is_standby(self):
        return self.fase_processo == 'stand_by'


class ProjectHistory(models.Model):
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='history')
    operator = models.ForeignKey(TeamMember, on_delete=models.SET_NULL, null=True)
    data_inizio = models.DateField()
    data_completamento = models.DateField(null=True, blank=True)
    servizio = models.CharField(max_length=50)
    note = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = "Storico Progetto"
        verbose_name_plural = "Storico Progetti"
        ordering = ['-data_inizio']
    
    def __str__(self):
        return f"{self.client.nome_attivita} - {self.servizio}"


class MonthlySnapshot(models.Model):
    mese = models.IntegerField()
    anno = models.IntegerField()
    clienti_attivi = models.IntegerField(default=0)
    clienti_standby = models.IntegerField(default=0)
    clienti_mantenimento = models.IntegerField(default=0)
    data_json = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = "Snapshot Mensile"
        verbose_name_plural = "Snapshot Mensili"
        ordering = ['-anno', '-mese']
        unique_together = ['mese', 'anno']
    
    def __str__(self):
        return f"{self.mese:02d}/{self.anno}"