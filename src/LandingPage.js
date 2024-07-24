// src/LandingPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
    return (
        <div className="landing-page">
            <img 
                src="/Logo_PDV-.png"
                alt="Logo" 
                className="landing-logo" 
            />
            <h1 className="landing-title">Bienvenido a nuestro catálogo</h1>
            <div className="landing-buttons">
                <Link to="/vendedor" className="landing-button">
                    Soy vendedor
                </Link>
                <Link to="/clientes" className="landing-button">
                    Soy cliente
                </Link>
            </div>
        </div>
    );
};

export default LandingPage;
