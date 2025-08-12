import React, { useState, useEffect } from 'react';
import './Productos.css';
import MaterialesModal from './MaterialesModal';
import ImagenesModal from './ImagenesModal';

const initialProductState = {
  nombre: '',
  descripcion: '',
  precio: '',
  categoria_id: '',
  disponible: true,
  talla_desde: '',
  talla_hasta: '',
  material: '',
  suela: '',
  forro: '',
  puntera: '',
  plantilla: '',
  imagen_principal: null,
  imagen_superior: null,
  imagen_planta: null,
  imagen_lateral: null,
  // Previews
  imagen_principal_preview: null,
  imagen_superior_preview: null,
  imagen_planta_preview: null,
  imagen_lateral_preview: null
};

function Productos() {
  // State management
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [materialesProducto, setMaterialesProducto] = useState(null);
  const [imagenesProducto, setImagenesProducto] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [editarProducto, setEditarProducto] = useState(null);
  const [nuevoProducto, setNuevoProducto] = useState({ ...initialProductState });

  // API endpoints
  const API_URL = 'http://localhost/ecommerce-backend/endpoints';
  
  // Load data on component mount
  useEffect(() => {
    cargarProductos();
    cargarCategorias();
  }, []);

  // Filter products based on search
  useEffect(() => {
    if (busqueda === '') {
      setProductosFiltrados(productos);
    } else {
      const filtrados = productos.filter(producto =>
        producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
      );
      setProductosFiltrados(filtrados);
    }
  }, [busqueda, productos]);

  // Data fetching functions
  const cargarProductos = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/productos.php`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      
      const productosConImgsArray = data.map(p => ({
        ...p,
        imagenes_adicionales: p.imagenes_adicionales
          ? p.imagenes_adicionales.split(',').map(url => url.trim())
          : []
      }));
      
      setProductos(productosConImgsArray);
      setProductosFiltrados(productosConImgsArray);
    } catch (err) {
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  const cargarCategorias = async () => {
    try {
      const response = await fetch(`${API_URL}/categorias.php`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      setCategorias(data);
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  };

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'file') {
      if (files && files[0]) {
        const previewUrl = URL.createObjectURL(files[0]);
        setNuevoProducto(prev => ({
          ...prev,
          [name]: files[0],
          [`${name}_preview`]: previewUrl
        }));
      }
    } else if (type === 'checkbox') {
      setNuevoProducto(prev => ({ ...prev, [name]: checked }));
    } else {
      setNuevoProducto(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleEditarChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditarProducto(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRemoveImage = (fieldName) => {
    if (nuevoProducto[`${fieldName}_preview`]) {
      URL.revokeObjectURL(nuevoProducto[`${fieldName}_preview`]);
    }
    
    setNuevoProducto(prev => ({
      ...prev,
      [fieldName]: null,
      [`${fieldName}_preview`]: null
    }));
  };

  // Product CRUD operations
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    // Add product data
    Object.keys(nuevoProducto).forEach(key => {
      if (!key.includes('_preview') && key !== 'imagen_principal' && 
          key !== 'imagen_superior' && key !== 'imagen_planta' && key !== 'imagen_lateral') {
        formData.append(key, nuevoProducto[key]);
      }
    });
    
    // Add images
    if (nuevoProducto.imagen_principal) formData.append('imagen_principal', nuevoProducto.imagen_principal);
    if (nuevoProducto.imagen_superior) formData.append('imagen_superior', nuevoProducto.imagen_superior);
    if (nuevoProducto.imagen_planta) formData.append('imagen_planta', nuevoProducto.imagen_planta);
    if (nuevoProducto.imagen_lateral) formData.append('imagen_lateral', nuevoProducto.imagen_lateral);

    try {
      const response = await fetch(`${API_URL}/productos.php`, {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      
      if (response.ok) {
        alert('Producto creado exitosamente');
        cargarProductos();
        setMostrarFormulario(false);
        resetFormulario();
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al crear el producto');
    }
  };

  const handleEditarSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    
    // Add editable fields
    Object.keys(editarProducto).forEach(key => {
      if (key !== 'id' && !key.includes('_preview') && key !== 'imagen_principal') {
        formData.append(key, editarProducto[key]);
      }
    });

    // Handle image updates
    if (!(editarProducto.imagen_principal instanceof File) && editarProducto.imagen_principal) {
      formData.append('imagen_principal', editarProducto.imagen_principal);
    } else if (editarProducto.imagen_principal instanceof File) {
      formData.append('imagen_principal', editarProducto.imagen_principal);
    }

    // Add product ID
    formData.append('id', editarProducto.id);

    try {
      const response = await fetch(`${API_URL}/productos.php`, {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      
      if (response.ok) {
        alert('Producto actualizado exitosamente');
        cargarProductos();
        setEditarProducto(null);
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al actualizar el producto');
    }
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        const response = await fetch(`${API_URL}/productos.php?id=${id}`, {
          method: 'DELETE'
        });
        const data = await response.json();
        
        if (response.ok) {
          alert('Producto eliminado exitosamente');
          cargarProductos();
        } else {
          alert(`Error: ${data.message}`);
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar el producto');
      }
    }
  };

  // Helper functions
  const resetFormulario = () => {
    // Clean up object URLs
    ['imagen_principal', 'imagen_superior', 'imagen_planta', 'imagen_lateral'].forEach(field => {
      if (nuevoProducto[`${field}_preview`]) {
        URL.revokeObjectURL(nuevoProducto[`${field}_preview`]);
      }
    });

    setNuevoProducto({ ...initialProductState });
  };

  const abrirMateriales = (producto) => setMaterialesProducto(producto);
  const abrirImagenes = (producto) => setImagenesProducto(producto);
  const cerrarModales = () => {
    setMaterialesProducto(null);
    setImagenesProducto(null);
  };

  const handleBusquedaChange = (e) => setBusqueda(e.target.value);

  const handleEditarClick = (producto) => {
    setEditarProducto({
      ...producto,
      imagen_principal: producto.imagen_principal,
      imagen_principal_preview: null,
      disponible: producto.disponible === 1 || producto.disponible === true
    });
  };

  const handleCerrarEdicion = () => {
    if (editarProducto?.imagen_principal_preview) {
      URL.revokeObjectURL(editarProducto.imagen_principal_preview);
    }
    setEditarProducto(null);
  };

  // Render loading or error states
  if (loading) return <p>Cargando productos...</p>;
  if (!Array.isArray(productos)) return <p>Error al cargar productos</p>;

  return (
    <div className="productos-container">
      {/* Search and Add Product Header */}
      <div className="header-productos">
      <h2>Gestión de Productos</h2>
      <div className='categorias-actions'>
        <div className="buscador-container">
          <input
            type="text"
            placeholder="Buscar productos por nombre..."
            value={busqueda}
            onChange={handleBusquedaChange}
            className="buscador-input"
          />
        </div>
        </div>
        
        <button 
          onClick={() => setMostrarFormulario(true)} 
          className="btn btn-nuevo"
        >
          + Nuevo Producto
        </button>
      </div>

      {/* Add Product Modal */}
      {mostrarFormulario && (
        <div className="modal-formulario">
          <div className="modal-contenido">
            <h2>Agregar Nuevo Zapato</h2>
            <button 
              onClick={() => {
                setMostrarFormulario(false);
                resetFormulario();
              }} 
              className="btn-cerrar"
            >
              ×
            </button>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nombre:</label>
                <input
                  type="text"
                  name="nombre"
                  value={nuevoProducto.nombre}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Descripción:</label>
                <textarea
                  name="descripcion"
                  value={nuevoProducto.descripcion}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Precio:</label>
                <input
                  type="number"
                  name="precio"
                  value={nuevoProducto.precio}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Categoría:</label>
                <select
                  name="categoria_id"
                  value={nuevoProducto.categoria_id}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Seleccione una categoría</option>
                  {categorias.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group-row">
                <div className="form-group">
                  <label>Talla Desde:</label>
                  <input
                    type="number"
                    name="talla_desde"
                    value={nuevoProducto.talla_desde}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Talla Hasta:</label>
                  <input
                    type="number"
                    name="talla_hasta"
                    value={nuevoProducto.talla_hasta}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <div className="checkbox-container">
                  <label className="checkbox-label">
                    Disponible
                    <input
                      type="checkbox"
                      name="disponible"
                      checked={nuevoProducto.disponible}
                      onChange={handleInputChange}
                    />
                  </label>
                </div>
              </div>

              <h3>Materiales</h3>
              <div className="form-group">
                <label>Material principal:</label>
                <input
                  type="text"
                  name="material"
                  value={nuevoProducto.material}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Suela:</label>
                <input
                  type="text"
                  name="suela"
                  value={nuevoProducto.suela}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Forro:</label>
                <input
                  type="text"
                  name="forro"
                  value={nuevoProducto.forro}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Puntera:</label>
                <input
                  type="text"
                  name="puntera"
                  value={nuevoProducto.puntera}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-group">
                <label>Plantilla:</label>
                <input
                  type="text"
                  name="plantilla"
                  value={nuevoProducto.plantilla}
                  onChange={handleInputChange}
                />
              </div>

              <h3>Imágenes del Producto</h3>
              <div className="imagenes-form-group">
                {/* Main Image */}
                <div className="imagen-input-container">
                  <label>Imagen Principal:</label>
                  <label className="file-input-label">
                    {nuevoProducto.imagen_principal?.name || 'Seleccionar archivo'}
                    <input
                      type="file"
                      name="imagen_principal"
                      onChange={handleInputChange}
                      accept="image/*"
                      required
                      className="file-input"
                    />
                  </label>
                  {nuevoProducto.imagen_principal_preview && (
                    <div className="preview-container">
                      <img 
                        src={nuevoProducto.imagen_principal_preview} 
                        alt="Vista previa imagen principal" 
                        className="preview-img"
                      />
                      <button 
                        type="button" 
                        className="remove-img-btn"
                        onClick={() => handleRemoveImage('imagen_principal')}
                      >
                        Eliminar Imagen
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Top Image */}
                <div className="imagen-input-container">
                  <label>Imagen Superior:</label>
                  <label className="file-input-label">
                    {nuevoProducto.imagen_superior?.name || 'Seleccionar archivo'}
                    <input
                      type="file"
                      name="imagen_superior"
                      onChange={handleInputChange}
                      accept="image/*"
                      required
                      className="file-input"
                    />
                  </label>
                  {nuevoProducto.imagen_superior_preview && (
                    <div className="preview-container">
                      <img 
                        src={nuevoProducto.imagen_superior_preview} 
                        alt="Vista previa imagen superior" 
                        className="preview-img"
                      />
                      <button 
                        type="button" 
                        className="remove-img-btn"
                        onClick={() => handleRemoveImage('imagen_superior')}
                      >
                        Eliminar Imagen
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Bottom Image */}
                <div className="imagen-input-container">
                  <label>Imagen Planta:</label>
                  <label className="file-input-label">
                    {nuevoProducto.imagen_planta?.name || 'Seleccionar archivo'}
                    <input
                      type="file"
                      name="imagen_planta"
                      onChange={handleInputChange}
                      accept="image/*"
                      required
                      className="file-input"
                    />
                  </label>
                  {nuevoProducto.imagen_planta_preview && (
                    <div className="preview-container">
                      <img 
                        src={nuevoProducto.imagen_planta_preview} 
                        alt="Vista previa imagen planta" 
                        className="preview-img"
                      />
                      <button 
                        type="button" 
                        className="remove-img-btn"
                        onClick={() => handleRemoveImage('imagen_planta')}
                      >
                        Eliminar Imagen
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Side Image */}
                <div className="imagen-input-container">
                  <label>Imagen Lateral:</label>
                  <label className="file-input-label">
                    {nuevoProducto.imagen_lateral?.name || 'Seleccionar archivo'}
                    <input
                      type="file"
                      name="imagen_lateral"
                      onChange={handleInputChange}
                      accept="image/*"
                      required
                      className="file-input"
                    />
                  </label>
                  {nuevoProducto.imagen_lateral_preview && (
                    <div className="preview-container">
                      <img 
                        src={nuevoProducto.imagen_lateral_preview} 
                        alt="Vista previa imagen lateral" 
                        className="preview-img"
                      />
                      <button 
                        type="button" 
                        className="remove-img-btn"
                        onClick={() => handleRemoveImage('imagen_lateral')}
                      >
                        Eliminar Imagen
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="form-buttons">
                <button 
                  type="button" 
                  onClick={() => {
                    setMostrarFormulario(false);
                    resetFormulario();
                  }} 
                  className="btn btn-cancelar"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-guardar">
                  Guardar Producto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editarProducto && (
        <div className="modal-formulario">
          <div className="modal-contenido">
            <h2>Editar Producto</h2>
            <button 
              onClick={handleCerrarEdicion} 
              className="btn-cerrar"
            >
              ×
            </button>
            
            <form onSubmit={handleEditarSubmit}>
              <div className="form-group">
                <label>Nombre:</label>
                <input
                  type="text"
                  name="nombre"
                  value={editarProducto.nombre}
                  onChange={handleEditarChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Descripción:</label>
                <textarea
                  name="descripcion"
                  value={editarProducto.descripcion}
                  onChange={handleEditarChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Precio:</label>
                <input
                  type="number"
                  name="precio"
                  value={editarProducto.precio}
                  onChange={handleEditarChange}
                  step="0.01"
                  min="0"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Categoría:</label>
                <select
                  name="categoria_id"
                  value={editarProducto.categoria_id}
                  onChange={handleEditarChange}
                  required
                >
                  <option value="">Seleccione una categoría</option>
                  {categorias.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group-row">
                <div className="form-group">
                  <label>Talla Desde:</label>
                  <input
                    type="number"
                    name="talla_desde"
                    value={editarProducto.talla_desde}
                    onChange={handleEditarChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Talla Hasta:</label>
                  <input
                    type="number"
                    name="talla_hasta"
                    value={editarProducto.talla_hasta}
                    onChange={handleEditarChange}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    name="disponible"
                    checked={editarProducto.disponible}
                    onChange={handleEditarChange}
                  />
                  Disponible
                </label>
              </div>

              <h3>Imagen Principal</h3>
              <div className="imagen-input-container">
                <label>Cambiar Imagen Principal:</label>
                <label className="file-input-label">
                  {editarProducto.imagen_principal instanceof File 
                    ? editarProducto.imagen_principal.name 
                    : 'Seleccionar nueva imagen'}
                  <input
                    type="file"
                    name="imagen_principal"
                    onChange={(e) => {
                      if (e.target.files[0]) {
                        setEditarProducto(prev => ({
                          ...prev,
                          imagen_principal: e.target.files[0],
                          imagen_principal_preview: URL.createObjectURL(e.target.files[0])
                        }));
                      }
                    }}
                    accept="image/*"
                    className="file-input"
                  />
                </label>
                {editarProducto.imagen_principal_preview ? (
                  <div className="preview-container">
                    <img 
                      src={editarProducto.imagen_principal_preview} 
                      alt="Vista previa nueva imagen" 
                      className="preview-img"
                    />
                  </div>
                ) : (
                  editarProducto.imagen_principal && !(editarProducto.imagen_principal instanceof File) && (
                    <div className="preview-container">
                      <img 
                        src={`http://localhost/ecommerce-backend/public/${editarProducto.imagen_principal}`} 
                        alt="Imagen actual" 
                        className="preview-img"
                      />
                    </div>
                  )
                )}
              </div>
              
              <div className="form-buttons">
                <button 
                  type="button" 
                  onClick={handleCerrarEdicion} 
                  className="btn btn-cancelar"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-guardar">
                  Actualizar Producto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Products Table */}
      <table className="productos-table">
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Tallas</th>
            <th>Disponible</th>
            <th>Ediciones</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productosFiltrados.map(prod => (
            <tr key={prod.id}>
              <td>
                {prod.imagen_principal && (
                  <img
                    src={`http://localhost/ecommerce-backend/public/${prod.imagen_principal}`}
                    alt={prod.nombre}
                    className="imagen-tabla"
                  />
                )}
              </td>
              <td>{prod.nombre}</td>
              <td>${parseFloat(prod.precio).toFixed(2)}</td>
              <td>{prod.talla_desde}-{prod.talla_hasta}</td>
              <td>{prod.disponible ? 'Sí' : 'No'}</td>
              <td>
                <div className="ediciones-container">
                  <button onClick={() => abrirMateriales(prod)} className="btn btn-edit">
                    Materiales
                  </button>
                  <button onClick={() => abrirImagenes(prod)} className="btn btn-edit">
                    Imágenes
                  </button>
                </div>
              </td>
              <td>
                <div className="acciones-container">
                  <button 
                    onClick={() => handleEditarClick(prod)} 
                    className="btn btn-primary"
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => handleEliminar(prod.id)} 
                    className="btn btn-danger"
                  >
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {productosFiltrados.length === 0 && !loading && (
        <p className="no-resultados">No se encontraron productos que coincidan con la búsqueda.</p>
      )}

      {/* Material and Image Modals */}
      {materialesProducto && (
        <MaterialesModal producto={materialesProducto} onClose={cerrarModales} />
      )}

      {imagenesProducto && (
        <ImagenesModal producto={imagenesProducto} onClose={cerrarModales} />
      )}
    </div>
  );
}

export default Productos;