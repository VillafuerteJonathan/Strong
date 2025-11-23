import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Header.css";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import LoginIcon from "@mui/icons-material/Login";

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

  const esCategoriaDetalle = location.pathname.startsWith("/categoria");
  const esProductoDetalle = location.pathname.startsWith("/producto");

  // Función para hacer scroll a secciones
  const scrollToSection = (sectionId) => {
    if (location.pathname !== "/") {
      navigate("/", { replace: true });
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          const navbarHeight = document.querySelector(".navbar")?.offsetHeight || 70;
          const elementPosition = element.getBoundingClientRect().top + window.scrollY;
          const offsetPosition = elementPosition - navbarHeight;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        const navbarHeight = document.querySelector(".navbar")?.offsetHeight || 70;
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
        ${esCategoriaDetalle ? "navbar-negro" : "navbar-transparente"}
        ${esProductoDetalle ? "navbar-negro" : "navbar-transparente"}`}
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

          {/* Botón de iniciar sesión */}
          <div className="icons-container">
            <button
              className="icon-button"
              onClick={() => navigate("/login")}
              title="Iniciar Sesión"
            >
              <LoginIcon className="icon" />
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

            {/* Iniciar sesión en menú móvil */}
            <button
              className="mobile-nav-link"
              onClick={() => {
                setIsOpen(false);
                navigate("/login");
              }}
            >
              Iniciar Sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
