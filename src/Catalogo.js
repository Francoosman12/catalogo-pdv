import React, { useEffect, useState, useCallback } from 'react';
import './Catalogo.css';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';

const Catalogo = ({ agregarProductoACatalogo, catalogoPersonal }) => {
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

    const handleAgregarProducto = (producto, event) => {
        event.preventDefault(); // Prevenir comportamiento predeterminado
        agregarProductoACatalogo(producto);
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

    const descargarImagen = (url, nombre, event) => {
        event.preventDefault(); // Prevenir comportamiento predeterminado
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
                        type="button"
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
                        type="button"
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
                    type="button"
                >
                    Ir a MI CATÁLOGO ({catalogoPersonal.length})
                </button>
            </div>

            {/* Formulario de filtros */}
            <div className="filtro-formulario">
                <h2 className="titulo-seccion">Catálogo</h2>
                <div className="filtros">
                    <select
                        value={proveedorSeleccionado}
                        onChange={(e) => setProveedorSeleccionado(e.target.value)}
                        className="filtro-select"
                    >
                        <option value="">Seleccionar proveedor</option>
                        {proveedores.map((proveedor, index) => (
                            <option key={index} value={proveedor}>
                                {proveedor}
                            </option>
                        ))}
                    </select>
                    <select
                        value={rubroSeleccionado}
                        onChange={(e) => setRubroSeleccionado(e.target.value)}
                        className="filtro-select"
                    >
                        <option value="">Seleccionar rubro</option>
                        {rubros.map((rubro, index) => (
                            <option key={index} value={rubro}>
                                {rubro}
                            </option>
                        ))}
                    </select>
                    <input
                        type="text"
                        placeholder="Código de producto"
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
                </div>
            </div>

            {/* Lista de productos */}
            <ul className="grid">
    {currentProducts.map((producto) => (
        <li key={producto.Codigo} className="producto">
            <img src={producto.Imagenes} alt={producto.Articulo_descripcion} />
            <h2>{producto.Articulo_descripcion}</h2>
            <p>Código: {producto.Codigo}</p>
            <p>Proveedor: {producto.Proveedor}</p>
            <button
                onClick={(e) => handleAgregarProducto(producto, e)}
                className="producto-boton"
                type="button"
            >
                Agregar a Mi Catálogo
            </button>
            <button
                onClick={(e) => descargarImagen(producto.Imagenes, producto.Codigo, e)}
                className="producto-boton"
                type="button"
            >
                Descargar Imagen
            </button>
        </li>
    ))}
</ul>


            {/* Paginación */}
            <div className="paginacion">
                {renderPageNumbers()}
            </div>
        </div>
    );
};

export default Catalogo;
