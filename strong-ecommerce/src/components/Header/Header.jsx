import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Header.css";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Detectar scroll para cambiar estilo del navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Detectar si estamos en la página de categorías
  const esCategoriaDetalle = location.pathname.startsWith("/categoria");

  // Función para hacer scroll a secciones
  const scrollToSection = (sectionId) => {
    if (location.pathname !== "/") {
      navigate(`/#${sectionId}`);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        const navbarHeight = document.querySelector(".navbar").offsetHeight;
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - navbarHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    }
    setIsOpen(false);
  };

  const navItems = [
    { name: "Inicio", href: "inicio" },
    { name: "Productos", href: "productos" },
    { name: "Calidad", href: "calidad" }, 
    { name: "Contáctanos", href: "contacto" },
  ];

  return (
    <nav
      className={`navbar 
        ${isScrolled ? "navbar-scrolled" : ""} 
        ${esCategoriaDetalle ? "navbar-negro" : "navbar-transparente"}`}
    >
      <div className="container">
        <div className="navbar-content">
          {/* Logo */}
          <div className="logo" onClick={() => scrollToSection("inicio")}>
            <h1>STRONG</h1>
          </div>

          {/* Navegación desktop */}
          <div className="nav-desktop">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className="nav-link"
              >
                {item.name}
                <span className="nav-underline"></span>
              </button>
            ))}
          </div>

          {/* Icono carrito */}
          <div className="icons-container">
            <button className="icon-button">
              <ShoppingCartIcon className="icon" />
            </button>
          </div>

          {/* Botón menú móvil */}
          <div className="mobile-menu-button">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="btn-ghost"
              aria-label="Toggle menu"
            >
              {isOpen ? <CloseIcon className="icon" /> : <MenuIcon className="icon" />}
            </button>
          </div>
        </div>

        {/* Menú móvil */}
        <div className={`mobile-menu ${isOpen ? "mobile-menu-open" : ""}`}>
          <div className="mobile-menu-items">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className="mobile-nav-link"
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
