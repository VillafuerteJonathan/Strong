import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  // Verifica si el usuario está autenticado
  const isAuthenticated = localStorage.getItem('authToken') !== null;
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;