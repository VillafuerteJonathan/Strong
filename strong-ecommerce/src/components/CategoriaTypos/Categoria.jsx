import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getApiUrl, getImageUrl, apiRequest, handleApiError } from "../../config/api";
import "./Categoria.css";

const ProductTypes = () => {
  const [productTypes, setProductTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCategorias = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await apiRequest(getApiUrl("categorias"));

        console.log("🔥 Respuesta del backend:", response);

        // Manejo inteligente de estructuras diferentes
        const categorias =
          (Array.isArray(response) && response) ||
          response?.data ||
          response?.categorias ||
          [];

        setProductTypes(categorias);
      } catch (err) {
        setError(handleApiError(err, "Error cargando categorías"));
        console.error("❌ Error cargando categorías:", err);
      } finally {
        setLoading(false);
      }
    };

    loadCategorias();
  }, []);

  if (loading) return <div className="loading-message">Cargando categorías...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <section className="product-section" id="productos">
      <div className="container">
        <div className="section-title">
          <h2>Tipos de Productos</h2>
          <p>
            Ofrecemos una amplia gama de calzado de seguridad diseñado para diferentes industrias
            y necesidades específicas de protección.
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
                  src={getImageUrl(product.imagen_url)}
                  alt={product.nombre}
                  onError={(e) => (e.target.src = "/placeholder-image.jpg")}
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
