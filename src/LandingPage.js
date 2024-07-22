// src/LandingPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
    const [isFormVisible, setFormVisible] = useState(false);
    const [dni, setDni] = useState('');
    const [numeroVendedor, setNumeroVendedor] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/data.json'); // Asegúrate de que el archivo sea accesible
            const { Usuario, Password } = await response.json();

            // Simulando verificación de usuario y contraseña
            const usuarioValido = Usuario === "Catalogo.pdv";
            const passwordValido = Password === "$p-d%v!.";

            if (usuarioValido && passwordValido) {
                localStorage.setItem('isAuthenticated', 'true');
                navigate('/catalogo');
                setFormVisible(false);
                setDni('');
                setNumeroVendedor('');
                setError('');
            } else {
                setError('Datos incorrectos. Por favor, verifique su usuario y contraseña.');
            }
        } catch (error) {
            console.error('Error al verificar los datos:', error);
            setError('Error al verificar los datos.');
        }
    };

    return (
        <div className="landing-page">
            <img 
                src="/Logo_PDV-.png"
                alt="Logo" 
                className="landing-logo" 
            />
            <h1 className="landing-title">Bienvenido a nuestro catálogo</h1>
            <div className="landing-buttons">
                <button
                    onClick={() => setFormVisible(true)}
                    className="landing-button"
                >
                    Soy vendedor
                </button>
                <button
                    onClick={() => navigate('/clientes')}
                    className="landing-button"
                >
                    Soy cliente
                </button>
            </div>
            {isFormVisible && (
                <div className="form-container">
                    <h2>Ingreso de Vendedor</h2>
                    <form onSubmit={handleFormSubmit} className="landing-form">
                        <label>
                            <input 
                                type="text" 
                                value={dni} 
                                onChange={(e) => setDni(e.target.value)} 
                                placeholder='Ingresar usuario'
                                required 
                            />
                        </label>
                        <label>
                            <input 
                                type="password" 
                                value={numeroVendedor} 
                                onChange={(e) => setNumeroVendedor(e.target.value)}
                                placeholder='Ingresar contraseña' 
                                required 
                            />
                        </label>
                        <button type="submit">Ingresar</button>
                        {error && <p className="error-message">{error}</p>}
                    </form>
                </div>
            )}
        </div>
    );
};

export default LandingPage;
