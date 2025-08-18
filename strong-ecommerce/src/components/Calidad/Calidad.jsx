import React from 'react';
import { FaShieldAlt, FaTintSlash, FaBolt, FaShoePrints } from 'react-icons/fa';
import './Calidad.css'; // Asegúrate de tener este archivo CSS con los estilos que mejoramos

const QualitySection = () => {
  return (
    <section id="calidad" className="quality-section" >
      <div className="quality-container">
        <div className="quality-header">
          <h2>¿POR QUÉ ELEGIR STRONG SECURITY SHOES?</h2>
          <p>
            Nuestro calzado está diseñado pensando en tu seguridad y comodidad durante largas jornadas laborales
          </p>
        </div>

        <div className="quality-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <FaShieldAlt />
            </div>
            <h3>Protección Certificada</h3>
            <p>Cumplimos con los más altos estándares de seguridad industrial</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <FaTintSlash />
            </div>
            <h3>Resistente al Agua</h3>
            <p>Materiales hidrófugos que mantienen tus pies secos en cualquier condición</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <FaBolt />
            </div>
            <h3>Aislamiento Eléctrico</h3>
            <p>Protección dieléctrica para entornos con riesgo eléctrico</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <FaShoePrints />
            </div>
            <h3>Comodidad Duradera</h3>
            <p>Diseño ergonómico para jornadas extensas sin fatiga</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QualitySection;
