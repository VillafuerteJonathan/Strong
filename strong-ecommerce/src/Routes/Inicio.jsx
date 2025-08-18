// src/paginas/Inicio.jsx
import Header from "../components/Header/Header";
import HeroSection from "../components/HeroSection/HeroSection";
import Novedades from "../components/Novedades/Novedades";
import CategoriaTypos from "../components/CategoriaTypos/Categoria";
import Calidad from "../components/Calidad/Calidad";
import Footer from "../components/Footer/Footer";
import "./Router.css"; // Asegúrate de tener este archivo CSS con los estilos necesarios


const Inicio = () => {
  return (
    <>
      <Header />
      <HeroSection />
      <Novedades />
      <CategoriaTypos />
      <Calidad />
      <Footer />
    </>
  );
};

export default Inicio;
