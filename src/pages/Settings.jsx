// src/pages/Settings.jsx
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Save, User, Building, Bell, Shield, Truck, DollarSign } from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'Général', icon: Building },
    { id: 'orders', label: 'Commandes', icon: Truck },
    { id: 'billing', label: 'Facturation', icon: DollarSign },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Sécurité', icon: Shield },
  ];

  const handleSave = () => {
    toast.success('✅ Paramètres enregistrés avec succès');
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="page-head-title">Paramètres</div>
          <div className="page-head-sub">Configuration générale, commandes et sécurité de l’outil</div>
        </div>
        <div className="page-head-actions">
          <button 
            onClick={handleSave}
            className="btn-ghost"
          >
            <Save size={18} /> Enregistrer
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="settings-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon size={16} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Panels */}
      <div className="settings-grid">
        {/* Panel Général */}
        {activeTab === 'general' && (
          <>
            <div className="settings-card full">
              <div className="sc-head">
                <div className="sc-icon">🏢</div>
                <div>
                  <div className="sc-title">Informations générales</div>
                  <div className="sc-sub">Identité de l'entreprise</div>
                </div>
              </div>
              <div className="f-row2">
                <div className="f-group">
                  <label className="f-label">Nom de l'entreprise</label>
                  <input className="f-input" defaultValue="Univers Hygiène" />
                </div>
                <div className="f-group">
                  <label className="f-label">Agrément MSP</label>
                  <input className="f-input" defaultValue="MSP-TN-2025-118" />
                </div>
              </div>
              <div className="f-row2">
                <div className="f-group">
                  <label className="f-label">Téléphone</label>
                  <input className="f-input" defaultValue="+216 71 000 000" />
                </div>
                <div className="f-group">
                  <label className="f-label">E-mail</label>
                  <input className="f-input" defaultValue="univershygiene@gmail.com" />
                </div>
              </div>
              <div className="f-group">
                <label className="f-label">Adresse</label>
                <textarea className="f-textarea" rows="2" defaultValue="Tunis, Tunisie — Zone Grand Tunis" />
              </div>
            </div>
          </>
        )}

        {/* Panel Commandes */}
        {activeTab === 'orders' && (
          <>
            <div className="settings-card">
              <div className="sc-head">
                <div className="sc-icon">🚚</div>
                <div>
                  <div className="sc-title">Livraison</div>
                  <div className="sc-sub">Frais et conditions</div>
                </div>
              </div>
              <div className="f-row2">
                <div className="f-group">
                  <label className="f-label">Frais de livraison (DT)</label>
                  <input className="f-input" type="number" defaultValue="7" />
                </div>
                <div className="f-group">
                  <label className="f-label">Seuil livraison offerte (DT)</label>
                  <input className="f-input" type="number" defaultValue="100" />
                </div>
              </div>
              <div className="f-group">
                <label className="f-label">Délai de livraison</label>
                <input className="f-input" defaultValue="24 à 48h" />
              </div>
            </div>
            <div className="settings-card">
              <div className="sc-head">
                <div className="sc-icon">📋</div>
                <div>
                  <div className="sc-title">Politique</div>
                  <div className="sc-sub">Règles et options</div>
                </div>
              </div>
              <div className="toggle-row">
                <div>
                  <div className="tr-title">Retours autorisés</div>
                  <div className="tr-sub">Les clients peuvent retourner leurs produits</div>
                </div>
                <label className="switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider-tog"></span>
                </label>
              </div>
              <div className="toggle-row">
                <div>
                  <div className="tr-title">Badge agrément</div>
                  <div className="tr-sub">Visible sur la boutique publique</div>
                </div>
                <label className="switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider-tog"></span>
                </label>
              </div>
            </div>
          </>
        )}

        {/* Panel Facturation */}
        {activeTab === 'billing' && (
          <>
            <div className="settings-card">
              <div className="sc-head">
                <div className="sc-icon">📄</div>
                <div>
                  <div className="sc-title">TVA</div>
                  <div className="sc-sub">Paramètres fiscaux</div>
                </div>
              </div>
              <div className="f-row2">
                <div className="f-group">
                  <label className="f-label">Taux de TVA (%)</label>
                  <input className="f-input" type="number" defaultValue="19" />
                </div>
                <div className="f-group">
                  <label className="f-label">N° fiscal</label>
                  <input className="f-input" defaultValue="12345678/A/B/000" />
                </div>
              </div>
              <div className="toggle-row">
                <div>
                  <div className="tr-title">Facture automatique</div>
                  <div className="tr-sub">Générer une facture pour chaque commande</div>
                </div>
                <label className="switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider-tog"></span>
                </label>
              </div>
            </div>
            <div className="settings-card">
              <div className="sc-head">
                <div className="sc-icon">💳</div>
                <div>
                  <div className="sc-title">Paiement</div>
                  <div className="sc-sub">Modes de paiement acceptés</div>
                </div>
              </div>
              <div className="toggle-row">
                <div>
                  <div className="tr-title">Paiement à la livraison</div>
                  <div className="tr-sub">Espèces ou carte sur place</div>
                </div>
                <label className="switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider-tog"></span>
                </label>
              </div>
              <div className="toggle-row">
                <div>
                  <div className="tr-title">Carte bancaire en ligne</div>
                  <div className="tr-sub">Via une passerelle sécurisée</div>
                </div>
                <label className="switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider-tog"></span>
                </label>
              </div>
            </div>
          </>
        )}

        {/* Panel Notifications */}
        {activeTab === 'notifications' && (
          <div className="settings-card full">
            <div className="sc-head">
              <div className="sc-icon">🔔</div>
              <div>
                <div className="sc-title">Alertes et notifications</div>
                <div className="sc-sub">Configurez vos préférences</div>
              </div>
            </div>
            <div className="toggle-row">
              <div>
                <div className="tr-title">SMS de confirmation client</div>
                <div className="tr-sub">Envoyé à chaque nouvelle commande</div>
              </div>
              <label className="switch">
                <input type="checkbox" defaultChecked />
                <span className="slider-tog"></span>
              </label>
            </div>
            <div className="toggle-row">
              <div>
                <div className="tr-title">E-mail de confirmation client</div>
                <div className="tr-sub">Récapitulatif de la commande</div>
              </div>
              <label className="switch">
                <input type="checkbox" defaultChecked />
                <span className="slider-tog"></span>
              </label>
            </div>
            <div className="toggle-row">
              <div>
                <div className="tr-title">Alerte stock faible</div>
                <div className="tr-sub">Notification quand le stock passe sous 10 unités</div>
              </div>
              <label className="switch">
                <input type="checkbox" defaultChecked />
                <span className="slider-tog"></span>
              </label>
            </div>
            <div className="toggle-row">
              <div>
                <div className="tr-title">Résumé quotidien par e-mail</div>
                <div className="tr-sub">Récapitulatif des ventes chaque soir</div>
              </div>
              <label className="switch">
                <input type="checkbox" />
                <span className="slider-tog"></span>
              </label>
            </div>
          </div>
        )}

        {/* Panel Sécurité */}
        {activeTab === 'security' && (
          <>
            <div className="settings-card">
              <div className="sc-head">
                <div className="sc-icon">🔐</div>
                <div>
                  <div className="sc-title">Compte administrateur</div>
                  <div className="sc-sub">Identifiants et accès</div>
                </div>
              </div>
              <div className="f-group">
                <label className="f-label">Nom de l'administrateur</label>
                <input className="f-input" defaultValue="Sami Belhadj" />
              </div>
              <div className="f-group">
                <label className="f-label">E-mail de connexion</label>
                <input className="f-input" defaultValue="admin@univershygiene.tn" />
              </div>
              <div className="f-group">
                <label className="f-label">Nouveau mot de passe</label>
                <input className="f-input" type="password" placeholder="••••••••" />
              </div>
            </div>
            <div className="settings-card">
              <div className="sc-head">
                <div className="sc-icon">🛡️</div>
                <div>
                  <div className="sc-title">Sécurité avancée</div>
                  <div className="sc-sub">Protection renforcée</div>
                </div>
              </div>
              <div className="toggle-row">
                <div>
                  <div className="tr-title">Authentification à deux facteurs (2FA)</div>
                  <div className="tr-sub">Code envoyé par SMS ou application</div>
                </div>
                <label className="switch">
                  <input type="checkbox" />
                  <span className="slider-tog"></span>
                </label>
              </div>
              <div className="toggle-row">
                <div>
                  <div className="tr-title">Déconnexion automatique</div>
                  <div className="tr-sub">Après 30 minutes d'inactivité</div>
                </div>
                <label className="switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider-tog"></span>
                </label>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Settings;