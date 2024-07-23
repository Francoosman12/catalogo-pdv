import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
    const [isFormVisible, setFormVisible] = useState(false);
    const [usuario, setUsuario] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/data.json');
            const data = await response.json();

            if (usuario === data.Usuario && password === data.Password) {
                localStorage.setItem('isAuthenticated', 'true');
                navigate('/catalogo');
                setFormVisible(false);
                setUsuario('');
                setPassword('');
                setError('');
            } else {
                setError('Datos incorrectos. Por favor, verifique su usuario y contraseña.');
            }
        } catch (error) {
            console.error('Error al verificar los datos:', error);
            setError('Error al verificar los datos.');
        }
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
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
            <div className={`form-container ${isFormVisible ? 'show' : ''}`}>
                <h2>Ingreso de Vendedor</h2>
                <form onSubmit={handleFormSubmit} className="landing-form">
                    <label>
                        <input 
                            type="text" 
                            value={usuario} 
                            onChange={(e) => setUsuario(e.target.value)} 
                            placeholder='Ingresar usuario'
                            required 
                        />
                    </label>
                    <label>
                        <input 
                            type={showPassword ? 'text' : 'password'}
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder='Ingresar contraseña' 
                            required 
                        />
                        <input
                            type="checkbox"
                            id="show-password"
                            checked={showPassword}
                            onChange={toggleShowPassword}
                            style={{ marginLeft: '10px' }}
                            className='ver-contraseña'
                        />
                        <label htmlFor="show-password" style={{ marginLeft: '4px', color: 'grey' }}>Mostrar contraseña</label>
                    </label>
                    <button type="submit">Ingresar</button>
                    {error && <p className="error-message">{error}</p>}
                    <button 
                    onClick={() => setFormVisible(false)}
                    className="close-button"
                >
                    Cerrar
                </button>
                </form>
            </div>
        </div>
    );
};

export default LandingPage;
