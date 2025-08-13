import { useState, useEffect } from "react";
import "./Header.css";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PersonIcon from "@mui/icons-material/Person";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsOpen(false);
    }
  };

  const navItems = [
    { name: "Inicio", href: "inicio" },
    { name: "Productos", href: "productos" },
    { name: "Calidad", href: "calidad" },
    { name: "Novedades", href: "novedades" },
    { name: "Contáctanos", href: "contacto" },
  ];

  return (
    <nav className={`navbar ${isScrolled ? "navbar-scrolled" : ""}`}>
      <div className="container">
        <div className="navbar-content">
          {/* Logo */}
          <div className="logo" onClick={() => scrollToSection("inicio")}>
            <h1>STRONG</h1>
          </div>

          {/* Desktop Navigation */}
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

        {/* Icons (Carrito y Usuario) */}
            <div className="icons-container">
            <button className="icon-button">
                <ShoppingCartIcon className="icon" />
            </button>
             <button className="icon-button ">
                <PersonIcon className="icon" />
            </button>
           
            </div>


          {/* Mobile menu button */}
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

        {/* Mobile Navigation */}
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