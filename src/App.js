// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Catalogo from './Catalogo';
import CatalogoPersonalizado from './CatalogoPersonalizado';
import PedidoPresupuesto from './PedidoPresupuesto';
import Clientes from './Clientes';
import LandingPage from './LandingPage';
import './App.css';

const App = () => {
    const [catalogoPersonal, setCatalogoPersonal] = useState([]);
    const [pedido, setPedido] = useState([]);
    const [mensaje, setMensaje] = useState(''); 

    const agregarProductoACatalogo = (producto) => {
        if (!catalogoPersonal.some((p) => p.Codigo === producto.Codigo)) {
            setCatalogoPersonal([...catalogoPersonal, producto]);
        }
    };

    const eliminarProducto = (codigo) => {
        const nuevoCatalogo = catalogoPersonal.filter((producto) => producto.Codigo !== codigo);
        setCatalogoPersonal(nuevoCatalogo);
    };

    const agregarProductoAPedido = (producto) => {
        if (!pedido.some((p) => p.Codigo === producto.Codigo)) {
            setPedido([...pedido, { ...producto, cantidad: 1 }]);
        }
    };

    const actualizarCantidadProducto = (producto, cantidad) => {
        const nuevoPedido = pedido.map((p) =>
            p.Codigo === producto.Codigo ? { ...p, cantidad } : p
        );
        setPedido(nuevoPedido);
    };

    const enviarPedido = () => {
        console.log('Pedido enviado al vendedor:', pedido);
        console.log('Mensaje incluido:', mensaje);
        setPedido([]);
        setMensaje('');
    };

    const ProtectedRoute = ({ element, ...rest }) => {
        const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
        return isAuthenticated ? element : <Navigate to="/" />;
    };

    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route
                    path="/catalogo"
                    element={
                        <ProtectedRoute
                            element={
                                <Catalogo
                                    agregarProductoACatalogo={agregarProductoACatalogo}
                                    agregarProductoAPedido={agregarProductoAPedido}
                                    catalogoPersonal={catalogoPersonal}
                                    pedido={pedido}
                                />
                            }
                        />
                    }
                />
                <Route
                    path="/catalogo-personalizado"
                    element={
                        <ProtectedRoute
                            element={
                                <CatalogoPersonalizado
                                    catalogoPersonal={catalogoPersonal}
                                    eliminarProducto={eliminarProducto}
                                />
                            }
                        />
                    }
                />
                <Route
                    path="/pedido-presupuesto"
                    element={
                        <ProtectedRoute
                            element={
                                <PedidoPresupuesto
                                    pedido={pedido}
                                    actualizarCantidadProducto={actualizarCantidadProducto}
                                    enviarPedido={enviarPedido}
                                    mensaje={mensaje}
                                    setMensaje={setMensaje}
                                />
                            }
                        />
                    }
                />
                <Route
                    path="/clientes"
                    element={
                        <ProtectedRoute
                            element={
                                <Clientes
                                    agregarProductoACatalogo={agregarProductoACatalogo}
                                    catalogoPersonal={catalogoPersonal}
                                    agregarProductoAPedido={agregarProductoAPedido}
                                    pedido={pedido}
                                />
                            }
                        />
                    }
                />
            </Routes>
        </Router>
    );
};

export default App;
