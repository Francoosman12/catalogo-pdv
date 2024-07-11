import React from 'react';

const CatalogoPersonal = ({ catalogoPersonal, descargarImagen }) => {
    return (
        <div className="grid mt-16 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {catalogoPersonal.length > 0 ? (
                catalogoPersonal.map((producto) => (
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
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-center mt-8 text-gray-700">
                    No hay productos agregados al catálogo.
                </p>
            )}
        </div>
    );
};

export default CatalogoPersonal;
