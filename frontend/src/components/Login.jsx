import { useState } from 'react';

const Login = ({ onLogin }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [showDemo, setShowDemo] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validación básica
        if (!formData.email.trim() || !formData.password.trim()) {
            setMessage('Por favor, completa todos los campos');
            setMessageType('error');
            return;
        }

        // Validación de email básica
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setMessage('Por favor, ingresa un email válido');
            setMessageType('error');
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            const response = await fetch('http://localhost:5001/api/usuarios/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Login exitoso');
                setMessageType('success');
                
                // Guardar información del usuario en localStorage
                localStorage.setItem('user', JSON.stringify(data.user));
                
                // Llamar a onLogin después de un momento para mostrar el mensaje
                setTimeout(() => {
                    onLogin(data.user);
                }, 1000);
            } else {
                setMessage(data.error || 'Error en el login');
                setMessageType('error');
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('Error de conexión. Verifica que el servidor esté funcionando.');
            setMessageType('error');
        } finally {
            setLoading(false);
        }
    };

    const handleDemoLogin = () => {
        setFormData({
            email: 'demo@example.com',
            password: '123456'
        });
        setShowDemo(false);
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <h1>Sistema de Usuarios</h1>
                    <h2>Iniciar Sesión</h2>
                </div>
                
                {message && (
                    <div className={`message ${messageType}`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Ingresa tu email"
                            disabled={loading}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Contraseña:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="Ingresa tu contraseña"
                            disabled={loading}
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="login-button"
                        disabled={loading}
                    >
                        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                    </button>
                </form>

                <div className="demo-section">
                    <button 
                        type="button"
                        className="demo-toggle-button"
                        onClick={() => setShowDemo(!showDemo)}
                    >
                        ℹ️ Información de demostración
                    </button>
                    
                    {showDemo && (
                        <div className="demo-info">
                            <p><strong>Para probar el sistema:</strong></p>
                            <p>• Usa cualquier email de un usuario registrado</p>
                            <p>• La contraseña para todos los usuarios es: <code>123456</code></p>
                            <p>• Primero debes crear usuarios en el sistema</p>
                            <button 
                                className="demo-button"
                                onClick={handleDemoLogin}
                            >
                                Usar credenciales de demo
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;