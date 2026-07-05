// src/pages/Offers.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { getOffers, deleteOffer } from '../api/endpoints';
import toast from 'react-hot-toast';
import {
  Plus,
  Trash2,
  Search,
  Tag,
  Calendar,
  TrendingUp,
  Clock3,
  BadgePercent,
  DollarSign,
  AlertTriangle
} from 'lucide-react';

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ status: 'all' });

  useEffect(() => {
    fetchOffers();
  }, [filters]);

  const formatDate = (value) => {
    if (!value) return '—';
    if (value instanceof Date) return value.toLocaleDateString('fr-FR');
    if (typeof value === 'object') {
      if (typeof value.toDate === 'function') return value.toDate().toLocaleDateString('fr-FR');
      if (typeof value._seconds === 'number') {
        const timestamp = value._seconds * 1000 + ((value._nanoseconds || 0) / 1000000);
        return new Date(timestamp).toLocaleDateString('fr-FR');
      }
    }
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? '—' : parsed.toLocaleDateString('fr-FR');
  };

  const getDaysRemaining = (offer) => {
    const endDate = offer?.end ? formatDate(offer.end) : null;
    if (!offer?.end || endDate === '—') return null;
    const end = new Date(offer.end instanceof Date ? offer.end : offer.end._seconds ? new Date(offer.end._seconds * 1000) : offer.end);
    if (Number.isNaN(end.getTime())) return null;
    const diff = end.getTime() - Date.now();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const getOfferLabel = (offer) => {
    if (offer.type === 'percent') return `${offer.value}%`;
    if (offer.type === 'fixed') return `${offer.value} DT`;
    return `${offer.value || 0}`;
  };

  const getOfferScore = (offer) => {
    let score = 0;
    if (offer.active) score += 35;
    const daysLeft = getDaysRemaining(offer);
    if (daysLeft === null) score += 0;
    else if (daysLeft > 30) score += 20;
    else if (daysLeft > 15) score += 12;
    else if (daysLeft > 7) score += 8;
    else if (daysLeft > 0) score += 4;

    const value = Number(offer.value || 0);
    if (offer.type === 'percent') {
      if (value >= 20) score += 20;
      else if (value >= 10) score += 12;
      else if (value >= 5) score += 6;
    } else if (offer.type === 'fixed') {
      if (value >= 50) score += 20;
      else if (value >= 20) score += 12;
      else if (value >= 10) score += 6;
    }

    if (offer.target === 'service') score += 4;
    if (offer.target === 'product') score += 2;
    return score;
  };

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

  const filteredOffers = useMemo(() =>
    offers.filter((offer) => {
      const searchValue = search.toLowerCase();
      const haystack = [offer.name, offer.desc, offer.description, offer.target, offer.type, getOfferLabel(offer)]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(searchValue);
    }),
    [offers, search]
  );

  const insights = useMemo(() => {
    const activeOffers = offers.filter((offer) => offer.active);
    const expiringSoon = offers.filter((offer) => {
      const daysLeft = getDaysRemaining(offer);
      return daysLeft !== null && daysLeft <= 30 && daysLeft >= 0;
    });
    const totalReduction = offers.reduce((sum, offer) => sum + Number(offer.value || 0), 0);
    const avgReduction = offers.length ? totalReduction / offers.length : 0;
    const bestPotential = [...offers].sort((a, b) => getOfferScore(b) - getOfferScore(a)).slice(0, 3);
    const highestImpact = [...offers].sort((a, b) => Number(b.value || 0) - Number(a.value || 0)).slice(0, 3);

    return {
      activeOffers: activeOffers.length,
      expiringSoon: expiringSoon.length,
      totalReduction,
      avgReduction,
      bestPotential,
      highestImpact
    };
  }, [offers]);

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="page-head-title">Offres & prix</div>
          <div className="page-head-sub">Analyse des promotions, de leur potentiel et des repères de rentabilité.</div>
        </div>
        <div className="page-head-actions">
          <button
            onClick={() => toast('Formulaire d\'ajout d\'offre', { icon: '✨' })}
            className="btn-primary"
          >
            <Plus size={18} /> Ajouter une offre
          </button>
        </div>
      </div>

      <div className="order-summary-grid">
        <div className="kpi-card order-summary-card">
          <div className="kpi-top">
            <div>
              <div className="kpi-label">Offres total</div>
              <div className="kpi-value">{offers.length}</div>
            </div>
            <div className="kpi-icon" style={{ background: 'rgba(14, 165, 201, 0.12)', color: 'var(--aqua)' }}>
              <Tag size={20} />
            </div>
          </div>
          <div className="order-summary-meta">Campagnes et promotions</div>
        </div>

        <div className="kpi-card order-summary-card">
          <div className="kpi-top">
            <div>
              <div className="kpi-label">Actives</div>
              <div className="kpi-value">{insights.activeOffers}</div>
            </div>
            <div className="kpi-icon" style={{ background: 'rgba(16, 185, 129, 0.12)', color: 'var(--mint)' }}>
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="order-summary-meta">Offres actuellement visibles</div>
        </div>

        <div className="kpi-card order-summary-card">
          <div className="kpi-top">
            <div>
              <div className="kpi-label">À expirer</div>
              <div className="kpi-value">{insights.expiringSoon}</div>
            </div>
            <div className="kpi-icon" style={{ background: 'rgba(245, 158, 11, 0.12)', color: '#D97706' }}>
              <Clock3 size={20} />
            </div>
          </div>
          <div className="order-summary-meta">Dans les 30 prochains jours</div>
        </div>

        <div className="kpi-card order-summary-card">
          <div className="kpi-top">
            <div>
              <div className="kpi-label">Réduction moyenne</div>
              <div className="kpi-value">{insights.avgReduction.toFixed(0)} DT</div>
            </div>
            <div className="kpi-icon" style={{ background: 'rgba(139, 92, 246, 0.12)', color: 'var(--violet)' }}>
              <BadgePercent size={20} />
            </div>
          </div>
          <div className="order-summary-meta">Repère rapide de prix</div>
        </div>
      </div>

      <div className="row-2-1">
        <div className="panel">
          <div className="panel-head">
            <div>
              <div className="panel-title">Offres à fort potentiel</div>
              <div className="panel-sub">Celles qui combinent visibilité, valeur et durée restante.</div>
            </div>
            <span className="badge b-actif">Score estimé</span>
          </div>

          <div className="offer-panel-stack">
            {insights.bestPotential.length === 0 ? (
              <div className="offer-panel-item">
                <div>
                  <div className="offer-panel-title">Aucune offre à analyser</div>
                  <div className="offer-panel-sub">Les offres apparaîtront ici dès qu’elles seront disponibles.</div>
                </div>
              </div>
            ) : (
              insights.bestPotential.map((offer, index) => {
                const daysLeft = getDaysRemaining(offer);
                return (
                  <div key={offer.id} className="offer-panel-item">
                    <div>
                      <div className="offer-panel-title">{offer.name}</div>
                      <div className="offer-panel-sub">{offer.desc || offer.description || 'Aucune description'}</div>
                    </div>
                    <div className="offer-pill">#{index + 1}</div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="panel">
          <div className="panel-head">
            <div>
              <div className="panel-title">Rentabilité</div>
              <div className="panel-sub">Repères rapides pour protéger la marge.</div>
            </div>
            <div className="kpi-icon" style={{ background: 'rgba(245, 158, 11, 0.12)', color: '#D97706', width: 36, height: 36 }}>
              <DollarSign size={16} />
            </div>
          </div>

          <div className="offer-insight-list">
            <div className="offer-insight-row">
              <span>Impact total théorique</span>
              <strong>{insights.totalReduction} DT</strong>
            </div>
            <div className="offer-insight-row">
              <span>Offres à fort impact</span>
              <strong>{insights.highestImpact.length}</strong>
            </div>
          </div>

          <div className="offer-insight-list">
            {insights.highestImpact.length === 0 ? (
              <div className="offer-panel-sub">Aucune offre disponible pour l’instant.</div>
            ) : (
              insights.highestImpact.map((offer) => (
                <div key={offer.id} className="offer-insight-row">
                  <span>{offer.name}</span>
                  <strong>{getOfferLabel(offer)}</strong>
                </div>
              ))
            )}
          </div>

          <ul className="offer-help-list">
            <li>Priorisez les offres actives avec plus de 15 jours de validité.</li>
            <li>Surveillez les remises élevées si elles risquent d’éroder la marge.</li>
            <li>Testez d’abord les offres sur les services à forte valeur ajoutée.</li>
          </ul>
        </div>
      </div>

      <div className="table-card">
        <div className="toolbar">
          <div className="search-box">
            <Search size={16} />
            <input
              type="text"
              placeholder="Rechercher une offre..."
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
            <option value="active">Actives</option>
            <option value="expired">Expirées</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Offre</th>
                <th>Cible</th>
                <th>Réduction</th>
                <th>Période</th>
                <th>Potentiel</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="table-loader">Chargement...</td></tr>
              ) : filteredOffers.length === 0 ? (
                <tr><td colSpan="6" className="table-empty">Aucune offre trouvée</td></tr>
              ) : (
                filteredOffers.map((offer) => {
                  const daysLeft = getDaysRemaining(offer);
                  return (
                    <tr key={offer.id}>
                      <td>
                        <div className="cell-prod">
                          <div className="cell-emoji">🏷️</div>
                          <div>
                            <div className="order-client-name">{offer.name}</div>
                            <div className="order-client-meta">{offer.desc || offer.description || 'Aucune description'}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge b-b2b">{offer.target === 'service' ? 'Service' : offer.target === 'product' ? 'Produit' : offer.target}</span>
                      </td>
                      <td>
                        <span className="badge b-livree">{getOfferLabel(offer)}</span>
                      </td>
                      <td>
                        <div className="order-client-name">{formatDate(offer.start)} → {formatDate(offer.end)}</div>
                      </td>
                      <td>
                        <div className="order-action-box">
                          <span className={`badge ${offer.active ? 'b-actif' : 'b-inactif'}`}>
                            {offer.active ? 'Active' : 'Expirée'}
                          </span>
                          <span className="order-client-meta">{daysLeft === null ? '—' : `${daysLeft} j`}</span>
                        </div>
                      </td>
                      <td>
                        <div className="order-action-box">
                          <button
                            onClick={() => handleDelete(offer.id)}
                            className="icon-btn"
                            aria-label={`Supprimer ${offer.name}`}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Offers;