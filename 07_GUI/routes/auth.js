const express = require('express');
const router = express.Router();
const { getConnection } = require('../db');

// POST /login
router.post('/login', async (req, res) => {
    let connection;
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        connection = await getConnection();
        
        const result = await connection.execute(
            `SELECT staff_id, full_name, role 
             FROM STAFF 
             WHERE username = :username AND password_hash = :password`,
            { username, password }
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = result.rows[0];
        res.json({
            staff_id: user.STAFF_ID,
            full_name: user.FULL_NAME,
            role: user.ROLE
        });

    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        if (connection) {
            try { await connection.close(); } catch (err) { console.error(err); }
        }
    }
});

module.exports = router;
