import { useState } from 'react'
import './App.css'
import UserList from './components/userList'
import CreateUser from './components/CreateUser'

function App() {
  const [currentView, setCurrentView] = useState('home'); // 'home', 'create', 'list'

  const renderView = () => {
    switch (currentView) {
      case 'create':
        return <CreateUser />;
      case 'list':
        return <UserList />;
      default:
        return (
          <div className="home-container">
            <h2>Gestión de Usuarios</h2>
            <p>Selecciona una opción para comenzar:</p>
            <div className="home-buttons">
              <button 
                className="nav-button create-btn"
                onClick={() => setCurrentView('create')}
              >
                ➕ Crear Usuario
              </button>
              <button 
                className="nav-button list-btn"
                onClick={() => setCurrentView('list')}
              >
                📋 Listar Usuarios
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div>
      <h1>React + MySQL</h1>
      
      {/* Botones de navegación (siempre visibles cuando no estamos en home) */}
      {currentView !== 'home' && (
        <div className="navigation-bar">
          <button 
            className="nav-button back-btn"
            onClick={() => setCurrentView('home')}
          >
            🏠 Inicio
          </button>
          <button 
            className={`nav-button ${currentView === 'create' ? 'active' : ''}`}
            onClick={() => setCurrentView('create')}
          >
            ➕ Crear Usuario
          </button>
          <button 
            className={`nav-button ${currentView === 'list' ? 'active' : ''}`}
            onClick={() => setCurrentView('list')}
          >
            📋 Listar Usuarios
          </button>
        </div>
      )}

      {/* Contenido principal */}
      <div className="main-content">
        {renderView()}
      </div>
    </div>
  )
}

export default App
