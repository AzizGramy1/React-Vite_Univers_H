// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { getProducts, getOrders, getClients, getEvents, getRequests, getQuotes } from '../api/endpoints';
import KpiCard from '../components/dashboard/KpiCard';
import { DollarSign, ShoppingCart, Users, Package, FileText, Calendar } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    clients: 0,
    products: 0,
    lowStock: 0,
    pendingRequests: 0,
    pendingQuotes: 0,
    todayEvents: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [productsRes, ordersRes, clientsRes, requestsRes, quotesRes, eventsRes] = await Promise.all([
        getProducts(),
        getOrders(),
        getClients(),
        getRequests(),
        getQuotes(),
        getEvents()
      ]);

      const products = productsRes.data.data || [];
      const orders = ordersRes.data.data || [];
      const clients = clientsRes.data.data || [];
      const requests = requestsRes.data.data || [];
      const quotes = quotesRes.data.data || [];
      const events = eventsRes.data.data || [];

      const revenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
      const lowStock = products.filter(p => p.stock > 0 && p.stock < p.threshold).length;
      const pendingRequests = requests.filter(r => r.status === 'nouveau' || r.status === 'en_cours').length;
      const pendingQuotes = quotes.filter(q => q.status === 'brouillon' || q.status === 'envoye').length;
      
      const today = new Date().toDateString();
      const todayEvents = events.filter(e => {
        const eventDate = e.date?.toDate ? e.date.toDate() : new Date(e.date);
        return eventDate.toDateString() === today;
      }).length;

      setStats({
        revenue,
        orders: orders.length,
        clients: clients.length,
        products: products.length,
        lowStock,
        pendingRequests,
        pendingQuotes,
        todayEvents
      });
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Chargement...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="page-head-title">Tableau de bord</div>
          <div className="page-head-sub">Bonjour Sami — voici l'activité d'Univers Hygiène aujourd'hui.</div>
        </div>
        <div className="page-head-actions">
          <div className="range-toggle">
            <button className="range-btn">7j</button>
            <button className="range-btn active">30j</button>
            <button className="range-btn">90j</button>
          </div>
          <button className="btn-ghost">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Exporter
          </button>
        </div>
      </div>

      {/* Alert Banner */}
      <div className="alert-banner">
        <div className="alert-icon">⚠️</div>
        <div className="alert-text">
          <b>{stats.lowStock} produits</b> en stock faible et <b>{stats.products > 0 ? 1 : 0}</b> en rupture.
        </div>
        <div className="alert-link" onClick={() => console.log('Voir les produits')}>
          Voir les produits →
        </div>
      </div>

      {/* KPI Grid */}
      <div className="kpi-grid">
        <KpiCard
          icon="💰"
          iconBg="linear-gradient(135deg,#0EA5C9,#10B981)"
          iconColor="#fff"
          label="Chiffre d'affaires (30j)"
          value={stats.revenue.toFixed(3).replace('.', ',') + ' DT'}
          trend="12,4%"
          up={true}
        />
        <KpiCard
          icon="🧾"
          iconBg="#EEF8FC"
          iconColor="#0EA5C9"
          label="Commandes (30j)"
          value={stats.orders}
          trend="8%"
          up={true}
        />
        <KpiCard
          icon="👥"
          iconBg="#ECFDF5"
          iconColor="#10B981"
          label="Nouveaux clients (30j)"
          value={stats.clients}
          trend="5 ce mois"
          up={true}
        />
        <KpiCard
          icon="📦"
          iconBg="#FFFBEB"
          iconColor="#B45309"
          label="Alertes de stock"
          value={stats.lowStock}
          trend="1 en rupture"
          up={false}
        />
      </div>

      {/* Row 2-1 */}
      <div className="row-2-1">
        <div className="panel">
          <div className="panel-head">
            <div>
              <div className="panel-title">Chiffre d'affaires</div>
              <div className="panel-sub">Évolution sur les 7 derniers jours</div>
            </div>
            <div className="kpi-trend up">▲ 12,4%</div>
          </div>
          <div className="chart-wrap">
            <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', gap: '8px', padding: '10px 0' }}>
              {[65, 78, 90, 85, 95, 110, 105].map((val, i) => (
                <div key={i} style={{ 
                  flex: 1, 
                  height: `${val * 1.6}px`, 
                  background: 'linear-gradient(180deg, #0EA5C9, #10B981)',
                  borderRadius: '8px 8px 4px 4px',
                  transition: 'height 1s ease'
                }} />
              ))}
            </div>
            <div className="chart-axis">
              {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(d => (
                <span key={d}>{d}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-head">
            <div>
              <div className="panel-title">Statut des commandes</div>
              <div className="panel-sub">Répartition actuelle</div>
            </div>
          </div>
          <div className="donut-wrap">
            <div style={{ position: 'relative', width: '160px', height: '160px' }}>
              <svg viewBox="0 0 160 160" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                <circle cx="80" cy="80" r="60" fill="none" stroke="#F1F5F9" strokeWidth="18"/>
                <circle cx="80" cy="80" r="60" fill="none" stroke="#F59E0B" strokeWidth="18" strokeDasharray="25 351" strokeDashoffset="0"/>
                <circle cx="80" cy="80" r="60" fill="none" stroke="#0EA5C9" strokeWidth="18" strokeDasharray="50 351" strokeDashoffset="-25"/>
                <circle cx="80" cy="80" r="60" fill="none" stroke="#8B5CF6" strokeWidth="18" strokeDasharray="75 351" strokeDashoffset="-75"/>
                <circle cx="80" cy="80" r="60" fill="none" stroke="#10B981" strokeWidth="18" strokeDasharray="150 351" strokeDashoffset="-150"/>
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div className="donut-center-val">{stats.orders}</div>
                <div className="donut-center-sub">commandes</div>
              </div>
            </div>
            <div className="donut-legend">
              <div className="dl-row"><span className="dl-dot" style={{ background: '#F59E0B' }}></span><span className="dl-label">En attente</span><span className="dl-val">3</span></div>
              <div className="dl-row"><span className="dl-dot" style={{ background: '#0EA5C9' }}></span><span className="dl-label">Confirmée</span><span className="dl-val">5</span></div>
              <div className="dl-row"><span className="dl-dot" style={{ background: '#8B5CF6' }}></span><span className="dl-label">Expédiée</span><span className="dl-val">8</span></div>
              <div className="dl-row"><span className="dl-dot" style={{ background: '#10B981' }}></span><span className="dl-label">Livrée</span><span className="dl-val">15</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;