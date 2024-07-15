import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PedidoPresupuesto.css'; // Asegúrate de tener estilos adecuados

const PedidoPresupuesto = ({ pedido, actualizarCantidadProducto, enviarPedido, mensaje, setMensaje }) => {
    const navigate = useNavigate();

    const handleCantidadChange = (producto, cantidad) => {
        // Validación para asegurar que la cantidad esté entre 1 y 999
        if (!isNaN(cantidad) && cantidad >= 1 && cantidad <= 999) {
            actualizarCantidadProducto(producto, cantidad);
        }
    };

    const handleEnviarPedido = () => {
        if (pedido.length > 0) {
            // Construir el mensaje para el vendedor
            const mensajeParaVendedor = `Hola, te solicito un presupuesto para los siguientes productos:\n\n`;
            const detallesPedido = pedido.map((producto) => (
                `Producto: ${producto.Articulo_descripcion}\n` +
                `Código: ${producto.Codigo}\n` +
                `Cantidad: ${producto.cantidad}\n\n`
            )).join('');

            const mensajeCompleto = encodeURIComponent(mensajeParaVendedor + detallesPedido + mensaje);

            // Construir la URL de WhatsApp con el número del vendedor y el mensaje prellenado
            const numeroVendedor = '543816436214'; // Reemplazar con el número de WhatsApp del vendedor
            const urlWhatsApp = `https://wa.me/${numeroVendedor}?text=${mensajeCompleto}`;

            // Redirigir al usuario a WhatsApp
            window.location.href = urlWhatsApp;
        } else {
            alert("El pedido está vacío. Añade productos al pedido antes de enviarlo.");
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
                                onChange={(e) => handleCantidadChange(producto, parseInt(e.target.value))}
                                className="input-cantidad"
                                min="1"
                                max="999" // Establece un máximo de tres cifras
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
