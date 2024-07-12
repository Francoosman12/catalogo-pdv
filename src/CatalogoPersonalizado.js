import React from 'react';
import './CatalogoPersonalizado.css';
import logo from './assets/Logo_PDV-removebg-preview.png'; // Ajusta la ruta según la ubicación de tu logo

const CatalogoPersonalizado = ({ catalogoPersonal, eliminarProducto }) => {
    // Función para iniciar la impresión
    const handleImprimir = () => {
        window.print(); // Inicia la impresión de la página
    };

    return (
        <div className="catalogo-personalizado">
            <h1 className="text-center mb-4">Catálogo Personalizado</h1>
            <div className="grid gap-4 p-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {catalogoPersonal.length > 0 ? (
                    catalogoPersonal.map((producto) => (
                        <div
                            key={producto.Codigo}
                            className="producto bg-white rounded-lg overflow-hidden shadow-md flex flex-col justify-between"
                            style={{
                                height: 'auto',
                                maxWidth: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                padding: '1rem',
                                margin: 'auto',
                            }}
                        >
                            <img
                                src={producto.Imagenes}
                                alt={producto.Articulo_descripcion || producto['EAN Unidad']}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-4">
                                <h2 className="text-xl font-semibold">
                                    {producto.Articulo_descripcion}
                                </h2>


                                <p className="text-gray-600">Código: {producto.Codigo}</p>
                            </div>
                            {/* Botón de eliminar */}
                            <button
                                onClick={() => eliminarProducto(producto.Codigo)} // Llama a la función eliminarProducto con el código del producto
                                className="absolute top-0 right-0 m-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none eliminar-producto"
                            >
                                X
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="text-center mt-8 text-gray-700">
                        No hay productos en tu catálogo personalizado.
                    </p>
                )}
            </div>

            {/* Botón para imprimir */}
            <div className="flex justify-center text-center mt-4 imprimir-btn">
                <button
                    onClick={handleImprimir}
                    className="px-4 py-2 boton-de-imprimir"
                >
                    Imprimir Catálogo / Guardar
                </button>
            </div>

            {/* Footer con logo */}
            <div className="footer text-center">
                <img src={logo} alt="Logo Empresa" className="logo" />
            </div>
        </div>
    );
};

export default CatalogoPersonalizado;
