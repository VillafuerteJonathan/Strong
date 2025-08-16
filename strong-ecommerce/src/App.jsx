import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import HeroSection from "./components/HeroSection/HeroSection";
import Footer from "./components/Footer/Footer";
import Novedades from "./components/Novedades/Novedades";
import CategoriaTypos from "./components/CategoriaTypos/Categoria";
import CategoriaDetalle from "./components/PaginasProductos/ProductosTodos/CategoriaDetalle";
import Login from "./paginas/Login/AdminLogin";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import AdminPanel from "./paginas/Dashboard/AdminPanel";
import Calidad from "./components/Calidad/Calidad";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta pública principal */}
        <Route
          path="/"
          element={
            <>
              <Header />
              <HeroSection />
               <Novedades />
              
              <CategoriaTypos />
             <Calidad />
              <Footer />
            </>
          }
        />

        {/* Ruta de detalle de categoría (usa useParams dentro del componente) */}
        <Route
          path="/categoria/:id/:nombre"
          element={
            <>
              <Header />
              <CategoriaDetalle />
              <Footer />
            </>
          }
        />

        {/* Ruta de login */}
        <Route path="/login" element={<Login />} />

        {/* Ruta protegida para admin */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <AdminPanel />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
