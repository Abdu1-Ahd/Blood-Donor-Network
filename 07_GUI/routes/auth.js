const express = require('express');
const router = express.Router();
const { getConnection } = require('../db');

// POST /login
router.post('/login', async (req, res) => {
    let connection;
    try {
        const { username, password } = req.body;
        
        // 1. Check request body
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        connection = await getConnection();
        
        // 2. Check username exists
        const checkUser = await connection.execute(
            `SELECT staff_id FROM STAFF WHERE username = :username`,
            { username }
        );

        if (checkUser.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // 3. Check password matches
        const result = await connection.execute(
            `SELECT staff_id, full_name, role, ref_bank_id 
             FROM STAFF 
             WHERE username = :username AND password_hash = :password`,
            { username, password }
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // 4. On success return staff_id, full_name, role, ref_bank_id
        const user = result.rows[0];
        res.json({
            staff_id: user.STAFF_ID,
            full_name: user.FULL_NAME,
            role: user.ROLE,
            ref_bank_id: user.REF_BANK_ID
        });

    } catch (err) {
        // 5. Server error during login
        console.error('Login error:', err);
        res.status(500).json({ error: 'Server error during login' });
    } finally {
        if (connection) {
            try { await connection.close(); } catch (err) { console.error(err); }
        }
    }
});

module.exports = router;
