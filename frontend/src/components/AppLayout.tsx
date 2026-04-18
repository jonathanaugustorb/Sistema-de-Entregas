import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Users, MapPin, Truck, Car, Layers, Menu, X } from 'lucide-react';

const navItems = [
  { to: '/cadastros/clientes',       label: 'Clientes',           icon: <Users size={18} /> },
  { to: '/cadastros/localidades',    label: 'Localidades',        icon: <MapPin size={18} /> },
  { to: '/cadastros/motoristas',     label: 'Motoristas',         icon: <Truck size={18} /> },
  { to: '/cadastros/veiculos',       label: 'Veículos',           icon: <Car size={18} /> },
  { to: '/cadastros/tipos-material', label: 'Tipos de Material',  icon: <Layers size={18} /> },
];

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <Truck size={22} color="#D35400" />
            <span>Controle Entregas</span>
          </div>
          <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <p className="sidebar-section-label">Cadastros</p>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
              }
              onClick={() => setSidebarOpen(false)}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <div className="main-wrapper">
        <header className="topbar">
          <button className="topbar-menu" onClick={() => setSidebarOpen(true)}>
            <Menu size={22} />
          </button>
          <span className="topbar-title">Sistema de Controle de Entregas</span>
        </header>
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
