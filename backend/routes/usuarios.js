const express = require('express');
const router = express.Router();
const db = require('../config/database');

// POST - Login simulado
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({
            error: 'Email y contraseña son requeridos'
        });
    }

    // Simulamos que la contraseña es "123456" para todos los usuarios
    if (password !== '123456') {
        return res.status(401).json({
            error: 'Contraseña incorrecta'
        });
    }

    const query = 'SELECT * FROM usuarios WHERE email = ?';

    db.query(query, [email], (err, results) => {
        if (err) {
            console.error('Error en login: ', err);
            return res.status(500).json({
                error: 'Error interno del servidor',
                details: err.message
            });
        }
        
        if (results.length === 0) {
            return res.status(401).json({
                error: 'Usuario no encontrado'
            });
        }
        
        const user = results[0];
        res.json({
            message: 'Login exitoso',
            user: {
                id: user.id,
                nombre: user.nombre,
                email: user.email
            }
        });
    });
});

// GET - Obtener todos los usuarios
router.get('/', (req, res) => {
    const query = 'SELECT * FROM usuarios ORDER BY id DESC';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener usuarios: ', err);
            return res.status(500).json({
                error: 'Error al obtener usuarios',
                details: err.message
            });
        }
        res.json(results);
    });
});

// GET - Obtener usuario por ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM usuarios WHERE id = ?';

    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error al obtener usuario: ', err);
            return res.status(500).json({
                error: 'Error al obtener usuario',
                details: err.message
            });
        }
        
        if (results.length === 0) {
            return res.status(404).json({
                error: 'Usuario no encontrado'
            });
        }
        
        res.json(results[0]);
    });
});

// POST - Crear nuevo usuario
router.post('/', (req, res) => {
    const { nombre, email } = req.body;
    
    if (!nombre || !email) {
        return res.status(400).json({
            error: 'Nombre y email son requeridos'
        });
    }

    const query = 'INSERT INTO usuarios (nombre, email) VALUES (?, ?)';

    db.query(query, [nombre, email], (err, result) => {
        if (err) {
            console.error('Error al crear usuario: ', err);
            return res.status(500).json({
                error: 'Error al crear usuario',
                details: err.message
            });
        }
        
        res.status(201).json({
            message: 'Usuario creado exitosamente',
            id: result.insertId,
            nombre,
            email
        });
    });
});

// PUT - Actualizar usuario
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, email } = req.body;
    
    if (!nombre || !email) {
        return res.status(400).json({
            error: 'Nombre y email son requeridos'
        });
    }

    const query = 'UPDATE usuarios SET nombre = ?, email = ? WHERE id = ?';

    db.query(query, [nombre, email, id], (err, result) => {
        if (err) {
            console.error('Error al actualizar usuario: ', err);
            return res.status(500).json({
                error: 'Error al actualizar usuario',
                details: err.message
            });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: 'Usuario no encontrado'
            });
        }
        
        res.json({
            message: 'Usuario actualizado exitosamente',
            id,
            nombre,
            email
        });
    });
});

// DELETE - Eliminar usuario
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM usuarios WHERE id = ?';

    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar usuario: ', err);
            return res.status(500).json({
                error: 'Error al eliminar usuario',
                details: err.message
            });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: 'Usuario no encontrado'
            });
        }
        
        res.json({
            message: 'Usuario eliminado exitosamente'
        });
    });
});

module.exports = router;