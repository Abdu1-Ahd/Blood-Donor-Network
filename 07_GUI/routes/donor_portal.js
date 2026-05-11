const express = require('express');
const router = express.Router();
const { getConnection } = require('../db');

// GET /api/donor-portal/profile/:staff_id
router.get('/profile/:staff_id', async (req, res) => {
    let connection;
    try {
        connection = await getConnection();
        const result = await connection.execute(
            `SELECT staff_id, full_name, username, contact_no, role 
             FROM STAFF WHERE staff_id = :staff_id`,
            { staff_id: req.params.staff_id }
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Staff not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    } finally {
        if (connection) {
            try { await connection.close(); } catch (e) { console.error(e); }
        }
    }
});

// PUT /api/donor-portal/profile/:staff_id
router.put('/profile/:staff_id', async (req, res) => {
    let connection;
    try {
        const { full_name, contact_no } = req.body;
        if (!full_name || !full_name.trim()) return res.status(400).json({ error: 'Full name is required' });
        if (!contact_no || isNaN(contact_no)) return res.status(400).json({ error: 'Contact number must be numeric' });

        connection = await getConnection();
        
        // Check duplicate contact_no
        const check = await connection.execute(
            `SELECT staff_id FROM STAFF WHERE contact_no = :contact_no AND staff_id != :staff_id`,
            { contact_no, staff_id: req.params.staff_id }
        );
        if (check.rows.length > 0) {
            return res.status(409).json({ error: 'Contact number already in use' });
        }

        await connection.execute(
            `UPDATE STAFF SET full_name = :full_name, contact_no = :contact_no 
             WHERE staff_id = :staff_id`,
            { full_name: full_name.trim(), contact_no, staff_id: req.params.staff_id },
            { autoCommit: true }
        );
        res.json({ message: 'Profile updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    } finally {
        if (connection) {
            try { await connection.close(); } catch (e) { console.error(e); }
        }
    }
});

// POST /api/donor-portal/register-donor
router.post('/register-donor', async (req, res) => {
    let connection;
    try {
        const { full_name, dob, blood_group, contact_no, city } = req.body;
        if (!full_name || !dob || !blood_group || !contact_no || !city) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        connection = await getConnection();
        const check = await connection.execute(
            `SELECT donor_id FROM DONOR WHERE contact_no = :contact_no`,
            { contact_no }
        );
        if (check.rows.length > 0) {
            return res.status(409).json({ error: 'You are already registered as a donor' });
        }

        const result = await connection.execute(
            `INSERT INTO DONOR (donor_id, full_name, dob, blood_group, contact_no, city, is_eligible)
             VALUES (seq_donor.NEXTVAL, :full_name, TO_DATE(:dob, 'YYYY-MM-DD'), :blood_group, :contact_no, :city, 'Y')
             RETURNING donor_id INTO :id`,
            { full_name, dob, blood_group, contact_no, city, id: { type: require('oracledb').NUMBER, dir: require('oracledb').BIND_OUT } },
            { autoCommit: true }
        );
        res.json({ message: 'Registered successfully', donor_id: result.outBinds.id[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    } finally {
        if (connection) {
            try { await connection.close(); } catch (e) { console.error(e); }
        }
    }
});

// GET /api/donor-portal/banks
router.get('/banks', async (req, res) => {
    let connection;
    try {
        connection = await getConnection();
        const result = await connection.execute(`SELECT bank_id, bank_name, city FROM BLOOD_BANK ORDER BY bank_name`);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    } finally {
        if (connection) {
            try { await connection.close(); } catch (e) { console.error(e); }
        }
    }
});

// POST /api/donor-portal/request
router.post('/request', async (req, res) => {
    let connection;
    try {
        const { contact_no, blood_group, units_needed, ref_bank_id } = req.body;
        connection = await getConnection();
        
        const rec = await connection.execute(`SELECT recipient_id FROM RECIPIENT WHERE contact_no = :contact_no`, { contact_no });
        if (rec.rows.length === 0) {
            return res.status(404).json({ error: 'Not registered as recipient' });
        }
        const recipient_id = rec.rows[0].RECIPIENT_ID;

        const check = await connection.execute(
            `SELECT request_id FROM REQUEST WHERE ref_recipient_id = :recipient_id AND blood_group = :blood_group AND status = 'Pending'`,
            { recipient_id, blood_group }
        );
        if (check.rows.length > 0) {
            return res.status(409).json({ error: 'You already have a pending request for this blood group' });
        }

        const result = await connection.execute(
            `INSERT INTO REQUEST (request_id, ref_recipient_id, ref_bank_id, blood_group, units_needed, status, request_date)
             VALUES (seq_request.NEXTVAL, :recipient_id, :ref_bank_id, :blood_group, :units_needed, 'Pending', SYSDATE)
             RETURNING request_id INTO :id`,
            { recipient_id, ref_bank_id, blood_group, units_needed, id: { type: require('oracledb').NUMBER, dir: require('oracledb').BIND_OUT } },
            { autoCommit: true }
        );
        res.json({ message: 'Request submitted successfully', request_id: result.outBinds.id[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    } finally {
        if (connection) {
            try { await connection.close(); } catch (e) { console.error(e); }
        }
    }
});

// GET /api/donor-portal/my-donations/:contact_no
router.get('/my-donations/:contact_no', async (req, res) => {
    let connection;
    try {
        connection = await getConnection();
        const result = await connection.execute(
            `SELECT d.donation_id, d.donation_date, d.blood_group, d.units_donated, b.bank_name
             FROM DONATION d
             JOIN DONOR dr ON d.ref_donor_id = dr.donor_id
             JOIN BLOOD_BANK b ON d.ref_bank_id = b.bank_id
             WHERE dr.contact_no = :contact_no
             ORDER BY d.donation_date DESC`,
            { contact_no: req.params.contact_no }
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    } finally {
        if (connection) {
            try { await connection.close(); } catch (e) { console.error(e); }
        }
    }
});

// GET /api/donor-portal/my-requests/:contact_no
router.get('/my-requests/:contact_no', async (req, res) => {
    let connection;
    try {
        connection = await getConnection();
        const result = await connection.execute(
            `SELECT r.request_id, r.blood_group, r.units_needed, r.status, r.request_date, b.bank_name
             FROM REQUEST r
             JOIN RECIPIENT rec ON r.ref_recipient_id = rec.recipient_id
             JOIN BLOOD_BANK b ON r.ref_bank_id = b.bank_id
             WHERE rec.contact_no = :contact_no
             ORDER BY r.request_date DESC`,
            { contact_no: req.params.contact_no }
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    } finally {
        if (connection) {
            try { await connection.close(); } catch (e) { console.error(e); }
        }
    }
});

// GET /api/donor-portal/availability
router.get('/availability', async (req, res) => {
    let connection;
    try {
        connection = await getConnection();
        const result = await connection.execute(
            `SELECT b.bank_name, b.city, s.blood_group, s.units_available
             FROM BLOOD_STOCK s
             JOIN BLOOD_BANK b ON s.ref_bank_id = b.bank_id
             ORDER BY s.blood_group, b.bank_name`
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    } finally {
        if (connection) {
            try { await connection.close(); } catch (e) { console.error(e); }
        }
    }
});

module.exports = router;
