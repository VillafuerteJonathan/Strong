import React, { useState, useEffect } from 'react';
import './MaterialesModal.css';
function MaterialesModal({ producto, onClose }) {
  const [materiales, setMateriales] = useState(null);
  const [editando, setEditando] = useState(false);
  const [formData, setFormData] = useState({
    material: '',
    suela: '',
    forro: '',
    puntera: '',
    plantilla: '',
  });

  useEffect(() => {
    fetch(`http://localhost/ecommerce-backend/endpoints/materiales.php?producto_id=${producto.id}`)
      .then(res => res.json())
      .then(data => {
        setMateriales(data);
        if (data) {
          setFormData({
            material: data.material || '',
            suela: data.suela || '',
            forro: data.forro || '',
            puntera: data.puntera || '',
            plantilla: data.plantilla || '',
          });
        }
      });
  }, [producto]);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleEditarClick = () => {
    setEditando(true);
  };

  const handleGuardar = () => {
    fetch('http://localhost/ecommerce-backend/endpoints/materiales.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        producto_id: producto.id,
        ...formData
      })
    }).then(res => res.json())
      .then(data => {
        alert(data.message || 'Materiales actualizados');
        setMateriales({...formData}); // Actualizar localmente
        setEditando(false);
      }).catch(() => alert('Error al actualizar materiales'));
  };

  if (!materiales) return <p>Cargando materiales...</p>;

  return (
    <div className="modal">
      <h2>Materiales de {producto.nombre}</h2>
      <table className="materiales-table">
        <thead>
          <tr>
            <th>Material</th>
            <th>Suela</th>
            <th>Forro</th>
            <th>Puntera</th>
            <th>Plantilla</th>
            <th>Editar</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              {editando ? (
                <input name="material" value={formData.material} onChange={handleChange} />
              ) : (
                materiales.material
              )}
            </td>
            <td>
              {editando ? (
                <input name="suela" value={formData.suela} onChange={handleChange} />
              ) : (
                materiales.suela
              )}
            </td>
            <td>
              {editando ? (
                <input name="forro" value={formData.forro} onChange={handleChange} />
              ) : (
                materiales.forro
              )}
            </td>
            <td>
              {editando ? (
                <input name="puntera" value={formData.puntera} onChange={handleChange} />
              ) : (
                materiales.puntera
              )}
            </td>
            <td>
              {editando ? (
                <input name="plantilla" value={formData.plantilla} onChange={handleChange} />
              ) : (
                materiales.plantilla
              )}
            </td>
            <td>
              {editando ? (
                <>
                  <button onClick={handleGuardar}>Guardar</button>
                  <button onClick={() => setEditando(false)}>Cancelar</button>
                </>
              ) : (
                <button onClick={handleEditarClick}>Editar</button>
              )}
            </td>
          </tr>
        </tbody>
      </table>
      <button onClick={onClose} className="btn-close">Cerrar</button>
    </div>
  );
}

export default MaterialesModal;
