import React, { useEffect, useState, useCallback } from 'react';
import './Catalogo.css';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';

const Catalogo = ({
    agregarProductoACatalogo,
    catalogoPersonal,
    agregarProductoAPedido,
    pedido
}) => {
    const [productos, setProductos] = useState([]);
    const [productosOriginales, setProductosOriginales] = useState([]);
    const [proveedorSeleccionado, setProveedorSeleccionado] = useState('');
    const [codigoProducto, setCodigoProducto] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [rubroSeleccionado, setRubroSeleccionado] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 20;
    const navigate = useNavigate();

    useEffect(() => {
        fetch('/productos.json')
            .then((response) => response.json())
            .then((data) => {
                setProductos(data);
                setProductosOriginales(data);
            })
            .catch((error) => console.error('Error al cargar los productos:', error));
    }, []);

    const handleAgregarProducto = (producto) => {
        agregarProductoACatalogo(producto);
    };

    const handleAgregarProductoPresupuesto = (producto) => {
        if (!pedido.some((p) => p.Codigo === producto.Codigo)) {
            agregarProductoAPedido(producto);
        }
    };

    const proveedores = [...new Set(productos.map((producto) => producto.Proveedor))];
    const rubros = [...new Set(productos.map((producto) => producto.Rubro))];

    const filtrarProductos = useCallback(() => {
        let productosFiltrados = productosOriginales;

        if (proveedorSeleccionado !== '') {
            productosFiltrados = productosFiltrados.filter(producto => producto.Proveedor === proveedorSeleccionado);
        }
        if (codigoProducto !== '') {
            productosFiltrados = productosFiltrados.filter(producto => producto.Codigo.includes(codigoProducto));
        }
        if (descripcion !== '') {
            productosFiltrados = productosFiltrados.filter(producto => producto.Articulo_descripcion.toLowerCase().includes(descripcion.toLowerCase()));
        }
        if (rubroSeleccionado !== '') {
            productosFiltrados = productosFiltrados.filter(producto => producto.Rubro === rubroSeleccionado);
        }

        setProductos(productosFiltrados);
    }, [productosOriginales, proveedorSeleccionado, codigoProducto, descripcion, rubroSeleccionado]);

    useEffect(() => {
        filtrarProductos();
    }, [filtrarProductos]);

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = productos.slice(indexOfFirstProduct, indexOfLastProduct);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const descargarImagen = (url, nombre) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = nombre;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const totalPages = Math.ceil(productos.length / productsPerPage);
    const renderPageNumbers = () => {
        const pageNumbers = [];
        const maxPagesToShow = 10;

        for (let i = 1; i <= totalPages; i++) {
            if (i <= maxPagesToShow || (i > maxPagesToShow && currentPage >= i - maxPagesToShow && currentPage <= i)) {
                pageNumbers.push(
                    <button
                        key={i}
                        onClick={() => paginate(i)}
                        className={`paginacion-boton ${currentPage === i ? 'activo' : ''}`}
                    >
                        {i}
                    </button>
                );
            } else if (i === totalPages && totalPages > maxPagesToShow) {
                pageNumbers.push(
                    <button
                        key={i}
                        onClick={() => paginate(i)}
                        className={`paginacion-boton ${currentPage === i ? 'activo' : ''}`}
                    >
                        Ver más
                    </button>
                );
            }
        }

        return pageNumbers;
    };

    return (
        <div className="catalogo">
            <Navbar
                proveedores={proveedores}
                proveedorSeleccionado={proveedorSeleccionado}
                setProveedorSeleccionado={setProveedorSeleccionado}
                rubros={rubros}
                rubroSeleccionado={rubroSeleccionado}
                catalogoCount={catalogoPersonal.length}
                onBuscarProducto={(codigo) => {
                    setCodigoProducto(codigo);
                }}
                onBuscarDescripcion={(descripcion) => {
                    setDescripcion(descripcion);
                }}
                descargarImagen={descargarImagen}
            />

            <div className="fixed-buttons-container">
                <button
                    onClick={() => navigate('/catalogo-personalizado')}
                    className="fixed-button-left"
                >
                    Ir a MI CATÁLOGO ({catalogoPersonal.length})
                </button>
                <button
                    onClick={() => navigate('/pedido-presupuesto')}
                    className="fixed-button-right"
                >
                    Ver Pedido ({pedido.length})
                </button>
            </div>

            {/* Formulario de filtros */}
            <div className="filtro-formulario">
                <h2 className="filtro-titulo">Filtrar Productos</h2>
                <form className="filtro-form">
                    <input
                        type="text"
                        placeholder="Código de Producto"
                        value={codigoProducto}
                        onChange={(e) => setCodigoProducto(e.target.value)}
                        className="filtro-input"
                    />
                    <input
                        type="text"
                        placeholder="Descripción"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        className="filtro-input"
                    />
                    <select
                        value={rubroSeleccionado}
                        onChange={(e) => setRubroSeleccionado(e.target.value)}
                        className="filtro-select"
                    >
                        <option value="">Todos los Rubros</option>
                        {rubros.map((rubro, index) => (
                            <option key={index} value={rubro}>{rubro}</option>
                        ))}
                    </select>
                    <select
                        value={proveedorSeleccionado}
                        onChange={(e) => setProveedorSeleccionado(e.target.value)}
                        className="filtro-select"
                    >
                        <option value="">Todos los Proveedores</option>
                        {proveedores.map((proveedor, index) => (
                            <option key={index} value={proveedor}>{proveedor}</option>
                        ))}
                    </select>
                </form>
            </div>

            <div className="grid mt-16 gap-4 p-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
                {currentProducts.length > 0 ? (
                    currentProducts.map((producto) => (
                        <div
                            key={producto.Codigo}
                            className="producto bg-white rounded-lg overflow-hidden shadow-md"
                        >
                            <img
                                src={producto.Imagenes}
                                alt={
                                    producto.Articulo_descripcion ||
                                    producto['EAN Unidad']
                                }
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-4">
                                <h2 className="text-xl font-semibold">
                                    {producto.Articulo_descripcion ||
                                        producto['EAN Unidad']}
                                </h2>
                                <p className="text-gray-600">
                                    Código: {producto.Codigo}
                                </p>
                                <p className="text-gray-600">
                                    Proveedor: {producto.Proveedor}
                                </p>
                                <p className="text-gray-600">Rubro: {producto.Rubro}</p>
                                <button
                                    onClick={() => handleAgregarProducto(producto)}
                                    className="bg-green-500 text-white px-4 py-2 mt-2 rounded hover:bg-green-700"
                                >
                                    Agregar a Mi Catálogo
                                </button>
                                <button
                                    onClick={() => handleAgregarProductoPresupuesto(producto)}
                                    className="bg-blue-500 text-white px-4 py-2 mt-2 rounded hover:bg-blue-700 ml-2"
                                >
                                    Agregar a Pedido
                                </button>
                                <button
                                    onClick={() =>
                                        descargarImagen(producto.Imagenes, producto.Codigo)
                                    }
                                    className="bg-yellow-500 text-white px-4 py-2 mt-2 rounded hover:bg-yellow-700 ml-2"
                                >
                                    Descargar Imagen
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No se encontraron productos.</p>
                )}
            </div>

            {/* Paginación */}
            <div className="paginacion">
                {renderPageNumbers()}
            </div>

            {/* Dentro de tu componente Catalogo */}
<footer className="footer">
    <p className="footer-text">© 2024 DevOs. Todos los derechos reservados.</p>
</footer>

        </div>
    );
};

export default Catalogo;
