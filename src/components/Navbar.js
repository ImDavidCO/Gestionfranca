import React from 'react'
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary ">
        <div className="container-fluid">
          <Link className="navbar-brand" to='/Facturasform  '>Gestion Franca</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link" to="/Facturasform">Nueva Factura</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/Facturas">Consultar Facturas</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/Facturasexcel">Cargar Excel</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }

export default Navbar