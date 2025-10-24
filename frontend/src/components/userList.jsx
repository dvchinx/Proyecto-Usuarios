import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EditUser from './EditUser';

function UserList() {
    const [users, setUsers] = useState([]);
    const [editingUserId, setEditingUserId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    const fetchUsers = () => {
        axios.get('http://localhost:5001/api/usuarios')
            .then(res => setUsers(res.data))
            .catch(err => {
                console.error(err);
                setMessage('Error al cargar los usuarios');
                setMessageType('error');
            });
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (id, nombre) => {
        if (!window.confirm(`¿Estás seguro de que deseas eliminar al usuario "${nombre}"?`)) {
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            const response = await fetch(`http://localhost:5001/api/usuarios/${id}`, {
                method: 'DELETE'
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(`Usuario "${nombre}" eliminado exitosamente`);
                setMessageType('success');
                fetchUsers(); // Recargar la lista
                
                // Limpiar mensaje después de 3 segundos
                setTimeout(() => setMessage(''), 3000);
            } else {
                setMessage(data.error || 'Error al eliminar el usuario');
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

    const handleEditSuccess = () => {
        setEditingUserId(null);
        fetchUsers();
    };

    const handleCancelEdit = () => {
        setEditingUserId(null);
    };

    // Si estamos editando un usuario, mostrar el formulario de edición
    if (editingUserId) {
        return (
            <EditUser 
                userId={editingUserId}
                onCancel={handleCancelEdit}
                onSuccess={handleEditSuccess}
            />
        );
    }

    return (
        <div className="user-list-container">
            <h2>Lista de Usuarios</h2>
            
            {message && (
                <div className={`message ${messageType}`}>
                    {message}
                </div>
            )}

            {users.length === 0 ? (
                <p className="no-users-message">No hay usuarios registrados</p>
            ) : (
                <div className="table-container">
                    <table className="users-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Email</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u.id}>
                                    <td>{u.id}</td>
                                    <td>{u.nombre}</td>
                                    <td>{u.email}</td>
                                    <td className="actions-cell">
                                        <button 
                                            className="action-button edit-button"
                                            onClick={() => setEditingUserId(u.id)}
                                            disabled={loading}
                                        >
                                            ✏️ Editar
                                        </button>
                                        <button 
                                            className="action-button delete-button"
                                            onClick={() => handleDelete(u.id, u.nombre)}
                                            disabled={loading}
                                        >
                                            🗑️ Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default UserList;