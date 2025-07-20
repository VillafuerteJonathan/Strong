import Categorias from './Categorias';
import Productos from './Productos';
import Pedidos from './Pedidos';

const ContentArea = ({ section }) => {
  const components = {
    categorias: <Categorias />,
    productos: <Productos />,
    pedidos: <Pedidos />
  };

  return (
    <div className="content-area">
      {components[section] || <div>Sección no encontrada</div>}
    </div>
  );
};

export default ContentArea;