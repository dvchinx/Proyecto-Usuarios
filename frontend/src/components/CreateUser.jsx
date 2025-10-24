import { useState } from 'react';

const CreateUser = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        email: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // 'success' or 'error'

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
        if (!formData.nombre.trim() || !formData.email.trim()) {
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
            const response = await fetch('http://localhost:5001/api/usuarios', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Usuario creado exitosamente');
                setMessageType('success');
                // Limpiar el formulario
                setFormData({
                    nombre: '',
                    email: ''
                });
            } else {
                setMessage(data.error || 'Error al crear el usuario');
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

    return (
        <div className="create-user-container">
            <h2>Crear Nuevo Usuario</h2>
            
            {message && (
                <div className={`message ${messageType}`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="create-user-form">
                <div className="form-group">
                    <label htmlFor="nombre">Nombre:</label>
                    <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleInputChange}
                        placeholder="Ingresa el nombre del usuario"
                        disabled={loading}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Ingresa el email del usuario"
                        disabled={loading}
                        required
                    />
                </div>

                <button 
                    type="submit" 
                    className="submit-button"
                    disabled={loading}
                >
                    {loading ? 'Creando...' : 'Crear Usuario'}
                </button>
            </form>
        </div>
    );
};

export default CreateUser;