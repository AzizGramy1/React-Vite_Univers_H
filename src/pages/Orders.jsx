// src/pages/Orders.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { getOrders, updateOrderStatus } from '../api/endpoints';
import toast from 'react-hot-toast';
import { Clock3, Eye, PackageCheck, RefreshCw, Search, Truck, X } from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ status: 'all', type: 'all' });
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, [filters]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.status !== 'all') params.status = filters.status;
      if (filters.type !== 'all') params.type = filters.type;

      const response = await getOrders(params);
      setOrders(response.data.data || []);
    } catch (error) {
      toast.error('Erreur de chargement des commandes');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateOrderStatus(id, newStatus);
      toast.success(`Statut mis à jour : ${newStatus}`);
      fetchOrders();
    } catch (error) {
      toast.error('Erreur lors du changement de statut');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      attente: 'badge b-attente',
      confirmee: 'badge b-confirmee',
      expediee: 'badge b-expediee',
      livree: 'badge b-livree',
      annulee: 'badge b-annulee'
    };
    return colors[status] || 'badge b-inactif';
  };

  const getStatusLabel = (status) => {
    const labels = {
      attente: 'En attente',
      confirmee: 'Confirmée',
      expediee: 'Expédiée',
      livree: 'Livrée',
      annulee: 'Annulée'
    };
    return labels[status] || status;
  };

  const filteredOrders = useMemo(() =>
    orders.filter((order) => {
      const searchValue = search.toLowerCase();
      return (
        order.num?.toLowerCase().includes(searchValue) ||
        order.clientName?.toLowerCase().includes(searchValue) ||
        order.clientEmail?.toLowerCase().includes(searchValue)
      );
    }),
    [orders, search]
  );

  const summary = useMemo(() => {
    const pending = orders.filter((order) => order.status === 'attente').length;
    const shipped = orders.filter((order) => ['expediee', 'livree'].includes(order.status)).length;
    const revenue = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);

    return {
      total: orders.length,
      pending,
      shipped,
      revenue
    };
  }, [orders]);

  const currency = (value) => `${Number(value || 0).toLocaleString('fr-TN')} DT`;

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
  };

  const closeOrderDetails = () => {
    setSelectedOrder(null);
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="page-head-title">Commandes</div>
          <div className="page-head-sub">Suivi des commandes et changement de statut en temps réel</div>
        </div>
        <div className="page-head-actions">
          <button onClick={fetchOrders} className="btn-ghost">
            <RefreshCw size={18} /> Rafraîchir
          </button>
        </div>
      </div>

      <div className="order-summary-grid">
        <div className="kpi-card order-summary-card">
          <div className="kpi-top">
            <div>
              <div className="kpi-label">Total commandes</div>
              <div className="kpi-value">{summary.total}</div>
            </div>
            <div className="kpi-icon" style={{ background: 'rgba(14, 165, 201, 0.12)', color: 'var(--aqua)' }}>
              <PackageCheck size={20} />
            </div>
          </div>
          <div className="order-summary-meta">En cours de traitement</div>
        </div>

        <div className="kpi-card order-summary-card">
          <div className="kpi-top">
            <div>
              <div className="kpi-label">En attente</div>
              <div className="kpi-value">{summary.pending}</div>
            </div>
            <div className="kpi-icon" style={{ background: 'rgba(245, 158, 11, 0.12)', color: 'var(--amber)' }}>
              <Clock3 size={20} />
            </div>
          </div>
          <div className="order-summary-meta">À valider rapidement</div>
        </div>

        <div className="kpi-card order-summary-card">
          <div className="kpi-top">
            <div>
              <div className="kpi-label">Traitées</div>
              <div className="kpi-value">{summary.shipped}</div>
            </div>
            <div className="kpi-icon" style={{ background: 'rgba(139, 92, 246, 0.12)', color: 'var(--violet)' }}>
              <Truck size={20} />
            </div>
          </div>
          <div className="order-summary-meta">Expédiées ou livrées</div>
        </div>

        <div className="kpi-card order-summary-card">
          <div className="kpi-top">
            <div>
              <div className="kpi-label">CA estimé</div>
              <div className="kpi-value">{currency(summary.revenue)}</div>
            </div>
            <div className="kpi-icon" style={{ background: 'rgba(16, 185, 129, 0.12)', color: 'var(--mint)' }}>
              <PackageCheck size={20} />
            </div>
          </div>
          <div className="order-summary-meta">Sur la période actuelle</div>
        </div>
      </div>

      <div className="table-card">
        <div className="toolbar">
          <div className="search-box">
            <Search size={16} />
            <input
              type="text"
              placeholder="Rechercher par numéro, client ou email..."
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
              <option value="attente">En attente</option>
              <option value="confirmee">Confirmée</option>
              <option value="expediee">Expédiée</option>
              <option value="livree">Livrée</option>
              <option value="annulee">Annulée</option>
            </select>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="f-input"
            >
              <option value="all">Tous types</option>
              <option value="product">Produits</option>
              <option value="service">Services</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>N° Bon</th>
                <th>Client</th>
                <th>Type</th>
                <th>Date</th>
                <th>Total</th>
                <th>Statut</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" className="table-loader">Chargement...</td></tr>
              ) : filteredOrders.length === 0 ? (
                <tr><td colSpan="7" className="table-empty">Aucune commande trouvée</td></tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <div className="cell-prod">
                        <div className="cell-emoji">🧾</div>
                        <div>
                          <div className="order-client-name">{order.num}</div>
                          <div className="order-client-meta">{order.clientEmail || 'Commande enregistrée'}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="order-client-block">
                        <div className="order-client-name">{order.clientName}</div>
                        <div className="order-client-meta">Client principal</div>
                      </div>
                    </td>
                    <td>
                      <span className={`order-pill ${order.type === 'service' ? 'order-pill-service' : 'order-pill-product'}`}>
                        {order.type === 'service' ? 'Service' : 'Produit'}
                      </span>
                    </td>
                    <td>
                      <div className="order-client-name">
                        {order.date?.toDate ? new Date(order.date.toDate()).toLocaleDateString('fr-FR') : '—'}
                      </div>
                      <div className="order-client-meta">{order.date?.toDate ? 'Date de création' : 'À confirmer'}</div>
                    </td>
                    <td>
                      <div className="order-amount">{currency(order.total)}</div>
                    </td>
                    <td>
                      <span className={getStatusColor(order.status)}>{getStatusLabel(order.status)}</span>
                    </td>
                    <td>
                      <div className="order-action-box">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className="f-input order-select"
                        >
                          <option value="attente">En attente</option>
                          <option value="confirmee">Confirmée</option>
                          <option value="expediee">Expédiée</option>
                          <option value="livree">Livrée</option>
                          <option value="annulee">Annulée</option>
                        </select>
                        <button
                          onClick={() => openOrderDetails(order)}
                          className="icon-btn"
                          aria-label={`Voir ${order.num}`}
                        >
                          <Eye size={16} />
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

      <div className={`modal-overlay ${selectedOrder ? 'open' : ''}`} onClick={closeOrderDetails}>
        <div className="modal" onClick={(event) => event.stopPropagation()}>
          <div className="modal-hd">
            <div>
              <div className="modal-hd-title">Détails de la commande</div>
              <div className="modal-hd-sub">Informations complètes de la commande sélectionnée</div>
            </div>
            <button className="modal-x" onClick={closeOrderDetails} aria-label="Fermer">
              <X size={16} />
            </button>
          </div>

          {selectedOrder && (
            <div className="modal-body">
              <div className="f-group">
                <label className="f-label">Numéro de bon</label>
                <div className="order-client-name">{selectedOrder.num}</div>
              </div>

              <div className="f-group">
                <label className="f-label">Client</label>
                <div className="order-client-name">{selectedOrder.clientName || '—'}</div>
                <div className="order-client-meta">{selectedOrder.clientEmail || 'Aucun email renseigné'}</div>
              </div>

              <div className="f-group">
                <label className="f-label">Type</label>
                <span className={`order-pill ${selectedOrder.type === 'service' ? 'order-pill-service' : 'order-pill-product'}`}>
                  {selectedOrder.type === 'service' ? 'Service' : 'Produit'}
                </span>
              </div>

              <div className="f-group">
                <label className="f-label">Date</label>
                <div className="order-client-name">
                  {selectedOrder.date?.toDate ? new Date(selectedOrder.date.toDate()).toLocaleDateString('fr-FR') : '—'}
                </div>
              </div>

              <div className="f-group">
                <label className="f-label">Montant total</label>
                <div className="order-amount">{currency(selectedOrder.total)}</div>
              </div>

              <div className="f-group">
                <label className="f-label">Statut actuel</label>
                <span className={getStatusColor(selectedOrder.status)}>{getStatusLabel(selectedOrder.status)}</span>
              </div>

              <div className="f-group">
                <label className="f-label">Notes</label>
                <div className="order-client-meta">{selectedOrder.note || 'Aucune note disponible'}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;