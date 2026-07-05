// src/pages/Orders.jsx
import React, { useState, useEffect } from 'react';
import { getOrders, updateOrderStatus } from '../api/endpoints';
import toast from 'react-hot-toast';
import { Eye, Search, RefreshCw } from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ status: 'all', type: 'all' });

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
      attente: 'bg-yellow-100 text-yellow-700',
      confirmee: 'bg-blue-100 text-blue-700',
      expediee: 'bg-purple-100 text-purple-700',
      livree: 'bg-green-100 text-green-700',
      annulee: 'bg-red-100 text-red-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
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

  const filteredOrders = orders.filter(o =>
    o.num?.toLowerCase().includes(search.toLowerCase()) ||
    o.clientName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="page-head-title">Commandes</div>
          <div className="page-head-sub">Suivi des commandes et changement de statut en temps réel</div>
        </div>
        <div className="page-head-actions">
          <button 
            onClick={fetchOrders}
            className="btn-ghost"
          >
            <RefreshCw size={18} /> Rafraîchir
          </button>
        </div>
      </div>

      <div className="table-card">
        <div className="toolbar">
          <div className="search-box">
            <Search size={16} />
            <input
              type="text"
              placeholder="Rechercher par numéro ou client..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
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

        <div className="overflow-x-auto">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">N° Bon</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan="7" className="table-loader">Chargement...</td></tr>
              ) : filteredOrders.length === 0 ? (
                <tr><td colSpan="7" className="table-empty">Aucune commande</td></tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-cyan-600">{order.num}</td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-800">{order.clientName}</p>
                        <p className="text-sm text-gray-500">{order.clientEmail}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        order.type === 'service' ? 'bg-purple-100 text-purple-700' : 'bg-cyan-100 text-cyan-700'
                      }`}>
                        {order.type === 'service' ? 'Service' : 'Produit'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {order.date?.toDate ? new Date(order.date.toDate()).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-800">{order.total} DT</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className="text-xs border border-gray-300 rounded-lg px-2 py-1 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                        >
                          <option value="attente">En attente</option>
                          <option value="confirmee">Confirmée</option>
                          <option value="expediee">Expédiée</option>
                          <option value="livree">Livrée</option>
                          <option value="annulee">Annulée</option>
                        </select>
                        <button 
                          onClick={() => toast.info(`Détails de la commande ${order.num}`)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
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
      </div>
    </div>
  );
};

export default Orders;