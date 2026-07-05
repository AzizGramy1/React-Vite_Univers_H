// src/components/common/Sidebar.jsx
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, Package, Wrench, ShoppingCart, Users, 
  Truck, FileText, FileCheck, Tag, CalendarDays, Settings,
  ChevronLeft, LogOut
} from 'lucide-react';

const Sidebar = ({ mobileOpen = false }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Tableau de bord' },
    { to: '/products', icon: Package, label: 'Produits' },
    { to: '/services', icon: Wrench, label: 'Services' },
    { to: '/orders', icon: ShoppingCart, label: 'Commandes' },
    { to: '/clients', icon: Users, label: 'Clients' },
    { to: '/suppliers', icon: Truck, label: 'Fournisseurs' },
    { to: '/requests', icon: FileText, label: 'Demandes' },
    { to: '/quotes', icon: FileCheck, label: 'Devis' },
    { to: '/offers', icon: Tag, label: 'Offres & Prix' },
    { to: '/planning', icon: CalendarDays, label: 'Planning' },
    { to: '/settings', icon: Settings, label: 'Paramètres' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
      <div className="side-top">
        <div className="side-logo-ring">
          <div className="side-logo-inner"></div>
        </div>
        <div className="side-brand">
          <div className="side-brand-name">Univers Hygiène</div>
          <div className="side-brand-tag">Espace Admin</div>
        </div>
      </div>

      <nav className="side-nav">
        <div className="side-section-label">Vue d'ensemble</div>
        {navItems.slice(0, 2).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => 
              `nav-item ${isActive ? 'active' : ''}`
            }
          >
            <item.icon />
            <span>{item.label}</span>
          </NavLink>
        ))}

        <div className="side-section-label">Gestion</div>
        {navItems.slice(2, 7).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => 
              `nav-item ${isActive ? 'active' : ''}`
            }
          >
            <item.icon />
            <span>{item.label}</span>
            {item.label === 'Commandes' && (
              <span className="nav-badge" id="ordersPendingBadge">3</span>
            )}
          </NavLink>
        ))}

        <div className="side-section-label">Commercial</div>
        {navItems.slice(7, 9).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => 
              `nav-item ${isActive ? 'active' : ''}`
            }
          >
            <item.icon />
            <span>{item.label}</span>
          </NavLink>
        ))}

        <div className="side-section-label">Offres & Prix</div>
        {navItems.slice(9, 10).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => 
              `nav-item ${isActive ? 'active' : ''}`
            }
          >
            <item.icon />
            <span>{item.label}</span>
            <span className="nav-badge">4</span>
          </NavLink>
        ))}

        <div className="side-section-label">Système</div>
        {navItems.slice(10, 11).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => 
              `nav-item ${isActive ? 'active' : ''}`
            }
          >
            <item.icon />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="side-seal">
        <div className="seal-ring">🛡️</div>
        <div className="seal-text">
          <div className="seal-title">Agrément MSP actif</div>
          <div className="seal-sub">Conforme — Tunisie</div>
        </div>
      </div>

      <div className="side-bottom">
        <button 
          className="side-collapse" 
          onClick={() => setCollapsed(!collapsed)}
        >
          <ChevronLeft size={16} />
          <span>Réduire le menu</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;