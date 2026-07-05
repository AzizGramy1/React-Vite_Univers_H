// src/pages/Planning.jsx
import React, { useState, useEffect } from 'react';
import { getEvents, deleteEvent } from '../api/endpoints';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2, Calendar, CalendarDays, Clock } from 'lucide-react';

const Planning = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: 'all' });

  useEffect(() => {
    fetchEvents();
  }, [filters]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.status !== 'all') params.status = filters.status;
      
      const response = await getEvents(params);
      setEvents(response.data.data || []);
    } catch (error) {
      toast.error('Erreur de chargement des événements');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cet événement ?')) return;
    try {
      await deleteEvent(id);
      toast.success('Événement supprimé');
      fetchEvents();
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      planifie: 'bg-blue-100 text-blue-700',
      en_cours: 'bg-yellow-100 text-yellow-700',
      termine: 'bg-green-100 text-green-700',
      annule: 'bg-red-100 text-red-700'
    };
    return badges[status] || 'bg-gray-100 text-gray-700';
  };

  const getStatusLabel = (status) => {
    const labels = {
      planifie: 'Planifié',
      en_cours: 'En cours',
      termine: 'Terminé',
      annule: 'Annulé'
    };
    return labels[status] || status;
  };

  const today = new Date().toDateString();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Planning</h1>
        <button 
          onClick={() => toast('Formulaire d\'ajout d\'événement', { icon: '🗓️' })}
          className="bg-cyan-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-cyan-700 transition-colors"
        >
          <Plus size={20} /> Ajouter
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none"
          >
            <option value="all">Tous statuts</option>
            <option value="planifie">Planifié</option>
            <option value="en_cours">En cours</option>
            <option value="termine">Terminé</option>
            <option value="annule">Annulé</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-3 text-center py-8 text-gray-500">Chargement...</div>
        ) : events.length === 0 ? (
          <div className="col-span-3 text-center py-8 text-gray-500">Aucun événement</div>
        ) : (
          events.map((event) => {
            const eventDate = event.date?.toDate ? new Date(event.date.toDate()) : new Date(event.date);
            const isToday = eventDate.toDateString() === today;
            
            return (
              <div 
                key={event.id} 
                className={`bg-white rounded-xl shadow-sm p-6 border ${isToday ? 'border-cyan-400' : 'border-gray-100'}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <CalendarDays size={18} className="text-cyan-600" />
                    <h3 className="font-bold text-gray-800">{event.title}</h3>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(event.status)}`}>
                    {getStatusLabel(event.status)}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>{eventDate.toLocaleDateString('fr-FR')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} />
                    <span>{eventDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  {event.clientName && (
                    <div className="mt-2 pt-2 border-t border-gray-100">
                      <p className="text-gray-500">Client: <span className="text-gray-700">{event.clientName}</span></p>
                    </div>
                  )}
                  {event.notes && (
                    <p className="text-gray-500 text-xs mt-1">{event.notes}</p>
                  )}
                </div>
                
                <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-gray-100">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(event.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Planning;