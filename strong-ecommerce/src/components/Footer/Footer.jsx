import React from 'react';
import { FaFacebookF, FaInstagram, FaTiktok, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import './footer.css';

const Footer = () => {
  return (
    <footer>
      <div className="footer-columns" id='contacto'>
        {/* Columna 1: Matriz Ambato */}
        <div className="footer-column">
          <h4>Matriz Ambato</h4>
          <p><FaMapMarkerAlt style={{ marginRight: '0.5rem' }} />Av. Bolivariana y Pedro Pablo Echeverría, Sector La Joya</p>
          <p><FaPhone style={{ marginRight: '0.5rem' }} />Telf.: +593 3 2405702</p>
        </div>

        {/* Columna 2: Contacto */}
        <div className="footer-column">
          <h4>Contacto</h4>
          <p><FaEnvelope style={{ marginRight: '0.5rem' }} />gerencia@strongecuador.com</p>
          <p><FaEnvelope style={{ marginRight: '0.5rem' }} />ventas@strongecuador.com</p>
        </div>

        {/* Columna 3: Redes Sociales */}
        <div className="footer-column">
          <h4>Redes Sociales</h4>
          <div className="footer-social">
            <a href="https://www.facebook.com/strongshoesec/" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
            <a href="https://www.instagram.com/calzado_strong?utm_source=ig_web_button_share_sheet&igsh=MTM4YXR5eDY1cWhrYg==" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
            <a href="https://www.tiktok.com/@calzado_strong?is_from_webapp=1&sender_device=pc" target="_blank" rel="noopener noreferrer"><FaTiktok /></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} STRONG SECURITY SHOES. Todos los derechos reservados.</p>
         <p> Realizado por EDURDSOLUTION.</p>
      </div>
    </footer>
  );
};

export default Footer;oiu