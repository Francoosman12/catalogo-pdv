import React, { useEffect, useState } from 'react';
import './Catalogo.css';
import Navbar from './Navbar';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const Catalogo = () => {
    const [productos, setProductos] = useState([]);
    const [proveedorSeleccionado, setProveedorSeleccionado] = useState('');
    const [catalogoPersonal, setCatalogoPersonal] = useState([]);

    useEffect(() => {
        fetch('/productos.json')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
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

    const agregarProductoACatalogo = (producto) => {
        if (!catalogoPersonal.some((p) => p.Codigo === producto.Codigo)) {
            setCatalogoPersonal([...catalogoPersonal, producto]);
        }
    };

    const crearPDF = () => {
        // Agrupar productos en sets de 9
        const setsDeProductos = [];
        for (let i = 0; i < catalogoPersonal.length; i += 9) {
            setsDeProductos.push(catalogoPersonal.slice(i, i + 9));
        }

        // Crear un nuevo documento PDF
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        // Iterar sobre cada set de productos para capturar y añadir al PDF
        setsDeProductos.forEach((set, index) => {
            const htmlContent = `
                <html>
                <head>
                    <style>
                        .grid {
                            display: grid;
                            grid-template-columns: repeat(3, 1fr);
                            gap: 20px;
                            padding: 20px;
                        }
                        .producto {
                            border: 1px solid #ccc;
                            border-radius: 10px;
                            overflow: hidden;
                            text-align: center;
                            padding: 10px;
                            background-color: #f5f5f5;
                        }
                        .producto img {
                            width: 100%;
                            height: auto;
                            max-height: 200px;
                            object-fit: cover;
                        }
                        .producto h2 {
                            font-size: 1.2em;
                            color: #333;
                        }
                        .producto p {
                            color: #666;
                        }
                    </style>
                </head>
                <body>
                    <div class="grid">
                        ${set.map((producto) => `
                            <div class="producto">
                                <img src="${producto.Imagenes}" alt="${producto.Articulo_descripcion}">
                                <h2>${producto.Articulo_descripcion}</h2>
                                <p>Rubro: ${producto.Rubro}</p>
                                <p>Proveedor: ${producto.Proveedor}</p>
                                <p>Código: ${producto.Codigo}</p>
                            </div>
                        `).join('')}
                    </div>
                </body>
                </html>
            `;

            // Añadir la página al documento PDF
            if (index > 0) {
                pdf.addPage();
            }

            html2canvas(document.body.appendChild(htmlContent)).then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            });
        });

        // Descargar el PDF
        pdf.save('catalogo_personal.pdf');
    };

    const proveedores = [...new Set(productos.map((producto) => producto.Proveedor))];

    const productosFiltrados = proveedorSeleccionado
        ? productos.filter((producto) => producto.Proveedor === proveedorSeleccionado)
        : productos;

    return (
        <div className="catalogo">
            <Navbar
                proveedores={proveedores}
                proveedorSeleccionado={proveedorSeleccionado}
                setProveedorSeleccionado={setProveedorSeleccionado}
                onCrearCatalogo={crearPDF}
                catalogoCount={catalogoPersonal.length}
            />
            <div className="grid mt-16 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.isArray(productosFiltrados) && productosFiltrados.length > 0 ? (
                    productosFiltrados.map((producto) => (
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
        </div>
    );
};

export default Catalogo;
