import React, { useEffect, useState } from 'react';
import './Catalogo.css';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';

const Catalogo = ({ agregarProductoACatalogo, catalogoPersonal }) => {
    const [productos, setProductos] = useState([]);
    const [proveedorSeleccionado, setProveedorSeleccionado] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 20;
    const paginationLimit = 10;
    const [showMore, setShowMore] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('/productos.json')
            .then((response) => response.json())
            .then((data) => {
                setProductos(data);
            })
            .catch((error) => console.error('Error al cargar los productos:', error));
    }, []);

    const descargarImagen = (url, nombre) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = nombre;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const proveedores = [...new Set(productos.map((producto) => producto.Proveedor))];

    const productosFiltrados = proveedorSeleccionado
        ? productos.filter((producto) => producto.Proveedor === proveedorSeleccionado)
        : productos;

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = productosFiltrados.slice(indexOfFirstProduct, indexOfLastProduct);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="catalogo">
            <Navbar
                proveedores={proveedores}
                proveedorSeleccionado={proveedorSeleccionado}
                setProveedorSeleccionado={setProveedorSeleccionado}
                catalogoCount={catalogoPersonal.length}
            />

            <div className="flex justify-center mt-4">
                <button
                    onClick={() => navigate('/catalogo-personalizado')}
                    className="mt-4 px-4 py-2 bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                    Vista Previa de MI CATALOGO
                </button>
            </div>

            <div className="grid mt-16 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
                                    {producto.Articulo_descripcion}
                                </h2>
                                <p className="text-gray-600">
                                    Rubro: {producto.Rubro}
                                </p>
                                <p className="text-gray-600">
                                    Proveedor: {producto.Proveedor}
                                </p>
                                <p className="text-gray-600">
                                    Código: {producto.Codigo}
                                </p>
                                <button
                                    onClick={() =>
                                        descargarImagen(
                                            producto.Imagenes,
                                            producto.Articulo_descripcion ||
                                            producto['EAN Unidad']
                                        )
                                    }
                                    className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                                >
                                    Descargar Imagen
                                </button>
                                <button
                                    onClick={() =>
                                        agregarProductoACatalogo(producto)
                                    }
                                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    Agregar al catálogo
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center mt-8 text-gray-700">
                        Lo siento. No se encontraron productos.
                    </p>
                )}
            </div>
            {productosFiltrados.length > productsPerPage && (
                <div className="flex justify-center mt-4">
                    {[...Array(showMore ? Math.ceil(productosFiltrados.length / productsPerPage) : paginationLimit)].map((_, index) => (
                        <button
                            key={index}
                            onClick={() => paginate(index + 1)}
                            className={`px-4 py-2 mx-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 ${currentPage === index + 1 ? 'bg-gray-400' : ''}`}
                        >
                            {index + 1}
                        </button>
                    ))}
                    {!showMore && (
                        <button
                            onClick={() => setShowMore(true)}
                            className="px-4 py-2 mx-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                        >
                            Ver más...
                        </button>
                    )}
                </div>
            )}

        </div>
    );
};

export default Catalogo;
