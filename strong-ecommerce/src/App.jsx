import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import HeroSection from './components/HeroSection/HeroSection';
import CategoriaTypos from './components/CategoriaTypos/categoria'
import Login from './paginas/Login/AdminLogin'; // Asegúrate de crear esta ruta
import PrivateRoute from './components/PrivateRoute/PrivateRoute'; // Componente nuevo
import AdminPanel from './paginas/Dashboard/AdminPanel'; // Opcional: para el área admin
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta pública principal */}
        <Route path="/" element={
          <>
            <Header />
            <HeroSection />
            <CategoriaTypos />
          </>
        } />
        
        {/* Ruta de login (accesible solo por URL) */}
        <Route path="/login" element={<Login />} />

        <Route path="/dashboard" element={
          <PrivateRoute>
            <AdminPanel />
          </PrivateRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;