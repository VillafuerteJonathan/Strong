import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import hero1 from "../../assets/hero5.jpg";
import hero2 from "../../assets/hero2.jpg";
import hero3 from "../../assets/hero3.jpg";
import "./HeroSection.css";

const heroSlides = [
  {
    image: hero1,
    title: "STRONG",
    subtitle: "Calzado de Seguridad Industrial",
    description: "Desde 1995, Strong ha sido líder en la fabricación de calzado de seguridad industrial. Protegemos a los trabajadores con la más alta calidad y tecnología avanzada.",
  },
  {
    image: hero2,
    title: "PROTECCIÓN",
    subtitle: "Profesional de Primera Clase",
    description: "Cada par de botas STRONG está diseñado con materiales premium y tecnología de vanguardia para garantizar máxima protección en ambientes industriales.",
  },
  {
    image: hero3,
    title: "CALIDAD",
    subtitle: "Probada en el Tiempo",
    description: "Con más de 25 años de experiencia, nuestros productos cumplen con las más estrictas normas internacionales de seguridad industrial.",
  },
];

export const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isHovered]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  return (
    <section 
      id="inicio" 
      className="hero-section"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
        
      {/* Background Images */}
      {heroSlides.map((slide, index) => (
        
        <div
        
          key={index}
          className={`hero-slide${index === currentSlide ? " active" : ""}`}
          aria-hidden={index !== currentSlide}
        >
          <img 
            src={slide.image} 
            alt={`${slide.title} - ${slide.subtitle}`} 
            className="hero-image" 
            loading={index === 0 ? "eager" : "lazy"}
          />
          <div className="hero-gradient"></div>
        </div>
      ))}

      {/* Content */}
      <div className="hero-content">
        <div className="hero-text-container">
          <h1 className="hero-title">{heroSlides[currentSlide].title}</h1>
          <h2 className="hero-subtitle">{heroSlides[currentSlide].subtitle}</h2>
          <p className="hero-description">{heroSlides[currentSlide].description}</p>
          <div className="hero-buttons">
            <button className="btn-hero-primary">Ver Productos</button>
            <button className="btn-hero-outline">Contactar</button>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        className="hero-arrow left-arrow"
        onClick={prevSlide}
        aria-label="Previous Slide"
      >
        <ChevronLeft className="icon" size={32} />
      </button>
      <button
        className="hero-arrow right-arrow"
        onClick={nextSlide}
        aria-label="Next Slide"
      >
        <ChevronRight className="icon" size={32} />
      </button>

      {/* Slide Indicators */}
      <div className="hero-indicators">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            className={`indicator-dot${index === currentSlide ? " active" : ""}`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === currentSlide ? "true" : "false"}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;