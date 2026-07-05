// src/components/common/Topbar.jsx
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Bell, Menu, Search } from 'lucide-react';

const Topbar = ({ toggleSidebar }) => {
  const { user } = useAuth();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);

  const pageMeta = {
    '/dashboard': { title: 'Tableau de bord', crumb: 'Admin / Vue d\'ensemble' },
    '/products': { title: 'Produits', crumb: 'Admin / Catalogue' },
    '/services': { title: 'Services', crumb: 'Admin / Services' },
    '/orders': { title: 'Commandes', crumb: 'Admin / Commandes' },
    '/clients': { title: 'Clients', crumb: 'Admin / Clients' },
    '/suppliers': { title: 'Fournisseurs', crumb: 'Admin / Fournisseurs' },
    '/requests': { title: 'Demandes', crumb: 'Admin / Demandes' },
    '/quotes': { title: 'Devis', crumb: 'Admin / Devis' },
    '/offers': { title: 'Offres & Prix', crumb: 'Admin / Commercial' },
    '/planning': { title: 'Planning', crumb: 'Admin / Planning' },
    '/settings': { title: 'Paramètres', crumb: 'Admin / Système' },
  };

  const currentPage = pageMeta[location.pathname] || pageMeta['/dashboard'];

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="mobile-burger" onClick={toggleSidebar}>
          <Menu size={19} />
        </button>
        <div className="topbar-title-block">
          <div className="topbar-title">{currentPage.title}</div>
          <div className="topbar-crumb">
            {currentPage.crumb}
          </div>
        </div>
      </div>

      <div className="search-box">
        <Search size={15} />
        <input type="text" placeholder="Rechercher commande, produit, client…" />
      </div>

      <div className="topbar-right">
        <div style={{ position: 'relative' }}>
          <button 
            className="tb-icon-btn"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={18} />
            <span className="tb-dot"></span>
          </button>
        </div>

        <div className="tb-profile">
          <div className="tb-avatar">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div>
            <div className="tb-profile-name">{user?.name || 'Admin'}</div>
            <div className="tb-profile-role">Administrateur</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;