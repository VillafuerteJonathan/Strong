import React, { useState, useEffect } from 'react';
import './ImagenesModal.css';

function ImagenesModal({ producto, onClose }) {
  const [imagenes, setImagenes] = useState([]);
  const [editando, setEditando] = useState(null);
  const [nuevaImagen, setNuevaImagen] = useState(null);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (producto && producto.id) {
      cargarImagenes();
    }
  }, [producto]);

  const cargarImagenes = () => {
    fetch(`http://localhost/ecommerce-backend/endpoints/imagenes_producto.php?producto_id=${producto.id}`)
      .then(res => res.json())
      .then(data => setImagenes(Array.isArray(data) ? data : []))
      .catch(err => {
        console.error('Error al cargar imágenes:', err);
        setImagenes([]);
      });
  };

  const handleEditar = (imagen) => {
    console.log('Imagen editando:', imagen);
    setEditando(imagen);
    setNuevaImagen(null);
  };

  const handleCancelarEdicion = () => {
    setEditando(null);
    setNuevaImagen(null);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNuevaImagen(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nuevaImagen) {
      alert('Por favor selecciona una nueva imagen');
      return;
    }

    // Validar que editando tenga los campos necesarios
    if (!editando || !editando.id || !editando.orden || !editando.angulo) {
      alert('Error interno: datos de imagen incompletos');
      return;
    }

    setCargando(true);

    const formData = new FormData();
    formData.append('action', 'update');
    formData.append('id', editando.id);
    formData.append('producto_id', producto.id);
    formData.append('orden', editando.orden);
    formData.append('angulo_actual', editando.angulo);
    formData.append('nuevo_angulo', editando.angulo); // Cambiar si quieres modificar el ángulo
    formData.append('imagen', nuevaImagen);

    try {
      const response = await fetch('http://localhost/ecommerce-backend/endpoints/imagenes_producto.php', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert('Imagen actualizada correctamente');
        cargarImagenes();
        setEditando(null);
        setNuevaImagen(null);
      } else {
        alert(`Error: ${data.message || 'Error desconocido'}`);
      }
    } catch (error) {
      console.error('Error al actualizar imagen:', error);
      alert('Error al actualizar la imagen');
    } finally {
      setCargando(false);
    }
  };

  

  return (
    <div className="modal-overlay">
      <div className="imagenes-modal">
        <div className="modal-header">
          <h2>Imágenes adicionales de {producto?.nombre || 'producto'}</h2>
          <button className="close-btn" onClick={onClose} aria-label="Cerrar modal">×</button>
        </div>

        <div className="table-container">
          <table className="imagenes-table">
            <thead>
              <tr>
                <th>Ángulo</th>
                <th>Vista Previa</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {imagenes.length === 0 ? (
                <tr>
                  <td colSpan="3" className="no-images">No hay imágenes adicionales</td>
                </tr>
              ) : (
                imagenes.map(img =>
                  editando?.id === img.id ? (
                    <tr key={img.id} className="editing-row">
                      <td>{img.angulo}</td>
                      <td>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          disabled={cargando}
                        />
                        {nuevaImagen && <p>{nuevaImagen.name}</p>}
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={handleCancelarEdicion}
                          disabled={cargando}
                          className="btn btn-cancel"
                        >
                          Cancelar
                        </button>
                        <button
                          type="button"
                          onClick={handleSubmit}
                          disabled={cargando || !nuevaImagen}
                          className="btn btn-save"
                        >
                          {cargando ? 'Guardando...' : 'Guardar'}
                        </button>
                      </td>
                    </tr>
                  ) : (
                    <tr key={img.id}>
                      <td className="angulo">{img.angulo}</td>
                      <td>
                        <img
                          src={`http://localhost/ecommerce-backend/public/${img.url}`}
                          alt={`Ángulo ${img.angulo}`}
                          className="imagen-preview"
                          loading="lazy"
                        />
                      </td>
                      <td>
                        <button onClick={() => handleEditar(img)} className="btn btn-edit">Editar</button>
    
                      </td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </table>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-close">Cerrar</button>
        </div>
      </div>
    </div>
  );
}

export default ImagenesModal;
