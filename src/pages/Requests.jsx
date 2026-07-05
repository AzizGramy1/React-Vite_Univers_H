// src/pages/Requests.jsx
import React, { useState, useEffect } from 'react';
import { getRequests, deleteRequest } from '../api/endpoints';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2, Search, FileText, Clock, AlertCircle } from 'lucide-react';

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ status: 'all', priority: 'all' });

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

  const filteredRequests = requests.filter(r =>
    r.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Demandes de services</h1>
        <button 
          onClick={() => toast.info('Formulaire d\'ajout de demande')}
          className="bg-cyan-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-cyan-700 transition-colors"
        >
          <Plus size={20} /> Ajouter
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Rechercher une demande..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              />
            </div>
          </div>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none"
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
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none"
          >
            <option value="all">Toutes priorités</option>
            <option value="normal">Normal</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priorité</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan="6" className="text-center py-4">Chargement...</td></tr>
              ) : filteredRequests.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-4 text-gray-500">Aucune demande</td></tr>
              ) : (
                filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-500">#{request.id?.slice(0, 4)}</td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-800">{request.description?.slice(0, 60)}...</p>
                        <p className="text-sm text-gray-500">Client ID: {request.clientId}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {request.date?.toDate ? new Date(request.date.toDate()).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-6 py-4">
                      {request.priority === 'urgent' ? (
                        <span className="flex items-center gap-1 text-red-600 font-medium">
                          <AlertCircle size={16} /> Urgent
                        </span>
                      ) : (
                        <span className="text-gray-500">Normal</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`badge ${getStatusBadge(request.status)}`}>
                        {getStatusLabel(request.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(request.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
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
  );
};

export default Requests;