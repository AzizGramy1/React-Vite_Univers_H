// src/pages/Requests.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { getRequests, deleteRequest, updateRequest, createRequest } from '../api/endpoints';
import toast from 'react-hot-toast';
import { Plus, Eye, Trash2, Search, FileText, Clock, AlertCircle, RefreshCw, Save, X } from 'lucide-react';

const emptyRequestForm = {
  description: '',
  clientId: '',
  date: '',
  priority: 'normal',
  status: 'nouveau'
};

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ status: 'all', priority: 'all' });
  const [editingRequest, setEditingRequest] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState(emptyRequestForm);

  useEffect(() => {
    fetchRequests();
  }, [filters]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.status !== 'all') params.status = filters.status;
      if (filters.priority !== 'all') params.priority = filters.priority;
      
      const response = await getRequests(params);
      setRequests(response.data.data || []);
    } catch (error) {
      toast.error('Erreur de chargement des demandes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cette demande ?')) return;
    try {
      await deleteRequest(id);
      toast.success('Demande supprimée');
      fetchRequests();
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const openCreateModal = () => {
    setIsCreating(true);
    setEditingRequest(null);
    setFormData(emptyRequestForm);
  };

  const openDetailsModal = (request) => {
    setSelectedRequest(request);
  };

  const closeDetailsModal = () => {
    setSelectedRequest(null);
  };

  const openEditModal = (request) => {
    setEditingRequest(request);
    setIsCreating(false);
    setFormData({
      description: request.description || '',
      clientId: request.clientId || '',
      date: request.date?.toDate ? request.date.toDate().toISOString().slice(0, 10) : '',
      priority: request.priority || 'normal',
      status: request.status || 'nouveau'
    });
  };

  const closeEditModal = () => {
    setEditingRequest(null);
    setIsCreating(false);
    setFormData(emptyRequestForm);
  };

  const handleSave = async (event) => {
    event.preventDefault();

    if (!formData.description.trim()) {
      toast.error('La description est requise');
      return;
    }

    try {
      if (isCreating) {
        await createRequest({
          ...formData,
          date: formData.date ? new Date(formData.date) : new Date()
        });
        toast.success('Demande ajoutée');
      } else {
        await updateRequest(editingRequest.id, {
          ...editingRequest,
          ...formData,
          date: formData.date ? new Date(formData.date) : editingRequest.date
        });
        toast.success('Demande mise à jour');
      }
      closeEditModal();
      fetchRequests();
    } catch (error) {
      toast.error(isCreating ? 'Erreur lors de l’ajout' : 'Erreur lors de la mise à jour');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      nouveau: 'b-nouveau',
      en_cours: 'b-en-cours',
      traite: 'b-traite',
      annule: 'b-annule'
    };
    return badges[status] || 'b-nouveau';
  };

  const getStatusLabel = (status) => {
    const labels = {
      nouveau: 'Nouveau',
      en_cours: 'En cours',
      traite: 'Traité',
      annule: 'Annulé'
    };
    return labels[status] || status;
  };

  const filteredRequests = useMemo(() =>
    requests.filter((request) => {
      const searchValue = search.toLowerCase();
      return request.description?.toLowerCase().includes(searchValue);
    }),
    [requests, search]
  );

  const summary = useMemo(() => ({
    total: requests.length,
    urgentCount: requests.filter((request) => request.priority === 'urgent').length,
    pendingCount: requests.filter((request) => request.status === 'nouveau' || request.status === 'en_cours').length
  }), [requests]);

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="page-head-title">Demandes de services</div>
          <div className="page-head-sub">Suivi des demandes clients et évolution des statuts</div>
        </div>
        <div className="page-head-actions">
          <button onClick={fetchRequests} className="btn-ghost">
            <RefreshCw size={18} /> Rafraîchir
          </button>
          <button onClick={openCreateModal} className="btn-primary">
            <Plus size={18} /> Ajouter
          </button>
        </div>
      </div>

      <div className="order-summary-grid">
        <div className="kpi-card order-summary-card">
          <div className="kpi-top">
            <div>
              <div className="kpi-label">Demandes</div>
              <div className="kpi-value">{summary.total}</div>
            </div>
            <div className="kpi-icon" style={{ background: 'rgba(14, 165, 201, 0.12)', color: 'var(--aqua)' }}>
              <FileText size={20} />
            </div>
          </div>
          <div className="order-summary-meta">Total enregistrées</div>
        </div>

        <div className="kpi-card order-summary-card">
          <div className="kpi-top">
            <div>
              <div className="kpi-label">Urgentes</div>
              <div className="kpi-value">{summary.urgentCount}</div>
            </div>
            <div className="kpi-icon" style={{ background: 'rgba(239, 68, 68, 0.12)', color: 'var(--red)' }}>
              <AlertCircle size={20} />
            </div>
          </div>
          <div className="order-summary-meta">À traiter en priorité</div>
        </div>

        <div className="kpi-card order-summary-card">
          <div className="kpi-top">
            <div>
              <div className="kpi-label">En cours</div>
              <div className="kpi-value">{summary.pendingCount}</div>
            </div>
            <div className="kpi-icon" style={{ background: 'rgba(245, 158, 11, 0.12)', color: 'var(--amber)' }}>
              <Clock size={20} />
            </div>
          </div>
          <div className="order-summary-meta">Demandes actives</div>
        </div>
      </div>

      <div className="table-card">
        <div className="toolbar">
          <div className="search-box">
            <Search size={16} />
            <input
              type="text"
              placeholder="Rechercher une demande..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="toolbar-actions">
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="f-input"
            >
              <option value="all">Tous statuts</option>
              <option value="nouveau">Nouveau</option>
              <option value="en_cours">En cours</option>
              <option value="traite">Traité</option>
              <option value="annule">Annulé</option>
            </select>
            <select
              value={filters.priority}
              onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
              className="f-input"
            >
              <option value="all">Toutes priorités</option>
              <option value="normal">Normal</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Description</th>
                <th>Date</th>
                <th>Priorité</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="table-loader">Chargement...</td></tr>
              ) : filteredRequests.length === 0 ? (
                <tr><td colSpan="6" className="table-empty">Aucune demande trouvée</td></tr>
              ) : (
                filteredRequests.map((request) => (
                  <tr key={request.id}>
                    <td>
                      <div className="order-client-name">#{request.id?.slice(0, 4)}</div>
                    </td>
                    <td>
                      <div className="cell-prod">
                        <div className="cell-emoji">📝</div>
                        <div>
                          <div className="order-client-name">{request.description?.slice(0, 70)}{request.description?.length > 70 ? '...' : ''}</div>
                          <div className="order-client-meta">Client ID: {request.clientId || '—'}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="order-client-name">{request.date?.toDate ? new Date(request.date.toDate()).toLocaleDateString() : '—'}</div>
                    </td>
                    <td>
                      {request.priority === 'urgent' ? (
                        <span className="badge b-annulee">Urgent</span>
                      ) : (
                        <span className="badge b-inactif">Normal</span>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadge(request.status)}`}>
                        {getStatusLabel(request.status)}
                      </span>
                    </td>
                    <td>
                      <div className="order-action-box">
                        <button
                          className="icon-btn"
                          aria-label={`Voir les détails ${request.id}`}
                          onClick={() => openDetailsModal(request)}
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(request.id)}
                          className="icon-btn"
                          aria-label={`Supprimer ${request.id}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className={`modal-overlay ${selectedRequest ? 'open' : ''}`}>
        <div className="modal">
          <div className="modal-hd">
            <div>
              <div className="modal-hd-title">Détails de la demande</div>
              <div className="modal-hd-sub">Informations complètes de la demande client</div>
            </div>
            <button type="button" className="modal-x" onClick={closeDetailsModal}>
              <X size={16} />
            </button>
          </div>

          {selectedRequest && (
            <div className="modal-body">
              <div className="f-group">
                <label className="f-label">Description</label>
                <div className="f-input" style={{ minHeight: '90px', display: 'flex', alignItems: 'center' }}>
                  {selectedRequest.description || 'Aucune description'}
                </div>
              </div>

              <div className="f-row2">
                <div className="f-group">
                  <label className="f-label">Écrite par</label>
                  <div className="f-input">{selectedRequest.clientId || 'Non renseigné'}</div>
                </div>
                <div className="f-group">
                  <label className="f-label">Date</label>
                  <div className="f-input">{selectedRequest.date?.toDate ? new Date(selectedRequest.date.toDate()).toLocaleString() : '—'}</div>
                </div>
              </div>

              <div className="f-row2">
                <div className="f-group">
                  <label className="f-label">Priorité</label>
                  <div className="f-input">{selectedRequest.priority === 'urgent' ? 'Urgente' : 'Normale'}</div>
                </div>
                <div className="f-group">
                  <label className="f-label">Statut</label>
                  <div className="f-input">{getStatusLabel(selectedRequest.status)}</div>
                </div>
              </div>

              <div className="f-group">
                <label className="f-label">Référence</label>
                <div className="f-input">#{selectedRequest.id?.slice(0, 8) || '—'}</div>
              </div>
            </div>
          )}

          <div className="modal-ft">
            <button type="button" className="btn-ghost" onClick={closeDetailsModal}>
              <X size={16} /> Fermer
            </button>
          </div>
        </div>
      </div>

      <div className={`modal-overlay ${editingRequest || isCreating ? 'open' : ''}`}>
        <div className="modal">
          <div className="modal-hd">
            <div>
              <div className="modal-hd-title">{isCreating ? 'Ajouter une demande' : 'Modifier la demande'}</div>
              <div className="modal-hd-sub">{isCreating ? 'Créez une nouvelle demande client' : 'Mettez à jour la demande'}</div>
            </div>
            <button type="button" className="modal-x" onClick={closeEditModal}>
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleSave}>
            <div className="modal-body">
              <div className="f-group">
                <label className="f-label">Description</label>
                <textarea
                  className="f-textarea"
                  rows="4"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Décrivez la demande"
                />
              </div>

              <div className="f-row2">
                <div className="f-group">
                  <label className="f-label">Client ID</label>
                  <input
                    className="f-input"
                    value={formData.clientId}
                    onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                    placeholder="ID client"
                  />
                </div>
                <div className="f-group">
                  <label className="f-label">Date</label>
                  <input
                    className="f-input"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
              </div>

              <div className="f-row2">
                <div className="f-group">
                  <label className="f-label">Priorité</label>
                  <select
                    className="f-input"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  >
                    <option value="normal">Normal</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div className="f-group">
                  <label className="f-label">Statut</label>
                  <select
                    className="f-input"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="nouveau">Nouveau</option>
                    <option value="en_cours">En cours</option>
                    <option value="traite">Traité</option>
                    <option value="annule">Annulé</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="modal-ft">
              <button type="button" className="btn-ghost" onClick={closeEditModal}>
                <X size={16} /> Annuler
              </button>
              <button type="submit" className="btn-primary">
                <Save size={16} /> Enregistrer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Requests;