import React, { useState } from 'react';
import logo from './assets/Logo_PDV-removebg-preview.png'; // Ajusta la ruta según la ubicación exacta
import './Navbar.css'; // Asegúrate de importar el archivo CSS

const Navbar = ({ proveedores, proveedorSeleccionado, setProveedorSeleccionado, onCrearCatalogo, onMostrarVistaPrevia, catalogoCount, onBuscarProducto, descargarImagen }) => {
    const [codigoProducto, setCodigoProducto] = useState('');

    const handleInputChange = (e) => {
        const inputValue = e.target.value.replace(/\D/g, ''); // Reemplaza cualquier caracter que no sea dígito
        setCodigoProducto(inputValue); // Actualiza el estado del código de producto
    };

    const handleBuscarProducto = () => {
        onBuscarProducto(codigoProducto); // Llama a la función para buscar producto con el código ingresado
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
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
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Buscar por código"
                                value={codigoProducto}
                                onChange={handleInputChange}
                                maxLength={10} // Limita la longitud del input si es necesario
                            />
                            <button
                                className="boton-de-buscar"
                                type="button"
                                onClick={handleBuscarProducto}
                            >
                                Buscar
                            </button>
                        </div>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
