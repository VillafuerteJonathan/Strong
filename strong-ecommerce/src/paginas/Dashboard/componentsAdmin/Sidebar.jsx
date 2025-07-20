import './Sidebar.css';

const Sidebar = ({ sections, activeSection, setActiveSection }) => {
  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header">
        <h3>STRONG ADMIN</h3>
      </div>
      
      <nav className="sidebar-nav">
        {Object.entries(sections).map(([key, label]) => (
          <button
            key={key}
            className={`nav-item ${activeSection === key ? 'active' : ''}`}
            onClick={() => setActiveSection(key)}
          >
            {label}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;