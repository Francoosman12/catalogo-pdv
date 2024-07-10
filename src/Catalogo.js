import React, { useEffect, useState } from 'react';
import './Catalogo.css';
import Navbar from './Navbar';

const Catalogo = () => {
    const [productos, setProductos] = useState([]);
    const [proveedorSeleccionado, setProveedorSeleccionado] = useState('');

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

    // Obtener lista de proveedores únicos
    const proveedores = [...new Set(productos.map(producto => producto.Proveedor))];

    // Filtrar productos por proveedor seleccionado
    const productosFiltrados = proveedorSeleccionado
        ? productos.filter(producto => producto.Proveedor === proveedorSeleccionado)
        : productos;

    return (
        <div className="catalogo">
            <Navbar
                proveedores={proveedores}
                proveedorSeleccionado={proveedorSeleccionado}
                setProveedorSeleccionado={setProveedorSeleccionado}
            />
            <div className="grid mt-16 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.isArray(productosFiltrados) && productosFiltrados.length > 0 ? (
                    productosFiltrados.map((producto) => (
                        <div key={producto.Codigo} className="producto bg-white rounded-lg overflow-hidden shadow-md">
                            <img
                                src={producto.Imagenes}
                                alt={producto.Articulo_descripcion || producto['EAN Unidad']}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-4">
                                <h2 className="text-xl font-semibold">{producto.Articulo_descripcion}</h2>
                                <p className="text-gray-600">Rubro: {producto.Rubro}</p>
                                <p className="text-gray-600">Proveedor: {producto.Proveedor}</p>
                                <p className="text-gray-600">Código: {producto.Codigo}</p>
                                <button
                                    onClick={() =>
                                        descargarImagen(
                                            producto.Imagenes,
                                            producto.Articulo_descripcion || producto['EAN Unidad']
                                        )
                                    }
                                    className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                                >
                                    Descargar Imagen
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center mt-8 text-gray-700">No se encontraron productos.</p>
                )}
            </div>
        </div>
    );
};

export default Catalogo;
