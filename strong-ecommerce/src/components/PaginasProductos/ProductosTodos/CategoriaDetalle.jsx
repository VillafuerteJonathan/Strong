import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import "./CategoriaDetalle.css";

const CategoriaDetalle = () => {
  const { nombre, categoria_id } = useParams(); 
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  const IMAGEN_BASE_URL = "http://localhost/ecommerce-backend/public/"; // Ajusta según tu ruta real

  useEffect(() => {
    const fetchProductos = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/endpoints/DetalleProductos.php?categoria_id=${categoria_id}`
        );
        const data = await response.json();
        setProductos(data);
      } catch (error) {
        console.error("Error al cargar productos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, [categoria_id]);

  if (loading) return <div className="loading-message">Cargando productos...</div>;

  const productosFiltrados =
    nombre === "Todos"
      ? productos
      : productos.filter((p) => p.categoria === nombre);

  return (
    <div className="categoria-detalle-container">
      <div className="categoria-header">
        <h2 className="categoria-title">
          {nombre === "Todos" ? "Todos los productos" : `Categoría: ${nombre}`}
        </h2>
      </div>

      <div className="productos-grid">
        {productosFiltrados.map((prod) => (
          <div key={prod.id} className="producto-card">
            <img
              src={IMAGEN_BASE_URL + (prod.imagen_principal || prod.imagen_url)}
              alt={prod.nombre}
              className="producto-img"
            />
            <h3 className="producto-nombre">{prod.nombre}</h3>
            <p className="producto-descripcion">{prod.descripcion}</p>
            <p className="producto-precio">${prod.precio}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriaDetalle;
