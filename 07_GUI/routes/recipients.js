const express = require('express');
const router = express.Router();
const { getConnection } = require('../db');

// GET /api/recipients/hospitals (Helper for dropdowns)
router.get('/hospitals', async (req, res) => {
    let connection;
    try {
        connection = await getConnection();
        const result = await connection.execute(
            `SELECT hospital_id, hospital_name FROM HOSPITAL ORDER BY hospital_name ASC`
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching hospitals:', err);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        if (connection) {
            try { await connection.close(); } catch (err) { console.error(err); }
        }
    }
});

// GET /api/recipients
router.get('/', async (req, res) => {
    let connection;
    try {
        connection = await getConnection();
        const result = await connection.execute(
            `SELECT r.*, h.hospital_name 
             FROM RECIPIENT r
             LEFT JOIN HOSPITAL h ON r.ref_hospital_id = h.hospital_id
             ORDER BY r.recipient_id ASC`
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching recipients:', err);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        if (connection) {
            try { await connection.close(); } catch (err) { console.error(err); }
        }
    }
});

// POST /api/recipients
router.post('/', async (req, res) => {
    let connection;
    try {
        const { full_name, blood_group, contact_no, ref_hospital_id, admitted_date } = req.body;
        if (!full_name || !blood_group || !contact_no || !ref_hospital_id || !admitted_date) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        connection = await getConnection();
        
        await connection.execute(
            `INSERT INTO RECIPIENT (recipient_id, full_name, blood_group, contact_no, ref_hospital_id, admitted_date)
             VALUES (seq_recipient.NEXTVAL, :full_name, :blood_group, :contact_no, :ref_hospital_id, TO_DATE(:admitted_date, 'YYYY-MM-DD'))`,
            { full_name, blood_group, contact_no, ref_hospital_id, admitted_date },
            { autoCommit: true }
        );

        res.status(201).json({ success: true });
    } catch (err) {
        console.error('Error adding recipient:', err);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        if (connection) {
            try { await connection.close(); } catch (err) { console.error(err); }
        }
    }
});

// PUT /api/recipients/:id
router.put('/:id', async (req, res) => {
    let connection;
    try {
        const { id } = req.params;
        const { full_name, blood_group, contact_no, ref_hospital_id, admitted_date } = req.body;
        
        connection = await getConnection();
        
        const result = await connection.execute(
            `UPDATE RECIPIENT 
             SET full_name = :full_name, blood_group = :blood_group, contact_no = :contact_no, 
                 ref_hospital_id = :ref_hospital_id, admitted_date = TO_DATE(:admitted_date, 'YYYY-MM-DD')
             WHERE recipient_id = :id`,
            { full_name, blood_group, contact_no, ref_hospital_id, admitted_date, id },
            { autoCommit: true }
        );

        if (result.rowsAffected === 0) {
            return res.status(404).json({ error: 'Recipient not found' });
        }

        res.json({ success: true });
    } catch (err) {
        console.error('Error updating recipient:', err);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        if (connection) {
            try { await connection.close(); } catch (err) { console.error(err); }
        }
    }
});

// DELETE /api/recipients/:id
router.delete('/:id', async (req, res) => {
    let connection;
    try {
        const { id } = req.params;
        connection = await getConnection();
        
        const result = await connection.execute(
            `DELETE FROM RECIPIENT WHERE recipient_id = :id`,
            { id },
            { autoCommit: true }
        );

        if (result.rowsAffected === 0) {
            return res.status(404).json({ error: 'Recipient not found' });
        }

        res.json({ success: true });
    } catch (err) {
        console.error('Error deleting recipient:', err);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        if (connection) {
            try { await connection.close(); } catch (err) { console.error(err); }
        }
    }
});

module.exports = router;
