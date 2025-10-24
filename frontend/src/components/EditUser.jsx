import { useState, useEffect } from 'react';

const EditUser = ({ userId, onCancel, onSuccess }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        email: ''
    });
    const [loading, setLoading] = useState(false);
    const [loadingUser, setLoadingUser] = useState(true);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    // Cargar datos del usuario al montar el componente
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`http://localhost:5001/api/usuarios/${userId}`);
                const data = await response.json();
                
                if (response.ok) {
                    setFormData({
                        nombre: data.nombre,
                        email: data.email
                    });
                } else {
                    setMessage('Error al cargar los datos del usuario');
                    setMessageType('error');
                }
            } catch (error) {
                console.error('Error:', error);
                setMessage('Error de conexión al cargar el usuario');
                setMessageType('error');
            } finally {
                setLoadingUser(false);
            }
        };

        if (userId) {
            fetchUser();
        }
    }, [userId]);

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

        // Validación de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setMessage('Por favor, ingresa un email válido');
            setMessageType('error');
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            const response = await fetch(`http://localhost:5001/api/usuarios/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Usuario actualizado exitosamente');
                setMessageType('success');
                
                // Llamar a onSuccess después de 1 segundo
                setTimeout(() => {
                    if (onSuccess) onSuccess();
                }, 1000);
            } else {
                setMessage(data.error || 'Error al actualizar el usuario');
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

    if (loadingUser) {
        return (
            <div className="edit-user-container">
                <p>Cargando datos del usuario...</p>
            </div>
        );
    }

    return (
        <div className="edit-user-container">
            <h2>Editar Usuario #{userId}</h2>
            
            {message && (
                <div className={`message ${messageType}`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="edit-user-form">
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

                <div className="form-buttons">
                    <button 
                        type="submit" 
                        className="submit-button"
                        disabled={loading}
                    >
                        {loading ? 'Actualizando...' : 'Actualizar Usuario'}
                    </button>
                    <button 
                        type="button" 
                        className="cancel-button"
                        onClick={onCancel}
                        disabled={loading}
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditUser;
