// src/pages/Services.jsx
import React, { useState, useEffect } from 'react';
import { getServices, deleteService } from '../api/endpoints';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2, Search } from 'lucide-react';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ type: 'all', active: 'all' });

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

  const filteredServices = services.filter(s =>
    s.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="page-head-title">Services</div>
          <div className="page-head-sub">Gestion des offres techniques et des prestations</div>
        </div>
        <div className="page-head-actions">
          <button 
            onClick={() => toast.info('Formulaire d\'ajout de service')}
            className="btn-ghost"
          >
            <Plus size={18} /> Ajouter
          </button>
        </div>
      </div>

      <div className="table-card">
        <div className="toolbar">
          <div className="search-box">
            <Search size={16} />
            <input
              type="text"
              placeholder="Rechercher un service..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
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

        <div className="overflow-x-auto">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tarif</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durée</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan="6" className="table-loader">Chargement...</td></tr>
              ) : filteredServices.length === 0 ? (
                <tr><td colSpan="6" className="table-empty">Aucun service</td></tr>
              ) : (
                filteredServices.map((service) => (
                  <tr key={service.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{service.emoji || '🧹'}</span>
                        <div>
                          <p className="font-medium text-gray-800">{service.name}</p>
                          {service.badge && (
                            <span className="text-xs px-2 py-1 bg-cyan-100 text-cyan-700 rounded-full">
                              {service.badge}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        service.type === 'b2b' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {service.type?.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium">{service.price} DT</td>
                    <td className="px-6 py-4 text-gray-600">{service.duration}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        service.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {service.active ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(service.id)}
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
    </div>
  );
};

export default Services;