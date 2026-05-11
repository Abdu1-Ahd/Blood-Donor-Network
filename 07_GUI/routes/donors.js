const express = require('express');
const router = express.Router();
const { getConnection } = require('../db');
const oracledb = require('oracledb');

// GET /api/donors
router.get('/', async (req, res) => {
    let connection;
    try {
        connection = await getConnection();
        const result = await connection.execute(
            `SELECT * FROM DONOR ORDER BY donor_id ASC`
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching donors:', err);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        if (connection) {
            try { await connection.close(); } catch (err) { console.error(err); }
        }
    }
});

// GET /api/donors/search?city=&blood_group=
router.get('/search', async (req, res) => {
    let connection;
    try {
        const { city, blood_group } = req.query;
        let query = `SELECT * FROM DONOR WHERE 1=1`;
        const binds = {};

        if (city) {
            query += ` AND city = :city`;
            binds.city = city;
        }
        if (blood_group) {
            query += ` AND blood_group = :blood_group`;
            binds.blood_group = blood_group;
        }

        query += ` ORDER BY donor_id ASC`;

        connection = await getConnection();
        const result = await connection.execute(query, binds);
        res.json(result.rows);
    } catch (err) {
        console.error('Error searching donors:', err);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        if (connection) {
            try { await connection.close(); } catch (err) { console.error(err); }
        }
    }
});

// GET /api/donors/export
router.get('/export', async (req, res) => {
    let connection;
    try {
        connection = await getConnection();
        const result = await connection.execute(
            `SELECT donor_id, full_name, TO_CHAR(dob, 'YYYY-MM-DD') AS dob, blood_group, contact_no, city, is_eligible FROM DONOR ORDER BY donor_id ASC`
        );
        
        let csv = 'DONOR_ID,FULL_NAME,DOB,BLOOD_GROUP,CONTACT_NO,CITY,IS_ELIGIBLE\n';
        result.rows.forEach(row => {
            csv += `${row.DONOR_ID},"${row.FULL_NAME}",${row.DOB},${row.BLOOD_GROUP},"${row.CONTACT_NO}","${row.CITY}",${row.IS_ELIGIBLE}\n`;
        });

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="donors.csv"');
        res.send(csv);
    } catch (err) {
        console.error('Error exporting donors:', err);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        if (connection) {
            try { await connection.close(); } catch (err) { console.error(err); }
        }
    }
});

// POST /api/donors
router.post('/', async (req, res) => {
    let connection;
    try {
        let { full_name, dob, blood_group, contact_no, city, is_eligible } = req.body;
        
        // 1. full_name: required, not empty
        if (!full_name || !full_name.trim()) return res.status(400).json({ error: 'Full name is required' });
        
        // 2. blood_group: must be valid
        const validBG = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
        if (!validBG.includes(blood_group)) return res.status(400).json({ error: 'Invalid blood group value' });
        
        // 3. contact_no: required, must be numeric
        if (!contact_no || isNaN(contact_no)) return res.status(400).json({ error: 'Contact number must be numeric' });
        
        // 4. city: required
        if (!city || !city.trim()) return res.status(400).json({ error: 'City is required' });

        if (!dob || !is_eligible) return res.status(400).json({ error: 'All fields are required' });

        connection = await getConnection();
        
        const result = await connection.execute(
            `INSERT INTO DONOR (donor_id, full_name, dob, blood_group, contact_no, city, is_eligible)
             VALUES (seq_donor.NEXTVAL, :full_name, TO_DATE(:dob, 'YYYY-MM-DD'), :blood_group, :contact_no, :city, :is_eligible)
             RETURNING donor_id INTO :new_id`,
            {
                full_name,
                dob,
                blood_group,
                contact_no,
                city,
                is_eligible,
                new_id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
            },
            { autoCommit: true }
        );

        res.status(201).json({ donor_id: result.outBinds.new_id[0] });
    } catch (err) {
        console.error('Error adding donor:', err);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        if (connection) {
            try { await connection.close(); } catch (err) { console.error(err); }
        }
    }
});

// PUT /api/donors/:id
router.put('/:id', async (req, res) => {
    let connection;
    try {
        const { id } = req.params;
        const { full_name, dob, blood_group, contact_no, city, is_eligible } = req.body;
        
        connection = await getConnection();
        
        const result = await connection.execute(
            `UPDATE DONOR 
             SET full_name = :full_name, dob = TO_DATE(:dob, 'YYYY-MM-DD'), blood_group = :blood_group, 
                 contact_no = :contact_no, city = :city, is_eligible = :is_eligible
             WHERE donor_id = :id`,
            { full_name, dob, blood_group, contact_no, city, is_eligible, id },
            { autoCommit: true }
        );

        if (result.rowsAffected === 0) {
            return res.status(404).json({ error: 'Donor not found' });
        }

        res.json({ success: true });
    } catch (err) {
        console.error('Error updating donor:', err);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        if (connection) {
            try { await connection.close(); } catch (err) { console.error(err); }
        }
    }
});

// DELETE /api/donors/:id
router.delete('/:id', async (req, res) => {
    let connection;
    try {
        const { id } = req.params;
        connection = await getConnection();
        
        const result = await connection.execute(
            `DELETE FROM DONOR WHERE donor_id = :id`,
            { id },
            { autoCommit: true }
        );

        if (result.rowsAffected === 0) {
            return res.status(404).json({ error: 'Donor not found' });
        }

        res.json({ success: true });
    } catch (err) {
        console.error('Error deleting donor:', err);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        if (connection) {
            try { await connection.close(); } catch (err) { console.error(err); }
        }
    }
});

module.exports = router;
