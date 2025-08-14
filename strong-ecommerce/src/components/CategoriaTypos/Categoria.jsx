import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Categoria.css";

const ProductTypes = () => {
  const [productTypes, setProductTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/endpoints/categorias.php`)
      .then((res) => res.json())
      .then((data) => setProductTypes(data))
      .catch((err) => console.error("Error cargando categorías:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-message">Cargando categorías...</div>;

  return (
    <section className="product-section" id="productos">
      <div className="container">
        <div className="section-title">
          <h2>Tipos de Productos</h2>
          <p>
            Ofrecemos una amplia gama de calzado de seguridad diseñado para diferentes
            industrias y necesidades específicas de protección.
          </p>
        </div>

        <div className="card-grid">
          {productTypes.map((product) => (
            <div
              key={product.id}
              className="category-card"
              onClick={() => navigate(`/categoria/${product.id}/${product.nombre}`)}
            >
              <div className="image-wrapper">
                <img
                  src={`http://localhost/ecommerce-backend/public/${product.imagen_url}`}
                  alt={product.nombre}
                />
              </div>
              <div className="category-overlay">
                <h3>{product.nombre}</h3>
                <p>{product.descripcion}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductTypes;
