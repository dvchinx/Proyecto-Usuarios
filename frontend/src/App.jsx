import { useState, useEffect } from 'react'
import './App.css'
import UserList from './components/userList'
import CreateUser from './components/CreateUser'
import Login from './components/Login'

function App() {
  const [currentView, setCurrentView] = useState('home'); // 'home', 'create', 'list'
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verificar si hay un usuario logueado al cargar la aplicación
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error al cargar usuario guardado:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setCurrentView('home');
    localStorage.removeItem('user');
  };

  // Si no está autenticado, mostrar pantalla de login
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'create':
        return <CreateUser />;
      case 'list':
        return <UserList />;
      default:
        return (
          <div className="home-container">
            <h2>Bienvenido, {user?.nombre}!</h2>
            <p className="welcome-message">¿Qué deseas hacer hoy?</p>
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
      <header className="app-header">
        <h1>Sistema de Gestión de Usuarios</h1>
        <div className="user-info">
          <span className="user-name">👤 {user?.nombre}</span>
          <button 
            className="logout-button"
            onClick={handleLogout}
          >
            🚪 Cerrar Sesión
          </button>
        </div>
      </header>
      
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
