const express = require('express');
const router = express.Router();
const { getConnection } = require('../db');

// GET /api/requests
router.get('/', async (req, res) => {
    let connection;
    try {
        connection = await getConnection();
        const result = await connection.execute(
            `SELECT r.request_id, r.ref_recipient_id, rc.full_name AS recipient_name, 
                    r.ref_bank_id, bb.bank_name, r.blood_group, r.units_needed, 
                    r.status, TO_CHAR(r.request_date, 'YYYY-MM-DD') AS request_date
             FROM REQUEST r
             JOIN RECIPIENT rc ON r.ref_recipient_id = rc.recipient_id
             LEFT JOIN BLOOD_BANK bb ON r.ref_bank_id = bb.bank_id
             ORDER BY r.request_id DESC`
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching requests:', err);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        if (connection) {
            try { await connection.close(); } catch (err) { console.error(err); }
        }
    }
});

// GET /api/requests/pending
router.get('/pending', async (req, res) => {
    let connection;
    try {
        connection = await getConnection();
        const result = await connection.execute(
            `SELECT r.request_id, r.ref_recipient_id, rc.full_name AS recipient_name, 
                    r.ref_bank_id, bb.bank_name, r.blood_group, r.units_needed, 
                    r.status, TO_CHAR(r.request_date, 'YYYY-MM-DD') AS request_date
             FROM REQUEST r
             JOIN RECIPIENT rc ON r.ref_recipient_id = rc.recipient_id
             LEFT JOIN BLOOD_BANK bb ON r.ref_bank_id = bb.bank_id
             WHERE r.status = 'Pending'
             ORDER BY r.request_id DESC`
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching pending requests:', err);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        if (connection) {
            try { await connection.close(); } catch (err) { console.error(err); }
        }
    }
});

// GET /api/requests/export/pending
router.get('/export/pending', async (req, res) => {
    let connection;
    try {
        connection = await getConnection();
        const result = await connection.execute(
            `SELECT r.request_id, rc.full_name AS recipient_name, bb.bank_name, r.blood_group, r.units_needed, r.status, TO_CHAR(r.request_date, 'YYYY-MM-DD') AS request_date
             FROM REQUEST r
             JOIN RECIPIENT rc ON r.ref_recipient_id = rc.recipient_id
             LEFT JOIN BLOOD_BANK bb ON r.ref_bank_id = bb.bank_id
             WHERE r.status = 'Pending'
             ORDER BY r.request_id ASC`
        );
        
        let csv = 'REQUEST_ID,RECIPIENT_NAME,BANK_NAME,BLOOD_GROUP,UNITS_NEEDED,STATUS,REQUEST_DATE\n';
        result.rows.forEach(row => {
            csv += `${row.REQUEST_ID},"${row.RECIPIENT_NAME}","${row.BANK_NAME || ''}",${row.BLOOD_GROUP},${row.UNITS_NEEDED},${row.STATUS},${row.REQUEST_DATE}\n`;
        });

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="pending_requests.csv"');
        res.send(csv);
    } catch (err) {
        console.error('Error exporting requests:', err);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        if (connection) {
            try { await connection.close(); } catch (err) { console.error(err); }
        }
    }
});

// POST /api/requests
router.post('/', async (req, res) => {
    let connection;
    try {
        let { ref_recipient_id, ref_bank_id, blood_group, units_needed } = req.body;
        
        // 1. blood_group: required, valid value
        const validBG = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
        if (!blood_group || !validBG.includes(blood_group)) {
            return res.status(400).json({ error: 'Invalid blood group value' });
        }

        // 2. units_needed: required, 1-3
        units_needed = parseInt(units_needed);
        if (isNaN(units_needed) || units_needed < 1 || units_needed > 3) {
            return res.status(400).json({ error: 'Units needed must be between 1 and 3' });
        }

        // 3. ref_bank_id: required
        if (!ref_bank_id) return res.status(400).json({ error: 'Blood bank selection is required' });

        if (!ref_recipient_id) return res.status(400).json({ error: 'Recipient ID is required' });

        connection = await getConnection();
        
        await connection.execute(
            `INSERT INTO REQUEST (request_id, ref_recipient_id, ref_bank_id, blood_group, units_needed, status, request_date)
             VALUES (seq_request.NEXTVAL, :ref_recipient_id, :ref_bank_id, :blood_group, :units_needed, 'Pending', SYSDATE)`,
            { ref_recipient_id, ref_bank_id, blood_group, units_needed },
            { autoCommit: true }
        );

        res.status(201).json({ success: true });
    } catch (err) {
        console.error('Error adding request:', err);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        if (connection) {
            try { await connection.close(); } catch (err) { console.error(err); }
        }
    }
});

// PUT /api/requests/:id/status
router.put('/:id/status', async (req, res) => {
    let connection;
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        if (!['Pending', 'Approved', 'Rejected', 'Fulfilled'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status value' });
        }

        connection = await getConnection();
        
        // Calling the PL/SQL procedure we created in Phase 4
        await connection.execute(
            `BEGIN proc_update_request_status(:request_id, :new_status); END;`,
            { request_id: id, new_status: status },
            { autoCommit: true }
        );

        res.json({ success: true });
    } catch (err) {
        console.error('Error updating request status:', err);
        res.status(500).json({ error: 'Internal server error or PL/SQL error' });
    } finally {
        if (connection) {
            try { await connection.close(); } catch (err) { console.error(err); }
        }
    }
});

// DELETE /api/requests/:id
router.delete('/:id', async (req, res) => {
    let connection;
    try {
        const { id } = req.params;
        connection = await getConnection();
        
        const result = await connection.execute(
            `DELETE FROM REQUEST WHERE request_id = :id`,
            { id },
            { autoCommit: true }
        );

        if (result.rowsAffected === 0) {
            return res.status(404).json({ error: 'Request not found' });
        }

        res.json({ success: true });
    } catch (err) {
        console.error('Error deleting request:', err);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        if (connection) {
            try { await connection.close(); } catch (err) { console.error(err); }
        }
    }
});

module.exports = router;
