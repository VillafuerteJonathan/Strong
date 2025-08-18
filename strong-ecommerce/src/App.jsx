import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Inicio from "./Routes/Inicio"
import CategoriaDetalle from "./components/PaginasProductos/ProductosTodos/CategoriaDetalle";
import ProductoDetalle from "./components/PaginasProductos/Productos/ProductoDetalle";
import Login from "./paginas/Login/AdminLogin";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import AdminPanel from "./paginas/Dashboard/AdminPanel";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta pública principal */}
        <Route path="/" element={<Inicio />} />

        {/* Ruta de detalle de categoría */}
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

        {/* Ruta de detalle de producto */}
        <Route
          path="/producto/:id"
          element={
            <>
              <Header />
              <ProductoDetalle />
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
