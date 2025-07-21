import React, { useState, useEffect } from 'react';
import './ImagenesModal.css';

function ImagenesModal({ producto, onClose }) {
  const [imagenes, setImagenes] = useState([]);
  const [editando, setEditando] = useState(null);
  const [nuevaImagen, setNuevaImagen] = useState(null);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    cargarImagenes();
  }, [producto]);

  const cargarImagenes = () => {
    fetch(`http://localhost/ecommerce-backend/endpoints/imagenes_producto.php?producto_id=${producto.id}`)
      .then(res => res.json())
      .then(data => setImagenes(data || []));
  };

  const handleEditar = (imagen) => {
    setEditando(imagen);
    setNuevaImagen(null);
  };

  const handleCancelarEdicion = () => {
    setEditando(null);
    setNuevaImagen(null);
  };

  const handleFileChange = (e) => {
    setNuevaImagen(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);

    const formData = new FormData();
    formData.append('producto_id', producto.id);
    formData.append('angulo', editando.angulo);
    if (nuevaImagen) {
      formData.append('imagen', nuevaImagen);
    }

    try {
      const response = await fetch(
        `http://localhost/ecommerce-backend/endpoints/imagenes_producto.php?id=${editando.id}`,
        {
          method: 'PUT',
          body: formData
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert('Imagen actualizada correctamente');
        cargarImagenes();
        setEditando(null);
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al actualizar la imagen');
    } finally {
      setCargando(false);
    }
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta imagen?')) {
      try {
        const response = await fetch(
          `http://localhost/ecommerce-backend/endpoints/imagenes_producto.php?id=${id}`,
          { method: 'DELETE' }
        );

        const data = await response.json();

        if (response.ok) {
          alert('Imagen eliminada correctamente');
          cargarImagenes();
        } else {
          alert(`Error: ${data.message}`);
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar la imagen');
      }
    }
  };

  return (
    <div className="modal-overlay">
      <div className="imagenes-modal">
        <div className="modal-header">
          <h2>Imágenes adicionales de {producto.nombre}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
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
                imagenes.map(img => (
                  editando?.id === img.id ? (
                    <tr key={img.id} className="editing-row">
                      <td>{img.angulo}</td>
                      <td>
                        <form onSubmit={handleSubmit} className="editar-form">
                          <label className="file-input-label">
                            {nuevaImagen?.name || 'Seleccionar nueva imagen'}
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleFileChange}
                              className="file-input"
                              required
                            />
                          </label>
                        </form>
                      </td>
                      <td>
                        <div className="form-actions">
                          <button
                            type="button"
                            onClick={handleCancelarEdicion}
                            className="btn btn-cancel"
                            disabled={cargando}
                          >
                            Cancelar
                          </button>
                          <button
                            type="submit"
                            className="btn btn-save"
                            disabled={cargando || !nuevaImagen}
                            onClick={handleSubmit}
                          >
                            {cargando ? 'Guardando...' : 'Guardar'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <tr key={img.id}>
                      <td className="angulo">{img.angulo}</td>
                      <td>
                        <img
                          src={`http://localhost/ecommerce-backend/public/${img.url}`}
                          alt={img.angulo}
                          className="imagen-preview"
                        />
                      </td>
                      <td>
                        <div className="imagen-actions">
                          <button
                            onClick={() => handleEditar(img)}
                            className="btn btn-edit"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleEliminar(img.id)}
                            className="btn btn-delete"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-close">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ImagenesModal;