// src/components/dashboard/KpiCard.jsx
import React from 'react';

const KpiCard = ({ icon, iconBg, iconColor, label, value, trend, up }) => {
  return (
    <div className="kpi-card">
      <div className="kpi-top">
        <div className="kpi-icon" style={{ background: iconBg, color: iconColor }}>
          {icon}
        </div>
        <div className={`kpi-trend ${up ? 'up' : 'down'}`}>
          {up ? '▲' : '▼'} {trend}
        </div>
      </div>
      <div className="kpi-value">{value}</div>
      <div className="kpi-label">{label}</div>
    </div>
  );
};

export default KpiCard;