import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';

const Login = () => {
  const [formData, setFormData] = useState({
    correo: '',
    contrasena: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Enviando datos de login:', formData);
      console.log('URL de API:', `${import.meta.env.VITE_API_URL}/endpoints/login.php`);
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/endpoints/login.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      console.log('Respuesta del servidor:', response.status, response.statusText);
      
      // Obtener el texto de la respuesta para debug
      const responseText = await response.text();
      console.log('Contenido de la respuesta:', responseText);

      // Intentar parsear como JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Error al parsear JSON:', parseError);
        throw new Error('El servidor devolvió una respuesta inválida. Revisa la consola para más detalles.');
      }

      if (!response.ok) {
        throw new Error(data.message || 'Error en la autenticación');
      }

      // Guarda el token recibido (puede ser data.token o data.usuario.token, depende tu API)
      localStorage.setItem('authToken', data.token || JSON.stringify(data.usuario));

      // Redirige al dashboard
      navigate('/dashboard');

    } catch (err) {
      console.error('Error completo de login:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="logo-login">
          <h1>STRONG</h1>
          <p>Calzado de Seguridad Industrial</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}

          <div className="input-group">
            <label htmlFor="correo">Correo electrónico</label>
            <input
              type="email"
              id="correo"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="contrasena">Contraseña</label>
            <input
              type="password"
              id="contrasena"
              name="contrasena"
              value={formData.contrasena}
              onChange={handleChange}
              required
            />
          </div>

          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Cargando...' : 'Iniciar Sesión'}
          </button>
           <button 
              type="button"
              className="cancel-button"
              onClick={() => navigate('/')}
            >
              Cancelar
            </button>

        </form>
      </div>
    </div>
  );
};

export default Login;
