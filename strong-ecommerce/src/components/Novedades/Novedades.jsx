import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Novedades.css";

const Novedades = () => {
  const [productos, setProductos] = useState([]);
  const IMAGEN_BASE_URL = "http://localhost/ecommerce-backend/public/";
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNovedades = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/endpoints/Novedades.php?limite=6`
        );
        const data = await response.json();
        setProductos(data);
      } catch (error) {
        console.error("Error al cargar novedades:", error);
      }
    };

    fetchNovedades();
  }, []);

  if (!productos.length)
    return <div className="loading-message">Cargando novedades...</div>;

  const handleClick = (id) => {
    navigate(`/producto/${id}`);
  };

  return (
    <section className="novedades-section">
      <h2 className="novedades-title">PRODUCTOS RECIENTES</h2>
      <p className="novedades-subtitle">
        Descubre nuestros productos más recientes y exclusivos. ¡Lo último en
        nuestra colección!
      </p>

      <div className="novedades-slider">
        <div className="slider-track">
          {[...productos, ...productos].map((prod, idx) => (
            <div
              key={prod.id + "-" + idx}
              className="slide"
              onClick={() => handleClick(prod.id)}
              style={{ cursor: "pointer" }}
            >
              <span className="nuevo-badge">Nuevo</span>
              <img
                src={IMAGEN_BASE_URL + (prod.imagen_principal || prod.imagen_url)}
                alt={prod.nombre}
                className="slide-img"
              />
              <h3 className="slide-nombre">{prod.nombre}</h3>
              <p className="slide-precio">${prod.precio}</p>
              <p className="slide-descripcion">{prod.descripcion}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Novedades;
