// src/pages/Quotes.jsx
import React, { useState, useEffect } from 'react';
import { getQuotes, deleteQuote } from '../api/endpoints';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2, Search, FileCheck, Eye } from 'lucide-react';

const Quotes = () => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ status: 'all' });

  useEffect(() => {
    fetchQuotes();
  }, [filters]);

  const fetchQuotes = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.status !== 'all') params.status = filters.status;
      
      const response = await getQuotes(params);
      setQuotes(response.data.data || []);
    } catch (error) {
      toast.error('Erreur de chargement des devis');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce devis ?')) return;
    try {
      await deleteQuote(id);
      toast.success('Devis supprimé');
      fetchQuotes();
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      brouillon: 'b-brouillon',
      envoye: 'b-envoye',
      accepte: 'b-accepte',
      refuse: 'b-refuse'
    };
    return badges[status] || 'b-brouillon';
  };

  const getStatusLabel = (status) => {
    const labels = {
      brouillon: 'Brouillon',
      envoye: 'Envoyé',
      accepte: 'Accepté',
      refuse: 'Refusé'
    };
    return labels[status] || status;
  };

  const filteredQuotes = quotes.filter(q =>
    q.num?.toLowerCase().includes(search.toLowerCase()) ||
    q.clientName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Devis</h1>
        <button 
          onClick={() => toast.info('Formulaire d\'ajout de devis')}
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
                placeholder="Rechercher un devis..."
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
            <option value="brouillon">Brouillon</option>
            <option value="envoye">Envoyé</option>
            <option value="accepte">Accepté</option>
            <option value="refuse">Refusé</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">N° Devis</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Validité</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan="7" className="text-center py-4">Chargement...</td></tr>
              ) : filteredQuotes.length === 0 ? (
                <tr><td colSpan="7" className="text-center py-4 text-gray-500">Aucun devis</td></tr>
              ) : (
                filteredQuotes.map((quote) => (
                  <tr key={quote.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-cyan-600">
                      D-{String(quote.id).slice(0, 4)}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-800">{quote.clientName}</p>
                        <p className="text-sm text-gray-500">{quote.clientEmail}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {quote.date?.toDate ? new Date(quote.date.toDate()).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-800">{quote.total} DT</td>
                    <td className="px-6 py-4 text-gray-600">
                      {quote.validUntil?.toDate ? new Date(quote.validUntil.toDate()).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`badge ${getStatusBadge(quote.status)}`}>
                        {getStatusLabel(quote.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Eye size={18} />
                        </button>
                        <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(quote.id)}
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

export default Quotes;