const express = require('express');
const router = express.Router();
const { getConnection } = require('../db');

// GET /api/stock
router.get('/', async (req, res) => {
    let connection;
    try {
        connection = await getConnection();
        const result = await connection.execute(
            `SELECT s.stock_id, s.ref_bank_id, b.bank_name, s.blood_group, 
                    s.units_available, TO_CHAR(s.last_updated, 'YYYY-MM-DD HH24:MI') AS last_updated
             FROM BLOOD_STOCK s
             JOIN BLOOD_BANK b ON s.ref_bank_id = b.bank_id
             ORDER BY b.bank_name, s.blood_group`
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching blood stock:', err);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        if (connection) {
            try { await connection.close(); } catch (err) { console.error(err); }
        }
    }
});

// GET /api/stock/banks (Helper for dropdown)
router.get('/banks', async (req, res) => {
    let connection;
    try {
        connection = await getConnection();
        const result = await connection.execute(
            `SELECT bank_id, bank_name FROM BLOOD_BANK ORDER BY bank_name ASC`
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching banks:', err);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        if (connection) {
            try { await connection.close(); } catch (err) { console.error(err); }
        }
    }
});

// GET /api/stock/bank/:bank_id
router.get('/bank/:bank_id', async (req, res) => {
    let connection;
    try {
        const { bank_id } = req.params;
        connection = await getConnection();
        const result = await connection.execute(
            `SELECT s.stock_id, s.ref_bank_id, b.bank_name, s.blood_group, 
                    s.units_available, TO_CHAR(s.last_updated, 'YYYY-MM-DD HH24:MI') AS last_updated
             FROM BLOOD_STOCK s
             JOIN BLOOD_BANK b ON s.ref_bank_id = b.bank_id
             WHERE s.ref_bank_id = :bank_id
             ORDER BY s.blood_group`,
            { bank_id }
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching stock for bank:', err);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        if (connection) {
            try { await connection.close(); } catch (err) { console.error(err); }
        }
    }
});

// POST /api/stock
router.post('/', async (req, res) => {
    let connection;
    try {
        const { ref_bank_id, blood_group, units_available } = req.body;
        if (!ref_bank_id || !blood_group || units_available === undefined) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        connection = await getConnection();
        
        await connection.execute(
            `INSERT INTO BLOOD_STOCK (stock_id, ref_bank_id, blood_group, units_available, last_updated)
             VALUES (seq_blood_stock.NEXTVAL, :ref_bank_id, :blood_group, :units_available, SYSDATE)`,
            { ref_bank_id, blood_group, units_available },
            { autoCommit: true }
        );

        res.status(201).json({ success: true });
    } catch (err) {
        console.error('Error adding stock:', err);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        if (connection) {
            try { await connection.close(); } catch (err) { console.error(err); }
        }
    }
});

// PUT /api/stock/:id
router.put('/:id', async (req, res) => {
    let connection;
    try {
        const { id } = req.params;
        const { units_available } = req.body;
        
        if (units_available === undefined) {
            return res.status(400).json({ error: 'units_available is required' });
        }

        connection = await getConnection();
        
        const result = await connection.execute(
            `UPDATE BLOOD_STOCK 
             SET units_available = :units_available, last_updated = SYSDATE
             WHERE stock_id = :id`,
            { units_available, id },
            { autoCommit: true }
        );

        if (result.rowsAffected === 0) {
            return res.status(404).json({ error: 'Stock record not found' });
        }

        res.json({ success: true });
    } catch (err) {
        console.error('Error updating stock:', err);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        if (connection) {
            try { await connection.close(); } catch (err) { console.error(err); }
        }
    }
});

module.exports = router;
