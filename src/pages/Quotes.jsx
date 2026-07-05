// src/pages/Quotes.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { getQuotes, deleteQuote, getClients } from '../api/endpoints';
import toast from 'react-hot-toast';
import { Plus, Trash2, Search, FileCheck, Eye, RefreshCw, X } from 'lucide-react';

const Quotes = () => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ status: 'all' });
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [clients, setClients] = useState([]);

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    fetchQuotes();
  }, [filters]);

  const formatDate = (value) => {
    if (!value) return '—';
    if (value instanceof Date) {
      return value.toLocaleDateString('fr-FR');
    }
    if (typeof value === 'object') {
      if (typeof value.toDate === 'function') {
        return value.toDate().toLocaleDateString('fr-FR');
      }
      if (typeof value._seconds === 'number') {
        const timestamp = value._seconds * 1000 + ((value._nanoseconds || 0) / 1000000);
        return new Date(timestamp).toLocaleDateString('fr-FR');
      }
    }
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return '—';
    return parsed.toLocaleDateString('fr-FR');
  };

  const extractQuotes = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.quotes)) return payload.quotes;
    if (Array.isArray(payload?.items)) return payload.items;
    if (payload?.data && typeof payload.data === 'object' && Array.isArray(payload.data.quotes)) return payload.data.quotes;
    return [];
  };

  const resolveValue = (object, paths) => {
    for (const path of paths) {
      const value = path.split('.').reduce((current, key) => current?.[key], object);
      if (value !== undefined && value !== null && value !== '') return value;
    }
    return null;
  };

  const getQuoteClient = (quote) => {
    if (quote.client) return quote.client;
    if (quote.clientId && clientMap.has(quote.clientId)) return clientMap.get(quote.clientId);
    return null;
  };

  const getQuoteClientName = (quote) => {
    const client = getQuoteClient(quote);
    const name = resolveValue({ ...quote, client }, ['clientName', 'client.name', 'client.companyName', 'client.contactName', 'customerName', 'name', 'companyName', 'contactName']);
    return name || '—';
  };

  const getQuoteClientEmail = (quote) => {
    const client = getQuoteClient(quote);
    const email = resolveValue({ ...quote, client }, ['clientEmail', 'client.email', 'client.contactEmail', 'customer.email', 'email']);
    return email || '—';
  };

  const getQuoteDate = (quote) => resolveValue(quote, ['date', 'createdAt', 'created_at', 'created', 'issuedAt', 'issued_at', 'quoteDate', 'generatedAt', 'generated_at']);

  const getQuoteValidityDate = (quote) => resolveValue(quote, ['validUntil', 'validityDate', 'validity', 'valid_until', 'validity_date', 'expiresAt', 'expirationDate', 'expiration_date', 'expiryDate', 'expiry_date']);

  const fetchClients = async () => {
    try {
      const response = await getClients();
      const payload = response?.data?.data ?? response?.data ?? [];
      setClients(Array.isArray(payload) ? payload : []);
    } catch (error) {
      console.error('Erreur de chargement des clients', error);
    }
  };

  const fetchQuotes = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.status !== 'all') params.status = filters.status;

      const response = await getQuotes(params);
      setQuotes(extractQuotes(response?.data));
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

  const clientMap = useMemo(() => new Map(clients.map((client) => [client.id, client])), [clients]);

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

  const filteredQuotes = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    if (!searchValue) return quotes;

    return quotes.filter((quote) => {
      const haystack = [
        quote.num,
        quote.reference,
        quote.number,
        getQuoteClientName(quote),
        getQuoteClientEmail(quote),
        quote.client?.name,
        quote.client?.email,
        quote.id
      ]
        .filter(Boolean)
        .map((value) => String(value).toLowerCase())
        .join(' ');

      return haystack.includes(searchValue);
    });
  }, [quotes, search]);

  const openDetailsModal = (quote) => {
    setSelectedQuote(quote);
  };

  const closeDetailsModal = () => {
    setSelectedQuote(null);
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="page-head-title">Devis</div>
          <div className="page-head-sub">Consultation des devis clients et détails du document</div>
        </div>
        <div className="page-head-actions">
          <button onClick={fetchQuotes} className="btn-ghost">
            <RefreshCw size={18} /> Rafraîchir
          </button>
          <button onClick={() => toast('Formulaire d\'ajout de devis', { icon: '➕' })} className="btn-primary">
            <Plus size={18} /> Ajouter
          </button>
        </div>
      </div>

      <div className="order-summary-grid">
        <div className="kpi-card order-summary-card">
          <div className="kpi-top">
            <div>
              <div className="kpi-label">Devis</div>
              <div className="kpi-value">{quotes.length}</div>
            </div>
            <div className="kpi-icon" style={{ background: 'rgba(14, 165, 201, 0.12)', color: 'var(--aqua)' }}>
              <FileCheck size={20} />
            </div>
          </div>
          <div className="order-summary-meta">Documents générés</div>
        </div>
      </div>

      <div className="table-card">
        <div className="toolbar">
          <div className="search-box">
            <Search size={16} />
            <input
              type="text"
              placeholder="Rechercher un devis ou un client..."
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
            <option value="brouillon">Brouillon</option>
            <option value="envoye">Envoyé</option>
            <option value="accepte">Accepté</option>
            <option value="refuse">Refusé</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>N° Devis</th>
                <th>Client</th>
                <th>Date</th>
                <th>Total</th>
                <th>Validité</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" className="table-loader">Chargement...</td></tr>
              ) : filteredQuotes.length === 0 ? (
                <tr><td colSpan="7" className="table-empty">Aucun devis trouvé</td></tr>
              ) : (
                filteredQuotes.map((quote) => (
                  <tr key={quote.id}>
                    <td>
                      <div className="order-client-name">D-{String(quote.id).slice(0, 4)}</div>
                    </td>
                    <td>
                      <div className="cell-prod">
                        <div className="cell-emoji">📄</div>
                        <div>
                          <div className="order-client-name">{getQuoteClientName(quote)}</div>
                          <div className="order-client-meta">{getQuoteClientEmail(quote)}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="order-client-name">{formatDate(getQuoteDate(quote))}</div>
                    </td>
                    <td>
                      <div className="order-amount">{quote.total || 0} DT</div>
                    </td>
                    <td>
                      <div className="order-client-name">{formatDate(getQuoteValidityDate(quote))}</div>
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadge(quote.status)}`}>
                        {getStatusLabel(quote.status)}
                      </span>
                    </td>
                    <td>
                      <div className="order-action-box">
                        <button
                          className="icon-btn"
                          aria-label={`Voir les détails ${quote.id}`}
                          onClick={() => openDetailsModal(quote)}
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(quote.id)}
                          className="icon-btn"
                          aria-label={`Supprimer ${quote.id}`}
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

      <div className={`modal-overlay ${selectedQuote ? 'open' : ''}`}>
        <div className="modal">
          <div className="modal-hd">
            <div>
              <div className="modal-hd-title">Détails du devis</div>
              <div className="modal-hd-sub">Informations complètes du document</div>
            </div>
            <button type="button" className="modal-x" onClick={closeDetailsModal}>
              <X size={16} />
            </button>
          </div>

          {selectedQuote && (
            <div className="modal-body">
              <div className="f-group">
                <label className="f-label">Client</label>
                <div className="f-input">{getQuoteClientName(selectedQuote)}</div>
              </div>

              <div className="f-row2">
                <div className="f-group">
                  <label className="f-label">Email</label>
                  <div className="f-input">{getQuoteClientEmail(selectedQuote)}</div>
                </div>
                <div className="f-group">
                  <label className="f-label">Date</label>
                  <div className="f-input">{formatDate(getQuoteDate(selectedQuote))}</div>
                </div>
              </div>

              <div className="f-row2">
                <div className="f-group">
                  <label className="f-label">Total</label>
                  <div className="f-input">{selectedQuote.total || 0} DT</div>
                </div>
                <div className="f-group">
                  <label className="f-label">Validité</label>
                  <div className="f-input">{formatDate(getQuoteValidityDate(selectedQuote))}</div>
                </div>
              </div>

              <div className="f-group">
                <label className="f-label">Statut</label>
                <div className="f-input">{getStatusLabel(selectedQuote.status)}</div>
              </div>

              <div className="f-group">
                <label className="f-label">Référence</label>
                <div className="f-input">D-{String(selectedQuote.id).slice(0, 4)}</div>
              </div>
            </div>
          )}

          <div className="modal-ft">
            <button type="button" className="btn-ghost" onClick={closeDetailsModal}>
              <X size={16} /> Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quotes;