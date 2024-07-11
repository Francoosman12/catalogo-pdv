import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Catalogo from './Catalogo';
import CatalogoPersonalizado from './CatalogoPersonalizado';
import './App.css';

const App = () => {
  const [catalogoPersonal, setCatalogoPersonal] = useState([]);

  const agregarProductoACatalogo = (producto) => {
    if (!catalogoPersonal.some((p) => p.Codigo === producto.Codigo)) {
      setCatalogoPersonal([...catalogoPersonal, producto]);
    }
  };

  const eliminarProducto = (codigo) => {
    const nuevoCatalogo = catalogoPersonal.filter((producto) => producto.Codigo !== codigo);
    setCatalogoPersonal(nuevoCatalogo);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Catalogo
              agregarProductoACatalogo={agregarProductoACatalogo}
              catalogoPersonal={catalogoPersonal}
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
      </Routes>
    </Router>
  );
};

export default App;
