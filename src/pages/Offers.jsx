// src/pages/Offers.jsx
import React, { useState, useEffect } from 'react';
import { getOffers, deleteOffer } from '../api/endpoints';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2, Search, Tag, Calendar } from 'lucide-react';

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ status: 'all' });

  useEffect(() => {
    fetchOffers();
  }, [filters]);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.status === 'active') params.active = true;
      if (filters.status === 'expired') params.active = false;
      
      const response = await getOffers(params);
      setOffers(response.data.data || []);
    } catch (error) {
      toast.error('Erreur de chargement des offres');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cette offre ?')) return;
    try {
      await deleteOffer(id);
      toast.success('Offre supprimée');
      fetchOffers();
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const filteredOffers = offers.filter(o =>
    o.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Offres & Prix</h1>
        <button 
          onClick={() => toast.info('Formulaire d\'ajout d\'offre')}
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
                placeholder="Rechercher une offre..."
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
            <option value="active">Actives</option>
            <option value="expired">Expirées</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Offre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cible</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Réduction</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Période</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan="6" className="text-center py-4">Chargement...</td></tr>
              ) : filteredOffers.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-4 text-gray-500">Aucune offre</td></tr>
              ) : (
                filteredOffers.map((offer) => (
                  <tr key={offer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Tag size={20} className="text-cyan-600" />
                        <div>
                          <p className="font-medium text-gray-800">{offer.name}</p>
                          <p className="text-sm text-gray-500">{offer.desc}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{offer.target}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700 font-bold">
                        {offer.type === 'percent' ? `${offer.value}%` : `${offer.value} DT`}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        {offer.start?.toDate ? new Date(offer.start.toDate()).toLocaleDateString() : '—'} → {offer.end?.toDate ? new Date(offer.end.toDate()).toLocaleDateString() : '—'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`offer-tag ${offer.active ? 'active' : 'expired'}`}>
                        {offer.active ? 'Active' : 'Expirée'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(offer.id)}
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

export default Offers;