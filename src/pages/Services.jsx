// src/pages/Services.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { getServices, deleteService, updateService } from '../api/endpoints';
import toast from 'react-hot-toast';
import { Edit, RefreshCw, Save, Search, Sparkles, Trash2, Wrench, X } from 'lucide-react';

const emptyServiceForm = {
  name: '',
  type: 'b2c',
  price: '',
  duration: '',
  active: 'true',
  badge: ''
};

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ type: 'all', active: 'all' });
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState(emptyServiceForm);

  useEffect(() => {
    fetchServices();
  }, [filters]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.type !== 'all') params.type = filters.type;
      if (filters.active !== 'all') params.active = filters.active === 'true';

      const response = await getServices(params);
      setServices(response.data.data || []);
    } catch (error) {
      toast.error('Erreur de chargement des services');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce service ?')) return;
    try {
      await deleteService(id);
      toast.success('Service supprimé');
      fetchServices();
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const openEditModal = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name || '',
      type: service.type || 'b2c',
      price: service.price || '',
      duration: service.duration || '',
      active: service.active ? 'true' : 'false',
      badge: service.badge || ''
    });
  };

  const closeEditModal = () => {
    setEditingService(null);
    setFormData(emptyServiceForm);
  };

  const handleSaveEdit = async (event) => {
    event.preventDefault();

    if (!editingService) return;
    if (!formData.name.trim()) {
      toast.error('Le nom du service est requis');
      return;
    }

    try {
      await updateService(editingService.id, {
        ...editingService,
        ...formData,
        price: Number(formData.price || 0),
        active: formData.active === 'true'
      });
      toast.success('Service mis à jour');
      closeEditModal();
      fetchServices();
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const filteredServices = useMemo(() =>
    services.filter((service) =>
      service.name?.toLowerCase().includes(search.toLowerCase()) ||
      service.duration?.toLowerCase().includes(search.toLowerCase())
    ),
    [services, search]
  );

  const summary = useMemo(() => {
    const activeCount = services.filter((service) => service.active).length;
    const b2bCount = services.filter((service) => service.type === 'b2b').length;
    const revenue = services.reduce((sum, service) => sum + Number(service.price || 0), 0);

    return {
      total: services.length,
      activeCount,
      b2bCount,
      revenue
    };
  }, [services]);

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="page-head-title">Services</div>
          <div className="page-head-sub">Gestion des offres techniques et des prestations</div>
        </div>
        <div className="page-head-actions">
          <button onClick={fetchServices} className="btn-ghost">
            <RefreshCw size={18} /> Rafraîchir
          </button>
        </div>
      </div>

      <div className="order-summary-grid">
        <div className="kpi-card order-summary-card">
          <div className="kpi-top">
            <div>
              <div className="kpi-label">Services</div>
              <div className="kpi-value">{summary.total}</div>
            </div>
            <div className="kpi-icon" style={{ background: 'rgba(14, 165, 201, 0.12)', color: 'var(--aqua)' }}>
              <Wrench size={20} />
            </div>
          </div>
          <div className="order-summary-meta">Offres disponibles</div>
        </div>

        <div className="kpi-card order-summary-card">
          <div className="kpi-top">
            <div>
              <div className="kpi-label">Actifs</div>
              <div className="kpi-value">{summary.activeCount}</div>
            </div>
            <div className="kpi-icon" style={{ background: 'rgba(16, 185, 129, 0.12)', color: 'var(--mint)' }}>
              <Sparkles size={20} />
            </div>
          </div>
          <div className="order-summary-meta">Prestations proposées</div>
        </div>

        <div className="kpi-card order-summary-card">
          <div className="kpi-top">
            <div>
              <div className="kpi-label">Tarifs</div>
              <div className="kpi-value">{summary.revenue} DT</div>
            </div>
            <div className="kpi-icon" style={{ background: 'rgba(139, 92, 246, 0.12)', color: 'var(--violet)' }}>
              <Wrench size={20} />
            </div>
          </div>
          <div className="order-summary-meta">Valeur catalogue</div>
        </div>
      </div>

      <div className="table-card">
        <div className="toolbar">
          <div className="search-box">
            <Search size={16} />
            <input
              type="text"
              placeholder="Rechercher un service ou une durée..."
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
              value={filters.active}
              onChange={(e) => setFilters({ ...filters, active: e.target.value })}
              className="f-input"
            >
              <option value="all">Tous statuts</option>
              <option value="true">Actifs</option>
              <option value="false">Inactifs</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Service</th>
                <th>Type</th>
                <th>Tarif</th>
                <th>Durée</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="table-loader">Chargement...</td></tr>
              ) : filteredServices.length === 0 ? (
                <tr><td colSpan="6" className="table-empty">Aucun service trouvé</td></tr>
              ) : (
                filteredServices.map((service) => (
                  <tr key={service.id}>
                    <td>
                      <div className="cell-prod">
                        <div className="cell-emoji">🧰</div>
                        <div>
                          <div className="order-client-name">{service.name}</div>
                          {service.badge && (
                            <div className="order-client-meta">{service.badge}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`order-pill ${service.type === 'b2b' ? 'order-pill-product' : 'order-pill-service'}`}>
                        {service.type?.toUpperCase() || 'B2C'}
                      </span>
                    </td>
                    <td>
                      <div className="order-amount">{service.price} DT</div>
                    </td>
                    <td>
                      <div className="order-client-name">{service.duration || '—'}</div>
                    </td>
                    <td>
                      <span className={service.active ? 'badge b-livree' : 'badge b-inactif'}>
                        {service.active ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td>
                      <div className="order-action-box">
                        <button
                          className="icon-btn"
                          aria-label={`Modifier ${service.name}`}
                          onClick={() => openEditModal(service)}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(service.id)}
                          className="icon-btn"
                          aria-label={`Supprimer ${service.name}`}
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

      <div className={`modal-overlay ${editingService ? 'open' : ''}`} onClick={closeEditModal}>
        <div className="modal" onClick={(event) => event.stopPropagation()}>
          <div className="modal-hd">
            <div>
              <div className="modal-hd-title">Modifier le service</div>
              <div className="modal-hd-sub">Mettre à jour les informations de la prestation</div>
            </div>
            <button className="modal-x" onClick={closeEditModal} aria-label="Fermer">
              <X size={16} />
            </button>
          </div>

          <form className="modal-body" onSubmit={handleSaveEdit}>
            <div className="f-group">
              <label className="f-label">Nom du service</label>
              <input
                className="f-input"
                value={formData.name}
                onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                placeholder="Nom du service"
                required
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
              <label className="f-label">Tarif (DT)</label>
              <input
                className="f-input"
                type="number"
                min="0"
                value={formData.price}
                onChange={(event) => setFormData({ ...formData, price: event.target.value })}
                placeholder="0"
              />
            </div>

            <div className="f-group">
              <label className="f-label">Durée</label>
              <input
                className="f-input"
                value={formData.duration}
                onChange={(event) => setFormData({ ...formData, duration: event.target.value })}
                placeholder="Ex. 2 heures"
              />
            </div>

            <div className="f-group">
              <label className="f-label">Statut</label>
              <select
                className="f-input"
                value={formData.active}
                onChange={(event) => setFormData({ ...formData, active: event.target.value })}
              >
                <option value="true">Actif</option>
                <option value="false">Inactif</option>
              </select>
            </div>

            <div className="f-group">
              <label className="f-label">Badge</label>
              <input
                className="f-input"
                value={formData.badge}
                onChange={(event) => setFormData({ ...formData, badge: event.target.value })}
                placeholder="Badge optionnel"
              />
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

export default Services;