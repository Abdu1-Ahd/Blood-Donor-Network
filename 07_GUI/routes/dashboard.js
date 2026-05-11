const express = require('express');
const router = express.Router();
const { getConnection } = require('../db');

// GET /api/dashboard/kpis
router.get('/kpis', async (req, res) => {
    let connection;
    try {
        connection = await getConnection();
        
        const resDonors = await connection.execute(`SELECT COUNT(*) AS total FROM DONOR`);
        const resReqs = await connection.execute(`SELECT COUNT(*) AS total FROM REQUEST`);
        const resPend = await connection.execute(`SELECT COUNT(*) AS total FROM REQUEST WHERE status = 'Pending'`);
        const resStock = await connection.execute(`SELECT SUM(units_available) AS total FROM BLOOD_STOCK`);

        res.json({
            total_donors: resDonors.rows[0].TOTAL || 0,
            total_requests: resReqs.rows[0].TOTAL || 0,
            pending_requests: resPend.rows[0].TOTAL || 0,
            total_stock_units: resStock.rows[0].TOTAL || 0
        });
    } catch (err) {
        console.error('Error fetching KPIs:', err);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        if (connection) {
            try { await connection.close(); } catch (err) { console.error(err); }
        }
    }
});

// GET /api/dashboard/donations-by-bloodgroup
router.get('/donations-by-bloodgroup', async (req, res) => {
    let connection;
    try {
        connection = await getConnection();
        const result = await connection.execute(
            `SELECT blood_group, COUNT(donation_id) AS donation_count
             FROM DONATION
             GROUP BY blood_group
             ORDER BY blood_group`
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching donations by BG:', err);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        if (connection) {
            try { await connection.close(); } catch (err) { console.error(err); }
        }
    }
});

// GET /api/dashboard/requests-by-status
router.get('/requests-by-status', async (req, res) => {
    let connection;
    try {
        connection = await getConnection();
        const result = await connection.execute(
            `SELECT status, COUNT(request_id) AS status_count
             FROM REQUEST
             GROUP BY status`
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching requests by status:', err);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        if (connection) {
            try { await connection.close(); } catch (err) { console.error(err); }
        }
    }
});

// GET /api/dashboard/top-banks
router.get('/top-banks', async (req, res) => {
    let connection;
    try {
        connection = await getConnection();
        // Use FETCH FIRST 5 ROWS ONLY (Oracle 12c+)
        const result = await connection.execute(
            `SELECT * FROM (
                SELECT b.bank_name, b.city, NVL(SUM(s.units_available), 0) AS total_stock
                FROM BLOOD_BANK b
                LEFT JOIN BLOOD_STOCK s ON b.bank_id = s.ref_bank_id
                GROUP BY b.bank_name, b.city
                ORDER BY total_stock DESC
             ) WHERE ROWNUM <= 5`
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching top banks:', err);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        if (connection) {
            try { await connection.close(); } catch (err) { console.error(err); }
        }
    }
});

module.exports = router;
