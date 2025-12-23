import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaBars, FaTimes } from 'react-icons/fa';
import './Navbar.css';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path: string): boolean => {
    return location.pathname === path;
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const menuItems = [
    { path: '/pessoas', label: 'Pessoas' },
    { path: '/categorias', label: 'Categorias' },
    { path: '/transacoes', label: 'Transações' },
    { path: '/totais/pessoas', label: 'Totais por Pessoa' },
    { path: '/totais/categorias', label: 'Totais por Categoria' },
  ];

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <button 
            className="menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
          <h1 className="navbar-brand">
            <FaHome className="navbar-brand-icon" />
            <span className="navbar-brand-text">Controle de Gastos Residenciais</span>
          </h1>
        </div>
      </nav>
      <nav className="navbar-tabs">
        <div className="navbar-tabs-container">
          <ul className="navbar-menu">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link 
                  to={item.path} 
                  className={isActive(item.path) ? 'active' : ''}
                  onClick={closeMenu}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      
      {/* Mobile Sidebar */}
      <div className={`mobile-sidebar ${menuOpen ? 'open' : ''}`}>
        <div className="mobile-sidebar-header">
          <h2>Menu</h2>
          <button 
            className="mobile-sidebar-close"
            onClick={closeMenu}
            aria-label="Close menu"
          >
            <FaTimes />
          </button>
        </div>
        <ul className="mobile-sidebar-menu">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link 
                to={item.path} 
                className={isActive(item.path) ? 'active' : ''}
                onClick={closeMenu}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      {menuOpen && (
        <div className="mobile-sidebar-overlay" onClick={closeMenu} />
      )}
    </>
  );
};
