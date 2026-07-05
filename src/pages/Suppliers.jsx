// src/pages/Suppliers.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { getSuppliers, deleteSupplier, updateSupplier, createSupplier } from '../api/endpoints';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2, Search, Truck, Save, X, RefreshCw, Mail, Phone } from 'lucide-react';

const emptySupplierForm = {
  name: '',
  contact: '',
  phone: '',
  email: '',
  address: '',
  active: 'true'
};

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState(emptySupplierForm);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const response = await getSuppliers();
      setSuppliers(response.data.data || []);
    } catch (error) {
      toast.error('Erreur de chargement des fournisseurs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce fournisseur ?')) return;
    try {
      await deleteSupplier(id);
      toast.success('Fournisseur supprimé');
      fetchSuppliers();
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const openEditModal = (supplier) => {
    setEditingSupplier(supplier);
    setFormData({
      name: supplier.name || '',
      contact: supplier.contact || '',
      phone: supplier.phone || '',
      email: supplier.email || '',
      address: supplier.address || '',
      active: supplier.active ? 'true' : 'false'
    });
  };

  const closeEditModal = () => {
    setEditingSupplier(null);
    setIsCreating(false);
    setFormData(emptySupplierForm);
  };

  const openCreateModal = () => {
    setIsCreating(true);
    setEditingSupplier(null);
    setFormData(emptySupplierForm);
  };

  const handleSaveEdit = async (event) => {
    event.preventDefault();

    if (!editingSupplier) return;
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error('Le nom et l’email sont requis');
      return;
    }

    try {
      if (isCreating) {
        await createSupplier({
          ...formData,
          active: formData.active === 'true'
        });
        toast.success('Fournisseur ajouté');
      } else {
        await updateSupplier(editingSupplier.id, {
          ...editingSupplier,
          ...formData,
          active: formData.active === 'true'
        });
        toast.success('Fournisseur mis à jour');
      }
      closeEditModal();
      fetchSuppliers();
    } catch (error) {
      toast.error(isCreating ? 'Erreur lors de l’ajout' : 'Erreur lors de la mise à jour');
    }
  };

  const filteredSuppliers = useMemo(() =>
    suppliers.filter((supplier) => {
      const searchValue = search.toLowerCase();
      return (
        supplier.name?.toLowerCase().includes(searchValue) ||
        supplier.contact?.toLowerCase().includes(searchValue) ||
        supplier.email?.toLowerCase().includes(searchValue)
      );
    }),
    [suppliers, search]
  );

  const summary = useMemo(() => ({
    total: suppliers.length,
    activeCount: suppliers.filter((supplier) => supplier.active).length,
    contactCount: suppliers.filter((supplier) => supplier.contact).length
  }), [suppliers]);

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="page-head-title">Fournisseurs</div>
          <div className="page-head-sub">Gestion des partenaires et contacts fournisseurs</div>
        </div>
        <div className="page-head-actions">
          <button onClick={fetchSuppliers} className="btn-ghost">
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
              <div className="kpi-label">Fournisseurs</div>
              <div className="kpi-value">{summary.total}</div>
            </div>
            <div className="kpi-icon" style={{ background: 'rgba(14, 165, 201, 0.12)', color: 'var(--aqua)' }}>
              <Truck size={20} />
            </div>
          </div>
          <div className="order-summary-meta">Partenaires enregistrés</div>
        </div>

        <div className="kpi-card order-summary-card">
          <div className="kpi-top">
            <div>
              <div className="kpi-label">Actifs</div>
              <div className="kpi-value">{summary.activeCount}</div>
            </div>
            <div className="kpi-icon" style={{ background: 'rgba(16, 185, 129, 0.12)', color: 'var(--mint)' }}>
              <Truck size={20} />
            </div>
          </div>
          <div className="order-summary-meta">Relations actives</div>
        </div>

        <div className="kpi-card order-summary-card">
          <div className="kpi-top">
            <div>
              <div className="kpi-label">Contacts</div>
              <div className="kpi-value">{summary.contactCount}</div>
            </div>
            <div className="kpi-icon" style={{ background: 'rgba(139, 92, 246, 0.12)', color: 'var(--violet)' }}>
              <Mail size={20} />
            </div>
          </div>
          <div className="order-summary-meta">Contacts renseignés</div>
        </div>
      </div>

      <div className="table-card">
        <div className="toolbar">
          <div className="search-box">
            <Search size={16} />
            <input
              type="text"
              placeholder="Rechercher un fournisseur, contact ou email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Fournisseur</th>
                <th>Contact</th>
                <th>Téléphone</th>
                <th>Email</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="table-loader">Chargement...</td></tr>
              ) : filteredSuppliers.length === 0 ? (
                <tr><td colSpan="6" className="table-empty">Aucun fournisseur trouvé</td></tr>
              ) : (
                filteredSuppliers.map((supplier) => (
                  <tr key={supplier.id}>
                    <td>
                      <div className="cell-prod">
                        <div className="cell-emoji">🚚</div>
                        <div>
                          <div className="order-client-name">{supplier.name}</div>
                          <div className="order-client-meta">{supplier.address || 'Adresse non renseignée'}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="order-client-name">{supplier.contact || '—'}</div>
                    </td>
                    <td>
                      <div className="order-client-name">{supplier.phone || '—'}</div>
                    </td>
                    <td>
                      <div className="order-client-name">{supplier.email || '—'}</div>
                    </td>
                    <td>
                      <span className={supplier.active ? 'badge b-livree' : 'badge b-inactif'}>
                        {supplier.active ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td>
                      <div className="order-action-box">
                        <button
                          className="icon-btn"
                          aria-label={`Modifier ${supplier.name}`}
                          onClick={() => openEditModal(supplier)}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(supplier.id)}
                          className="icon-btn"
                          aria-label={`Supprimer ${supplier.name}`}
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

      <div className={`modal-overlay ${editingSupplier || isCreating ? 'open' : ''}`}>
        <div className="modal">
          <div className="modal-hd">
            <div>
              <div className="modal-hd-title">{isCreating ? 'Ajouter un fournisseur' : 'Modifier le fournisseur'}</div>
              <div className="modal-hd-sub">{isCreating ? 'Créez un nouveau partenaire' : 'Mettez à jour les informations du partenaire'}</div>
            </div>
            <button type="button" className="modal-x" onClick={closeEditModal}>
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleSaveEdit}>
            <div className="modal-body">
              <div className="f-row2">
                <div className="f-group">
                  <label className="f-label">Nom</label>
                  <input
                    className="f-input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Nom du fournisseur"
                  />
                </div>
                <div className="f-group">
                  <label className="f-label">Contact</label>
                  <input
                    className="f-input"
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    placeholder="Nom du contact"
                  />
                </div>
              </div>

              <div className="f-row2">
                <div className="f-group">
                  <label className="f-label">Téléphone</label>
                  <input
                    className="f-input"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Téléphone"
                  />
                </div>
                <div className="f-group">
                  <label className="f-label">Email</label>
                  <input
                    className="f-input"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Email"
                  />
                </div>
              </div>

              <div className="f-group">
                <label className="f-label">Adresse</label>
                <input
                  className="f-input"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Adresse"
                />
              </div>

              <div className="f-group">
                <label className="f-label">Statut</label>
                <select
                  className="f-input"
                  value={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.value })}
                >
                  <option value="true">Actif</option>
                  <option value="false">Inactif</option>
                </select>
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

export default Suppliers;