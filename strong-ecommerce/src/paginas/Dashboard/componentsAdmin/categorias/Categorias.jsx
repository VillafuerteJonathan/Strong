import { useState, useEffect } from "react";
import Axios from "axios";
import Swal from "sweetalert2";
import "./Categorias.css";

function CategoriasCRUD() {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    imagen: null,
  });
  const [categorias, setCategorias] = useState([]);
  const [editar, setEditar] = useState(false);
  const [id, setId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [imagenPreview, setImagenPreview] = useState(null);
  const [categoriaActual, setCategoriaActual] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  const limpiarCampos = () => {
    setFormData({
      nombre: "",
      descripcion: "",
      imagen: null,
    });
    setImagenPreview(null);
    setEditar(false);
    setId(null);
    setCategoriaActual(null);
    setModalVisible(false);
  };

  const getListado = () => {
    Axios.get("http://localhost/ecommerce-backend/endpoints/categorias.php")
      .then((response) => setCategorias(response.data))
      .catch(() =>
        Swal.fire({
          icon: "error",
          title: "Error al obtener categorías",
          text: "Verifica que el backend esté activo",
        })
      );
  };

  const add = () => {
    if (
      !formData.nombre.trim() ||
      !formData.descripcion.trim() ||
      !formData.imagen
    ) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Completa todos los campos",
      });
      return;
    }

    const data = new FormData();
    data.append("action", "create"); // Acción para backend
    data.append("nombre", formData.nombre.trim());
    data.append("descripcion", formData.descripcion.trim());
    data.append("imagen", formData.imagen);

    Axios.post(
      "http://localhost/ecommerce-backend/endpoints/categorias.php",
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    )
      .then(() => {
        getListado();
        limpiarCampos();
        Swal.fire("¡Guardado!", "Categoría registrada", "success");
      })
      .catch((error) => {
        console.error(error);
        Swal.fire("Error", "Error al registrar categoría", "error");
      });
  };

  const update = () => {
    if (!formData.nombre.trim() || !formData.descripcion.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Nombre y descripción son obligatorios",
      });
      return;
    }

    const data = new FormData();
    data.append("action", "update"); // Acción para backend
    data.append("id", id);
    data.append("nombre", formData.nombre.trim());
    data.append("descripcion", formData.descripcion.trim());
    if (formData.imagen) {
      data.append("imagen", formData.imagen);
    }

    Axios.post(
      "http://localhost/ecommerce-backend/endpoints/categorias.php",
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    )
      .then(() => {
        getListado();
        limpiarCampos();
        Swal.fire("¡Actualizado!", "Categoría actualizada", "success");
      })
      .catch((error) => {
        console.error(error);
        Swal.fire("Error", "Error al actualizar", "error");
      });
  };

  const eliminar = (categoria) => {
    Swal.fire({
      title: `¿Eliminar ${categoria.nombre}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
    }).then((result) => {
      if (result.isConfirmed) {
        Axios.delete(
          `http://localhost/ecommerce-backend/endpoints/categorias.php?id=${categoria.id}`
        )
          .then(() => {
            getListado();
            Swal.fire("Eliminada", "Categoría eliminada", "success");
          })
          .catch(() => Swal.fire("Error", "No se pudo eliminar", "error"));
      }
    });
  };

  const editarCategoria = (categoria) => {
    setEditar(true);
    setId(categoria.id);
    setCategoriaActual(categoria);
    setFormData({
      nombre: categoria.nombre || "",
      descripcion: categoria.descripcion || "",
      imagen: null,
    });
    setImagenPreview(null);
    setModalVisible(true);
  };

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onChangeImagen = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, imagen: file }));
    if (file) {
      setImagenPreview(URL.createObjectURL(file));
    } else {
      setImagenPreview(null);
    }
  };

  useEffect(() => {
    getListado();
  }, []);

  const categoriasFiltradas = categorias.filter((cat) =>
    cat.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="categorias-container">
      <div className="categorias-header">
        <h3>Gestión de Categorías</h3>
        <div className="categorias-actions">
          <input
            type="text"
            placeholder="Buscar por nombre..."
            className="search-input"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <button className="btn-add" onClick={() => setModalVisible(true)}>
            + Nueva Categoría
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="categorias-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Imagen</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categoriasFiltradas.length > 0 ? (
              categoriasFiltradas.map((categoria) => (
                <tr key={categoria.id}>
                  <td>{categoria.id}</td>
                  <td>{categoria.nombre}</td>
                  <td>
                    {categoria.imagen_url ? (
                      <img
                        src={`http://localhost/ecommerce-backend/public/${categoria.imagen_url}`}
                        className="categoria-img"
                        alt={categoria.nombre}
                      />
                    ) : (
                      "Sin imagen"
                    )}
                  </td>
                  <td>{categoria.descripcion}</td>
                  <td className="actions-cell">
                    <button
                      className="btn-edit"
                      onClick={() => editarCategoria(categoria)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => eliminar(categoria)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                  No hay categorías que coincidan con la búsqueda
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalVisible && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h4>{editar ? "Editar Categoría" : "Nueva Categoría"}</h4>
              <button className="close-btn" onClick={limpiarCampos}>
                &times;
              </button>
            </div>

            <div>
              <div className="form-group">
                <label>Nombre*</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={onChangeInput}
                  required
                />
              </div>
            <div className="form-group">
  <label>Descripción*</label>
  <textarea
    name="descripcion"
    value={formData.descripcion}
    onChange={onChangeInput}
    required
  ></textarea>
</div>

<div className="form-group">
  <label>Imagen {editar ? "(opcional)" : "*"}</label>
  
  <div className="custom-file-upload">
    <label htmlFor="fileUpload">Seleccionar imagen</label>
    <input
      id="fileUpload"
      type="file"
      accept="image/*"
      onChange={onChangeImagen}
      required={!editar}
    />
  </div>

  {imagenPreview && (
    <img
      src={imagenPreview}
      alt="Vista previa"
      className="preview-img"
    />
  )}

  {!imagenPreview && editar && categoriaActual?.imagen_url && (
    <img
      src={`http://localhost/ecommerce-backend/public/${categoriaActual.imagen_url}`}
      alt="Imagen actual"
      className="preview-img"
    />
  )}
</div>
</div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={limpiarCampos}>
                Cancelar
              </button>
              <button className="btn-save" onClick={editar ? update : add}>
                {editar ? "Actualizar" : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CategoriasCRUD;
