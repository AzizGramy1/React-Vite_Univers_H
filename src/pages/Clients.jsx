// src/pages/Clients.jsx
import React, { useState, useEffect } from 'react';
import { getClients, deleteClient } from '../api/endpoints';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2, Search } from 'lucide-react';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ type: 'all', vip: 'all' });

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

  const filteredClients = clients.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Clients</h1>
        <button 
          onClick={() => toast.info('Formulaire d\'ajout de client')}
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
                placeholder="Rechercher un client..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              />
            </div>
          </div>
          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none"
          >
            <option value="all">Tous types</option>
            <option value="b2b">B2B</option>
            <option value="b2c">B2C</option>
          </select>
          <select
            value={filters.vip}
            onChange={(e) => setFilters({ ...filters, vip: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none"
          >
            <option value="all">Tous</option>
            <option value="true">VIP</option>
            <option value="false">Non VIP</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Téléphone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ville</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">VIP</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan="6" className="text-center py-4">Chargement...</td></tr>
              ) : filteredClients.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-4 text-gray-500">Aucun client</td></tr>
              ) : (
                filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-cyan-100 text-cyan-700 rounded-full flex items-center justify-center font-bold">
                          {client.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{client.name}</p>
                          <p className="text-sm text-gray-500">{client.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{client.phone}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        client.type === 'b2b' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {client.type?.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{client.city}</td>
                    <td className="px-6 py-4">
                      {client.vip ? (
                        <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700">
                          ⭐ VIP
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(client.id)}
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

export default Clients;