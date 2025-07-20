import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './componentsAdmin/Sidebar';
import ContentArea from './componentsAdmin/ContentArea';
import LogoutButton from './componentsAdmin/LogoutButton';
import './AdminPanel.css';

const AdminPanel = () => {
  const [activeSection, setActiveSection] = useState('productos');
  const navigate = useNavigate();

  const sections = {
    categorias: 'Categorías',
    productos: 'Productos',
    pedidos: 'Pedidos'
  };

  return (
    <div className="admin-container">
      <Sidebar 
        sections={sections} 
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
      
      <div className="main-content">
        <header className="admin-header">
          <h2>Panel de Administración - {sections[activeSection]}</h2>
          <LogoutButton />
        </header>
        
        <ContentArea section={activeSection} />
      </div>
    </div>
  );
};

export default AdminPanel;