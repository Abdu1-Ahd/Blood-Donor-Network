-- ============================================================
-- Project  : Blood Donor Network
-- Script   : 05_Queries.sql
-- Members  : Abdul Ahad (24F-0727), Jazib (24F-0691)
-- Course   : CL2005 Database Systems Lab, Spring 2026
-- Purpose  : Phase 2D — DML Queries (SELECT, JOIN, Subquery, Aggregate, DCL)
-- ============================================================
SET SERVEROUTPUT ON;

-- ===== SECTION 1: SELECT WITH WHERE =====

-- Q1: Find all eligible donors in Lahore
SELECT * FROM DONOR WHERE is_eligible = 'Y' AND city = 'Lahore';

-- Q2: Find all pending blood requests with units_needed greater than 1
SELECT * FROM REQUEST WHERE status = 'Pending' AND units_needed > 1;

-- Q3: Find all donations made in the last 6 months
SELECT * FROM DONATION WHERE donation_date >= SYSDATE - 180;

-- Q4: Find all recipients admitted to hospital ID 1
SELECT * FROM RECIPIENT WHERE ref_hospital_id = 1;

-- Q5: Find all blood banks with capacity greater than 100 units
SELECT * FROM BLOOD_BANK WHERE capacity > 100;

-- ===== SECTION 2: AGGREGATE QUERIES =====

-- Q1: Count total donations per blood group
SELECT blood_group, COUNT(donation_id) AS total_donations
FROM DONATION
GROUP BY blood_group;

-- Q2: Find total units donated per blood bank
SELECT b.bank_name, SUM(d.units_donated) AS total_units
FROM DONATION d
JOIN BLOOD_BANK b ON d.ref_bank_id = b.bank_id
GROUP BY b.bank_name;

-- Q3: Find average, min, and max units available per blood group in stock
SELECT blood_group, AVG(units_available) AS avg_units, MIN(units_available) AS min_units, MAX(units_available) AS max_units
FROM BLOOD_STOCK
GROUP BY blood_group;

-- ===== SECTION 3: SUBQUERIES =====

-- Q1 (nested): Find donors whose blood group matches currently requested blood groups
SELECT full_name, blood_group
FROM DONOR
WHERE blood_group IN (SELECT DISTINCT blood_group FROM REQUEST WHERE status = 'Pending');

-- Q2 (correlated): Find blood banks where their specific blood group stock is above the average stock for that specific blood group across all banks
SELECT b.bank_name, s.blood_group, s.units_available
FROM BLOOD_BANK b
JOIN BLOOD_STOCK s ON b.bank_id = s.ref_bank_id
WHERE s.units_available > (
    SELECT AVG(s2.units_available)
    FROM BLOOD_STOCK s2
    WHERE s2.blood_group = s.blood_group
);

-- Q3 (nested with IN): Find all staff members working at blood banks located in Lahore
SELECT full_name, role
FROM STAFF
WHERE ref_bank_id IN (SELECT bank_id FROM BLOOD_BANK WHERE city = 'Lahore');

-- ===== SECTION 4: JOIN QUERIES =====

-- Q1 (INNER JOIN): Join DONOR and DONATION to show donor name, blood group, donation date, units donated
SELECT d.full_name, d.blood_group, dn.donation_date, dn.units_donated
FROM DONOR d
INNER JOIN DONATION dn ON d.donor_id = dn.ref_donor_id;

-- Q2 (LEFT OUTER JOIN): Join RECIPIENT and REQUEST to show all recipients including those with no requests yet
SELECT r.full_name, rq.blood_group, rq.units_needed, rq.status
FROM RECIPIENT r
LEFT OUTER JOIN REQUEST rq ON r.recipient_id = rq.ref_recipient_id;

-- Q3 (multi-table, 3+ tables): Join DONATION, DONOR, BLOOD_BANK to show full donation history with donor name and bank name
SELECT dn.donation_date, dn.units_donated, d.full_name AS donor_name, b.bank_name
FROM DONATION dn
JOIN DONOR d ON dn.ref_donor_id = d.donor_id
JOIN BLOOD_BANK b ON dn.ref_bank_id = b.bank_id;

-- Q4 (INNER JOIN): Join REQUEST, RECIPIENT, BLOOD_BANK to show pending requests with recipient name and bank name
SELECT rq.request_date, rq.blood_group, r.full_name AS recipient_name, b.bank_name
FROM REQUEST rq
INNER JOIN RECIPIENT r ON rq.ref_recipient_id = r.recipient_id
INNER JOIN BLOOD_BANK b ON rq.ref_bank_id = b.bank_id
WHERE rq.status = 'Pending';

-- ===== SECTION 5: UPDATE STATEMENTS =====

-- U1: Update is_eligible to 'N' for donors who have donated in the last 30 days
UPDATE DONOR
SET is_eligible = 'N'
WHERE donor_id IN (
    SELECT ref_donor_id
    FROM DONATION
    WHERE donation_date >= SYSDATE - 30
);
COMMIT;

-- U2: Update request status to 'Approved' for pending requests where the blood bank has sufficient stock
UPDATE REQUEST rq
SET status = 'Approved'
WHERE status = 'Pending'
  AND units_needed <= (
      SELECT units_available
      FROM BLOOD_STOCK s
      WHERE s.ref_bank_id = rq.ref_bank_id
        AND s.blood_group = rq.blood_group
  );
COMMIT;

-- ===== SECTION 6: DELETE STATEMENTS =====

-- D1: Delete all rejected requests older than 1 year
DELETE FROM REQUEST
WHERE status = 'Rejected'
  AND request_date < SYSDATE - 365;
COMMIT;

-- D2: Delete blood stock records where units_available is 0 and last_updated is older than 6 months
DELETE FROM BLOOD_STOCK
WHERE units_available = 0
  AND last_updated < SYSDATE - 180;
COMMIT;

-- ===== SECTION 7: DCL =====

-- DBA required: Create the viewer user
CREATE USER blood_viewer IDENTIFIED BY viewer123;

-- Grant select privileges to the new user
GRANT SELECT ON DONOR TO blood_viewer;

-- Grant select on REQUEST
GRANT SELECT ON REQUEST TO blood_viewer;

-- Grant select on BLOOD_STOCK
GRANT SELECT ON BLOOD_STOCK TO blood_viewer;

-- Revoke select on DONOR to restrict access
REVOKE SELECT ON DONOR FROM blood_viewer;
