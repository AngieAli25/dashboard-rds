'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { clientsApi, teamApi } from '@/lib/api';
import { TeamMember, SERVIZIO_CHOICES, TIPOLOGIA_CLIENTE_CHOICES } from '@/types';
import toast from 'react-hot-toast';

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClientAdded: () => void;
}

export function AddClientModal({ isOpen, onClose, onClientAdded }: AddClientModalProps) {
  const [loading, setLoading] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [formData, setFormData] = useState({
    nome_attivita: '',
    account_riferimento: '',
    tipologia_cliente: 'A' as 'AAA' | 'A' | 'B',
    servizio: 'sito_vetrina',
    seo_required: false,
    note: '',
  });

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const members = await teamApi.getAll();
        setTeamMembers(members);
      } catch (error) {
        console.error('Error fetching team members:', error);
      }
    };

    if (isOpen) {
      fetchTeamMembers();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome_attivita.trim()) {
      toast.error('Il nome attività è obbligatorio');
      return;
    }

    try {
      setLoading(true);
      
      const clientData = {
        nome_attivita: formData.nome_attivita,
        account_riferimento: formData.account_riferimento,
        tipologia_cliente: formData.tipologia_cliente,
        servizio: formData.servizio,
        fase_processo: formData.seo_required ? 'da_fare' : '',
        note: formData.note,
      };

      await clientsApi.create(clientData);
      
      toast.success('Cliente aggiunto con successo');
      onClientAdded();
      handleClose();
    } catch (error) {
      console.error('Error creating client:', error);
      toast.error('Errore nella creazione del cliente');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      nome_attivita: '',
      account_riferimento: '',
      tipologia_cliente: 'A',
      servizio: 'sito_vetrina',
      seo_required: false,
      note: '',
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Aggiungi Nuovo Cliente"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nome Attività *"
            value={formData.nome_attivita}
            onChange={(e) => setFormData({ ...formData, nome_attivita: e.target.value })}
            placeholder="Es. Ristorante Da Mario"
            required
          />
          
          <Input
            label="Account di Riferimento"
            value={formData.account_riferimento}
            onChange={(e) => setFormData({ ...formData, account_riferimento: e.target.value })}
            placeholder="Es. Mario Rossi"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipologia Cliente *
            </label>
            <Select
              value={formData.tipologia_cliente}
              onChange={(value) => setFormData({ ...formData, tipologia_cliente: value as 'AAA' | 'A' | 'B' })}
              options={TIPOLOGIA_CLIENTE_CHOICES}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Servizio *
            </label>
            <Select
              value={formData.servizio}
              onChange={(value) => setFormData({ ...formData, servizio: value as string })}
              options={SERVIZIO_CHOICES}
            />
          </div>
        </div>

        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.seo_required}
              onChange={(e) => setFormData({ ...formData, seo_required: e.target.checked })}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm font-medium text-gray-700">
              Richiede servizi SEO
            </span>
          </label>
          <p className="text-xs text-gray-500 mt-1">
            Se selezionato, la fase del processo sarà impostata automaticamente su "Da Fare"
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Note
          </label>
          <textarea
            value={formData.note}
            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
            placeholder="Note aggiuntive sul cliente o progetto..."
            rows={3}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={loading}
          >
            Annulla
          </Button>
          <Button
            type="submit"
            loading={loading}
            disabled={loading}
          >
            Salva Cliente
          </Button>
        </div>
      </form>
    </Modal>
  );
}