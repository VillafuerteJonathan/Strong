// Configuración centralizada de la API
const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost/ecommerce-backend',
  ENDPOINTS: {
    categorias: '/endpoints/categorias.php',
    productos: '/endpoints/DetalleProductos.php',
    materiales: '/endpoints/materiales.php',
    login: '/endpoints/login.php',
  },
  IMAGES: {
    BASE_URL: import.meta.env.VITE_IMAGES_URL || 'http://localhost/ecommerce-backend/public/',
  }
};

// Funciones utilitarias para construir URLs
export const getApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS[endpoint]}`;
};

export const getImageUrl = (imagePath) => {
  if (!imagePath) return '/placeholder-image.jpg';
  return `${API_CONFIG.IMAGES.BASE_URL}${imagePath}`;
};

// Función para manejar errores de API de forma consistente
export const handleApiError = (error, defaultMessage = 'Error en la operación') => {
  console.error('API Error:', error);
  return error.message || defaultMessage;
};

// Función para hacer fetch con configuración estándar
export const apiRequest = async (url, options = {}) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export default API_CONFIG;
