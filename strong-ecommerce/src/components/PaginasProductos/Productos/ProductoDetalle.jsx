import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./ProductoDetalle.css";

const ProductoDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const IMAGEN_BASE_URL = "http://localhost/ecommerce-backend/public/";

  useEffect(() => {
    const fetchProducto = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost/ecommerce-backend/endpoints/producto.php?id=${id}`
        );
        const data = await res.json();

        // Combinar imagen_principal con las imágenes adicionales
        const imagenes = [];
        if (data.imagen_principal) {
          imagenes.push({ url: data.imagen_principal });
        }
        if (data.imagenes && data.imagenes.length > 0) {
          // Tomar máximo 3 imágenes adicionales
          imagenes.push(...data.imagenes.slice(0, 3));
        }
        data.imagenes = imagenes;

        setProducto(data);
      } catch (err) {
        console.error("Error al cargar producto:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducto();
  }, [id]);

  if (loading) return <p className="loading">Cargando producto...</p>;
  if (!producto) return <p className="loading">Producto no encontrado</p>;

  // Slider
  const handleNext = () => {
    if (!producto.imagenes || producto.imagenes.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % producto.imagenes.length);
  };

  const handlePrev = () => {
    if (!producto.imagenes || producto.imagenes.length === 0) return;
    setCurrentIndex(
      (prev) => (prev - 1 + producto.imagenes.length) % producto.imagenes.length
    );
  };

  const selectImage = (index) => {
    setCurrentIndex(index);
  };

  // Función para regresar
  const handleRegresar = () => {
    navigate(-1);
  };

  return (
    <div className="producto-detalle-wrapper">
      {/* Botón regresar */}
      <div className="regresar-wrapper">
        <button className="btn-regresar" onClick={handleRegresar}>
          ← Regresar
        </button>
      </div>

      <div className="producto-detalle-container">
        {/* IMÁGENES */}
        <div className="imagen-section">
          <div className="main-image">
            {producto.imagenes && producto.imagenes.length > 0 ? (
              <>
                <img
                  src={IMAGEN_BASE_URL + producto.imagenes[currentIndex].url}
                  alt={producto.nombre}
                />
                {producto.imagenes.length > 1 && (
                  <>
                    <button className="prev-btn" onClick={handlePrev}>
                      <ChevronLeft />
                    </button>
                    <button className="next-btn" onClick={handleNext}>
                      <ChevronRight />
                    </button>
                  </>
                )}
              </>
            ) : (
              <p>No hay imágenes disponibles</p>
            )}
          </div>

          <div className="thumbnails">
            {producto.imagenes &&
              producto.imagenes.map((img, index) => (
                <img
                  key={index}
                  src={IMAGEN_BASE_URL + img.url}
                  alt={`miniatura ${index}`}
                  className={currentIndex === index ? "thumb active" : "thumb"}
                  onClick={() => selectImage(index)}
                />
              ))}
          </div>
        </div>

        {/* INFORMACIÓN */}
        <div className="info-section">
          <div className="info-block nombre-block">
            <h1>{producto.nombre}</h1>
          </div>

          <div className="info-block precio-block">
            <p className="precio">Precio: ${producto.precio}</p>
          </div>

          <div className="info-block descripcion-block">
            <h3>Descripción:</h3>
            <p>{producto.descripcion}</p>
          </div>

          {producto.materiales && (
            <div className="info-block materiales-block">
              <h3>Materiales:</h3>
              <ul>
                <li><span className="titulo">Material:</span> {producto.materiales.material}</li>
                <li><span className="titulo">Suela:</span> {producto.materiales.suela}</li>
                <li><span className="titulo">Forro:</span> {producto.materiales.forro}</li>
                <li><span className="titulo">Puntera:</span> {producto.materiales.puntera}</li>
                <li><span className="titulo">Plantilla:</span> {producto.materiales.plantilla}</li>
              </ul>

            </div>
          )}

          {producto.tallas && (
            <div className="info-block tallas-block">
              <h3>Tallas disponibles:</h3>
              <p>
                {producto.tallas.talla_desde} - {producto.tallas.talla_hasta}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductoDetalle;
