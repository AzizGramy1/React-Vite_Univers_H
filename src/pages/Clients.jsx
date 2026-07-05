// src/pages/Clients.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { getClients, deleteClient, updateClient } from '../api/endpoints';
import toast from 'react-hot-toast';
import { Edit, Search, Trash2, Users, Sparkles, RefreshCw, X, Save } from 'lucide-react';

const emptyClientForm = {
  name: '',
  email: '',
  phone: '',
  city: '',
  type: 'b2c',
  vip: 'false'
};

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ type: 'all', vip: 'all' });
  const [editingClient, setEditingClient] = useState(null);
  const [formData, setFormData] = useState(emptyClientForm);

  useEffect(() => {
    fetchClients();
  }, [filters]);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.type !== 'all') params.type = filters.type;
      if (filters.vip !== 'all') params.vip = filters.vip === 'true';

      const response = await getClients(params);
      setClients(response.data.data || []);
    } catch (error) {
      toast.error('Erreur de chargement des clients');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce client ?')) return;
    try {
      await deleteClient(id);
      toast.success('Client supprimé');
      fetchClients();
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const openEditModal = (client) => {
    setEditingClient(client);
    setFormData({
      name: client.name || '',
      email: client.email || '',
      phone: client.phone || '',
      city: client.city || '',
      type: client.type || 'b2c',
      vip: client.vip ? 'true' : 'false'
    });
  };

  const closeEditModal = () => {
    setEditingClient(null);
    setFormData(emptyClientForm);
  };

  const handleSaveEdit = async (event) => {
    event.preventDefault();

    if (!editingClient) return;
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error('Le nom et l’email sont requis');
      return;
    }

    try {
      await updateClient(editingClient.id, {
        ...editingClient,
        ...formData,
        vip: formData.vip === 'true'
      });
      toast.success('Client mis à jour');
      closeEditModal();
      fetchClients();
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const filteredClients = useMemo(() =>
    clients.filter((client) => {
      const searchValue = search.toLowerCase();
      return (
        client.name?.toLowerCase().includes(searchValue) ||
        client.email?.toLowerCase().includes(searchValue) ||
        client.phone?.toLowerCase().includes(searchValue)
      );
    }),
    [clients, search]
  );

  const summary = useMemo(() => {
    const vipCount = clients.filter((client) => client.vip).length;
    const b2bCount = clients.filter((client) => client.type === 'b2b').length;

    return {
      total: clients.length,
      vipCount,
      b2bCount
    };
  }, [clients]);

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="page-head-title">Clients</div>
          <div className="page-head-sub">Gestion des clients, segmentation VIP et suivi des contacts</div>
        </div>
        <div className="page-head-actions">
          <button onClick={fetchClients} className="btn-ghost">
            <RefreshCw size={18} /> Rafraîchir
          </button>
        </div>
      </div>

      <div className="order-summary-grid">
        <div className="kpi-card order-summary-card">
          <div className="kpi-top">
            <div>
              <div className="kpi-label">Total clients</div>
              <div className="kpi-value">{summary.total}</div>
            </div>
            <div className="kpi-icon" style={{ background: 'rgba(14, 165, 201, 0.12)', color: 'var(--aqua)' }}>
              <Users size={20} />
            </div>
          </div>
          <div className="order-summary-meta">Base clients active</div>
        </div>

        <div className="kpi-card order-summary-card">
          <div className="kpi-top">
            <div>
              <div className="kpi-label">Clients VIP</div>
              <div className="kpi-value">{summary.vipCount}</div>
            </div>
            <div className="kpi-icon" style={{ background: 'rgba(245, 158, 11, 0.12)', color: 'var(--amber)' }}>
              <Sparkles size={20} />
            </div>
          </div>
          <div className="order-summary-meta">À forte valeur</div>
        </div>

        <div className="kpi-card order-summary-card">
          <div className="kpi-top">
            <div>
              <div className="kpi-label">B2B</div>
              <div className="kpi-value">{summary.b2bCount}</div>
            </div>
            <div className="kpi-icon" style={{ background: 'rgba(139, 92, 246, 0.12)', color: 'var(--violet)' }}>
              <Users size={20} />
            </div>
          </div>
          <div className="order-summary-meta">Partenaires business</div>
        </div>
      </div>

      <div className="table-card">
        <div className="toolbar">
          <div className="search-box">
            <Search size={16} />
            <input
              type="text"
              placeholder="Rechercher par nom, email ou téléphone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="toolbar-actions">
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="f-input"
            >
              <option value="all">Tous types</option>
              <option value="b2b">B2B</option>
              <option value="b2c">B2C</option>
            </select>
            <select
              value={filters.vip}
              onChange={(e) => setFilters({ ...filters, vip: e.target.value })}
              className="f-input"
            >
              <option value="all">Tous</option>
              <option value="true">VIP</option>
              <option value="false">Non VIP</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Client</th>
                <th>Téléphone</th>
                <th>Type</th>
                <th>Ville</th>
                <th>VIP</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="table-loader">Chargement...</td></tr>
              ) : filteredClients.length === 0 ? (
                <tr><td colSpan="6" className="table-empty">Aucun client trouvé</td></tr>
              ) : (
                filteredClients.map((client) => (
                  <tr key={client.id}>
                    <td>
                      <div className="cell-prod">
                        <div className="cell-emoji">👤</div>
                        <div>
                          <div className="order-client-name">{client.name}</div>
                          <div className="order-client-meta">{client.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="order-client-name">{client.phone || '—'}</div>
                    </td>
                    <td>
                      <span className={`order-pill ${client.type === 'b2b' ? 'order-pill-product' : 'order-pill-service'}`}>
                        {client.type?.toUpperCase() || 'B2C'}
                      </span>
                    </td>
                    <td>
                      <div className="order-client-name">{client.city || '—'}</div>
                    </td>
                    <td>
                      {client.vip ? (
                        <span className="badge b-attente">⭐ VIP</span>
                      ) : (
                        <span className="badge b-inactif">Standard</span>
                      )}
                    </td>
                    <td>
                      <div className="order-action-box">
                        <button
                          className="icon-btn"
                          aria-label={`Modifier ${client.name}`}
                          onClick={() => openEditModal(client)}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(client.id)}
                          className="icon-btn"
                          aria-label={`Supprimer ${client.name}`}
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

      <div className={`modal-overlay ${editingClient ? 'open' : ''}`} onClick={closeEditModal}>
        <div className="modal" onClick={(event) => event.stopPropagation()}>
          <div className="modal-hd">
            <div>
              <div className="modal-hd-title">Modifier le client</div>
              <div className="modal-hd-sub">Mettez à jour les informations du client</div>
            </div>
            <button className="modal-x" onClick={closeEditModal} aria-label="Fermer">
              <X size={16} />
            </button>
          </div>

          <form className="modal-body" onSubmit={handleSaveEdit}>
            <div className="f-group">
              <label className="f-label">Nom complet</label>
              <input
                className="f-input"
                value={formData.name}
                onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                placeholder="Nom du client"
                required
              />
            </div>

            <div className="f-group">
              <label className="f-label">Email</label>
              <input
                className="f-input"
                type="email"
                value={formData.email}
                onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                placeholder="email@exemple.com"
                required
              />
            </div>

            <div className="f-group">
              <label className="f-label">Téléphone</label>
              <input
                className="f-input"
                value={formData.phone}
                onChange={(event) => setFormData({ ...formData, phone: event.target.value })}
                placeholder="+216 12 345 678"
              />
            </div>

            <div className="f-group">
              <label className="f-label">Ville</label>
              <input
                className="f-input"
                value={formData.city}
                onChange={(event) => setFormData({ ...formData, city: event.target.value })}
                placeholder="Ville"
              />
            </div>

            <div className="f-group">
              <label className="f-label">Type</label>
              <select
                className="f-input"
                value={formData.type}
                onChange={(event) => setFormData({ ...formData, type: event.target.value })}
              >
                <option value="b2b">B2B</option>
                <option value="b2c">B2C</option>
              </select>
            </div>

            <div className="f-group">
              <label className="f-label">Statut VIP</label>
              <select
                className="f-input"
                value={formData.vip}
                onChange={(event) => setFormData({ ...formData, vip: event.target.value })}
              >
                <option value="true">VIP</option>
                <option value="false">Standard</option>
              </select>
            </div>

            <div className="modal-ft">
              <button type="button" className="btn-ghost" onClick={closeEditModal}>Annuler</button>
              <button type="submit" className="btn-ghost" style={{ background: 'var(--aqua)', color: '#fff', borderColor: 'var(--aqua)' }}>
                <Save size={16} /> Enregistrer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Clients;