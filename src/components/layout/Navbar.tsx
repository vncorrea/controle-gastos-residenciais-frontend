import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import './Navbar.css';

export const Navbar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string): boolean => {
    return location.pathname === path;
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <h1 className="navbar-brand">
            <FaHome className="navbar-brand-icon" />
            Controle de Gastos Residenciais
          </h1>
        </div>
      </nav>
      <nav className="navbar-tabs">
        <div className="navbar-tabs-container">
          <ul className="navbar-menu">
            <li>
              <Link to="/pessoas" className={isActive('/pessoas') ? 'active' : ''}>
                Pessoas
              </Link>
            </li>
            <li>
              <Link to="/categorias" className={isActive('/categorias') ? 'active' : ''}>
                Categorias
              </Link>
            </li>
            <li>
              <Link to="/transacoes" className={isActive('/transacoes') ? 'active' : ''}>
                Transações
              </Link>
            </li>
            <li>
              <Link to="/totais/pessoas" className={isActive('/totais/pessoas') ? 'active' : ''}>
                Totais por Pessoa
              </Link>
            </li>
            <li>
              <Link to="/totais/categorias" className={isActive('/totais/categorias') ? 'active' : ''}>
                Totais por Categoria
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};
