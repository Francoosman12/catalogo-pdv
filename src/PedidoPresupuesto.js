import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PedidoPresupuesto.css'; // Asegúrate de tener estilos adecuados

const PedidoPresupuesto = ({ pedido, actualizarCantidadProducto, enviarPedido, mensaje, setMensaje }) => {
    const [vendedores, setVendedores] = useState([]);
    const [selectedVendedor, setSelectedVendedor] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Cargar los datos de vendedores desde el archivo JSON
        const loadVendedores = async () => {
            try {
                const response = await fetch('/vendedores.json'); // Ajusta la ruta si es necesario
                const data = await response.json();
                setVendedores(data);
            } catch (error) {
                console.error('Error al cargar los datos de vendedores:', error);
            }
        };

        loadVendedores();
    }, []);

    const handleCantidadChange = (producto, cantidad) => {
        if (cantidad === '' || (Number(cantidad) >= 1 && Number(cantidad) <= 999)) {
            actualizarCantidadProducto(producto, Number(cantidad) || '');
        }
    };

    const handleCantidadInput = (producto, event) => {
        const value = event.target.value;
        handleCantidadChange(producto, value);
    };

    const handleEnviarPedido = () => {
        if (pedido.length > 0 && selectedVendedor) {
            const vendedor = vendedores.find(v => v.nombre === selectedVendedor);
            if (!vendedor) {
                alert('Vendedor seleccionado no encontrado.');
                return;
            }

            const mensajeParaVendedor = `Hola, te solicito un presupuesto para los siguientes productos:\n\n`;
            const detallesPedido = pedido.map((producto) => (
                `Producto: ${producto.Articulo_descripcion}\n` +
                `Código: ${producto.Codigo}\n` +
                `Cantidad: ${producto.cantidad || 'No especificada'}\n\n`
            )).join('');

            const mensajeCompleto = encodeURIComponent(mensajeParaVendedor + detallesPedido + mensaje);

            const urlWhatsApp = `https://wa.me/${vendedor.numero}?text=${mensajeCompleto}`;

            window.location.href = urlWhatsApp;
        } else {
            alert("El pedido está vacío o no se ha seleccionado un vendedor.");
        }
    };

    return (
        <div className="pedido-presupuesto">
            <h1>Pedido de Presupuesto</h1>
            <div className="productos-pedido">
                {pedido.map((producto, index) => (
                    <div key={index} className="producto-pedido">
                        <img src={producto.Imagenes} alt={producto.Articulo_descripcion} className="imagen-producto" />
                        <div className="info-producto">
                            <h2>{producto.Articulo_descripcion}</h2>
                            <p>Código: {producto.Codigo}</p>
                            <p>Proveedor: {producto.Proveedor}</p>
                            <input
                                type="number"
                                value={producto.cantidad || ''}
                                onChange={(e) => handleCantidadInput(producto, e)}
                                className="input-cantidad"
                                min="1"
                                max="999"
                            />
                        </div>
                    </div>
                ))}
            </div>
            <div className="acciones-pedido">
                <textarea
                    value={mensaje}
                    onChange={(e) => setMensaje(e.target.value)}
                    placeholder="Añade un mensaje para el vendedor"
                    className="mensaje-pedido"
                />
                <label htmlFor="vendedor-select">Selecciona un vendedor:</label>
                <select
                    id="vendedor-select"
                    value={selectedVendedor}
                    onChange={(e) => setSelectedVendedor(e.target.value)}
                    className="select-vendedor"
                >
                    <option value="">Selecciona un vendedor</option>
                    {vendedores.map((vendedor, index) => (
                        <option key={index} value={vendedor.nombre}>
                            {vendedor.nombre}
                        </option>
                    ))}
                </select>
                <button onClick={handleEnviarPedido} className="btn-enviar-pedido">
                    Pedir presupuesto a mi vendedor
                </button>
                <button onClick={() => navigate('/')} className="btn-volver-catalogo">
                    Volver al Catálogo
                </button>
            </div>
        </div>
    );
};

export default PedidoPresupuesto;
