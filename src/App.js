import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Catalogo from './Catalogo';
import CatalogoPersonalizado from './CatalogoPersonalizado';
import PedidoPresupuesto from './PedidoPresupuesto';
import './App.css';

const App = () => {
    const [catalogoPersonal, setCatalogoPersonal] = useState([]);
    const [pedido, setPedido] = useState([]);
    const [mensaje, setMensaje] = useState(''); // Estado para mensaje

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
        // Implementar lógica de envío de pedido aquí
        console.log('Pedido enviado al vendedor:', pedido);
        console.log('Mensaje incluido:', mensaje);
        // Reiniciar estados después del envío, si es necesario
        setPedido([]);
        setMensaje('');
    };

    return (
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={
                        <Catalogo
                            agregarProductoACatalogo={agregarProductoACatalogo}
                            agregarProductoAPedido={agregarProductoAPedido}
                            catalogoPersonal={catalogoPersonal}
                            pedido={pedido}
                        />
                    }
                />
                <Route
                    path="/catalogo-personalizado"
                    element={
                        <CatalogoPersonalizado
                            catalogoPersonal={catalogoPersonal}
                            eliminarProducto={eliminarProducto}
                        />
                    }
                />
                <Route
                    path="/pedido-presupuesto"
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
            </Routes>
        </Router>
    );
};

export default App;
