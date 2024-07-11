import React from 'react';
import logo from './assets/Logo_PDV-removebg-preview.png'; // Ajusta la ruta según la ubicación exacta

const Navbar = ({ proveedores, proveedorSeleccionado, setProveedorSeleccionado, onCrearCatalogo, onMostrarVistaPrevia, catalogoCount }) => {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <a className="navbar-brand" href="/">
                <img src={logo} alt="Logo de la empresa" width="auto" height="30" />
            </a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <a className="nav-link" href="/">Home</a>
                    </li>
                    <li className="nav-item">
                        <select
                            className="form-control"
                            value={proveedorSeleccionado}
                            onChange={(e) => setProveedorSeleccionado(e.target.value)}
                        >
                            <option value="">Filtrar por proveedor</option>
                            {proveedores.map((proveedor, index) => (
                                <option key={index} value={proveedor}>{proveedor}</option>
                            ))}
                        </select>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="/">Opción 2</a>
                    </li>
                    <li className="nav-item">

                        <button className="btn btn-primary" onClick={onCrearCatalogo}>
                            Crear mi propio catálogo ({catalogoCount})
                        </button>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
