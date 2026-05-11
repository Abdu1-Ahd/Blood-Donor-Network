-- ============================================================
-- Project  : Blood Donor Network
-- Script   : 06_PLSQL.sql
-- Members  : Abdul Ahad (24F-0727), Jazib (24F-0691)
-- Course   : CL2005 Database Systems Lab, Spring 2026
-- Purpose  : Phase 4 — PL/SQL (Procedures, Functions, Triggers, Cursors, Package, Anonymous Blocks)
-- ============================================================
SET SERVEROUTPUT ON;

-- ===== SECTION 1: STORED PROCEDURES =====

CREATE OR REPLACE PROCEDURE proc_add_donor (
    p_full_name   IN VARCHAR2,
    p_dob         IN DATE,
    p_blood_group IN VARCHAR2,
    p_contact_no  IN VARCHAR2,
    p_city        IN VARCHAR2,
    p_donor_id    OUT NUMBER
) AS
BEGIN
    p_donor_id := seq_donor.NEXTVAL;
    
    INSERT INTO DONOR (donor_id, full_name, dob, blood_group, contact_no, city, is_eligible)
    VALUES (p_donor_id, p_full_name, p_dob, p_blood_group, p_contact_no, p_city, 'Y');
    
    DBMS_OUTPUT.PUT_LINE('Donor ' || p_full_name || ' added successfully with ID ' || p_donor_id);
EXCEPTION
    WHEN DUP_VAL_ON_INDEX THEN
        DBMS_OUTPUT.PUT_LINE('Error: Contact number already exists.');
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
END;
/

CREATE OR REPLACE PROCEDURE proc_update_request_status (
    p_request_id IN NUMBER,
    p_new_status IN VARCHAR2
) AS
BEGIN
    IF p_new_status NOT IN ('Pending', 'Approved', 'Rejected', 'Fulfilled') THEN
        RAISE_APPLICATION_ERROR(-20001, 'Invalid status value');
    END IF;
    
    UPDATE REQUEST
    SET status = p_new_status
    WHERE request_id = p_request_id;
    
    IF SQL%ROWCOUNT = 0 THEN
        RAISE_APPLICATION_ERROR(-20002, 'Request ID not found');
    END IF;
    
    DBMS_OUTPUT.PUT_LINE('Request ' || p_request_id || ' status updated to ' || p_new_status);
EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
        RAISE; -- Reraise application errors back to the caller
END;
/

CREATE OR REPLACE PROCEDURE proc_process_approved_request (
    p_request_id IN NUMBER
) AS
    v_blood_group VARCHAR2(5);
    v_units_needed NUMBER;
    v_ref_bank_id NUMBER;
    v_units_available NUMBER;
BEGIN
    SELECT blood_group, units_needed, ref_bank_id
    INTO v_blood_group, v_units_needed, v_ref_bank_id
    FROM REQUEST
    WHERE request_id = p_request_id;
    
    -- Check if we have stock for this specific bank and blood group
    BEGIN
        SELECT units_available
        INTO v_units_available
        FROM BLOOD_STOCK
        WHERE ref_bank_id = v_ref_bank_id AND blood_group = v_blood_group;
        
        IF v_units_available >= v_units_needed THEN
            UPDATE BLOOD_STOCK
            SET units_available = units_available - v_units_needed,
                last_updated = SYSDATE
            WHERE ref_bank_id = v_ref_bank_id AND blood_group = v_blood_group;
            
            proc_update_request_status(p_request_id, 'Approved');
        ELSE
            proc_update_request_status(p_request_id, 'Rejected');
            DBMS_OUTPUT.PUT_LINE('Insufficient stock for request ' || p_request_id || '. Request rejected.');
        END IF;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            proc_update_request_status(p_request_id, 'Rejected');
            DBMS_OUTPUT.PUT_LINE('No stock record found for request ' || p_request_id || '. Request rejected.');
    END;

EXCEPTION
    WHEN NO_DATA_FOUND THEN
        DBMS_OUTPUT.PUT_LINE('Request not found');
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
END;
/

-- ===== SECTION 2: FUNCTIONS =====

CREATE OR REPLACE FUNCTION fn_get_donor_count (
    p_blood_group IN VARCHAR2
) RETURN NUMBER AS
    v_count NUMBER;
BEGIN
    SELECT COUNT(*)
    INTO v_count
    FROM DONOR
    WHERE blood_group = p_blood_group AND is_eligible = 'Y';
    
    RETURN v_count;
END;
/

CREATE OR REPLACE FUNCTION fn_calculate_stock_level (
    p_bank_id IN NUMBER,
    p_blood_group IN VARCHAR2
) RETURN NUMBER AS
    v_total_units NUMBER;
BEGIN
    SELECT units_available
    INTO v_total_units
    FROM BLOOD_STOCK
    WHERE ref_bank_id = p_bank_id AND blood_group = p_blood_group;
    
    RETURN v_total_units;
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        RETURN 0;
END;
/

-- ===== SECTION 3: TRIGGERS =====

CREATE OR REPLACE TRIGGER trg_before_donor_ins
BEFORE INSERT ON DONOR
FOR EACH ROW
BEGIN
    :NEW.full_name := UPPER(:NEW.full_name);
    
    -- Note: DONOR does not have created_at in DDL, so setting it is skipped to prevent compilation errors.
    
    IF :NEW.blood_group IS NULL THEN
        RAISE_APPLICATION_ERROR(-20003, 'Blood group cannot be null');
    END IF;
END;
/

CREATE OR REPLACE TRIGGER trg_after_donation_ins
AFTER INSERT ON DONATION
FOR EACH ROW
DECLARE
    v_stock_count NUMBER;
BEGIN
    SELECT COUNT(*)
    INTO v_stock_count
    FROM BLOOD_STOCK
    WHERE ref_bank_id = :NEW.ref_bank_id AND blood_group = :NEW.blood_group;
    
    IF v_stock_count > 0 THEN
        UPDATE BLOOD_STOCK
        SET units_available = units_available + :NEW.units_donated,
            last_updated = SYSDATE
        WHERE ref_bank_id = :NEW.ref_bank_id AND blood_group = :NEW.blood_group;
    ELSE
        INSERT INTO BLOOD_STOCK (stock_id, ref_bank_id, blood_group, units_available, last_updated)
        VALUES (seq_blood_stock.NEXTVAL, :NEW.ref_bank_id, :NEW.blood_group, :NEW.units_donated, SYSDATE);
    END IF;
END;
/

CREATE TABLE REQUEST_AUDIT (
    audit_id NUMBER PRIMARY KEY,
    request_id NUMBER,
    recipient_id NUMBER,
    blood_group VARCHAR2(5),
    units_needed NUMBER,
    status VARCHAR2(20),
    deleted_at DATE DEFAULT SYSDATE
);

CREATE SEQUENCE seq_audit START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;

CREATE OR REPLACE TRIGGER trg_after_request_del
AFTER DELETE ON REQUEST
FOR EACH ROW
BEGIN
    INSERT INTO REQUEST_AUDIT (audit_id, request_id, recipient_id, blood_group, units_needed, status, deleted_at)
    VALUES (seq_audit.NEXTVAL, :OLD.request_id, :OLD.ref_recipient_id, :OLD.blood_group, :OLD.units_needed, :OLD.status, SYSDATE);
END;
/

-- ===== SECTION 4: CURSORS (inside anonymous blocks) =====

BEGIN
    DBMS_OUTPUT.PUT_LINE('--- Explicit Cursor Output ---');
    DECLARE
        CURSOR c_eligible_donors IS
            SELECT donor_id, full_name, blood_group
            FROM DONOR
            WHERE is_eligible = 'Y';
        v_donor_id DONOR.donor_id%TYPE;
        v_full_name DONOR.full_name%TYPE;
        v_blood_group DONOR.blood_group%TYPE;
    BEGIN
        OPEN c_eligible_donors;
        LOOP
            FETCH c_eligible_donors INTO v_donor_id, v_full_name, v_blood_group;
            EXIT WHEN c_eligible_donors%NOTFOUND;
            DBMS_OUTPUT.PUT_LINE('Donor ID: ' || v_donor_id || ', Name: ' || v_full_name || ', Group: ' || v_blood_group);
        END LOOP;
        CLOSE c_eligible_donors;
    END;
END;
/

BEGIN
    DBMS_OUTPUT.PUT_LINE('--- Parameterized Cursor Output ---');
    DECLARE
        CURSOR c_requests_by_blood (p_bg VARCHAR2) IS
            SELECT request_id, units_needed, status
            FROM REQUEST
            WHERE blood_group = p_bg;
        v_req_id REQUEST.request_id%TYPE;
        v_units REQUEST.units_needed%TYPE;
        v_status REQUEST.status%TYPE;
    BEGIN
        OPEN c_requests_by_blood('O+');
        LOOP
            FETCH c_requests_by_blood INTO v_req_id, v_units, v_status;
            EXIT WHEN c_requests_by_blood%NOTFOUND;
            DBMS_OUTPUT.PUT_LINE('Request ID: ' || v_req_id || ', Units: ' || v_units || ', Status: ' || v_status);
        END LOOP;
        CLOSE c_requests_by_blood;
    END;
END;
/

-- ===== SECTION 5: PACKAGE =====

CREATE OR REPLACE PACKAGE pkg_blood_network AS
    MAX_UNITS_PER_DONATION CONSTANT NUMBER := 3;
    PROCEDURE proc_show_bank_summary(p_bank_id IN NUMBER);
    PROCEDURE proc_flag_ineligible_donors;
    FUNCTION fn_total_stock(p_bank_id IN NUMBER) RETURN NUMBER;
END pkg_blood_network;
/

CREATE OR REPLACE PACKAGE BODY pkg_blood_network AS

    PROCEDURE proc_show_bank_summary(p_bank_id IN NUMBER) IS
        v_bank_name BLOOD_BANK.bank_name%TYPE;
        v_city BLOOD_BANK.city%TYPE;
        v_capacity BLOOD_BANK.capacity%TYPE;
        v_total_donations NUMBER;
    BEGIN
        SELECT bank_name, city, capacity
        INTO v_bank_name, v_city, v_capacity
        FROM BLOOD_BANK
        WHERE bank_id = p_bank_id;
        
        SELECT COUNT(*)
        INTO v_total_donations
        FROM DONATION
        WHERE ref_bank_id = p_bank_id;
        
        DBMS_OUTPUT.PUT_LINE('Bank: ' || v_bank_name || ', City: ' || v_city || ', Capacity: ' || v_capacity || ', Total Donations: ' || v_total_donations);
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            DBMS_OUTPUT.PUT_LINE('Bank ID ' || p_bank_id || ' not found.');
    END proc_show_bank_summary;

    PROCEDURE proc_flag_ineligible_donors IS
        v_rows_updated NUMBER;
    BEGIN
        UPDATE DONOR
        SET is_eligible = 'N'
        WHERE donor_id IN (
            SELECT ref_donor_id
            FROM DONATION
            WHERE donation_date >= SYSDATE - 90
        );
        
        v_rows_updated := SQL%ROWCOUNT;
        DBMS_OUTPUT.PUT_LINE('Flagged ' || v_rows_updated || ' donors as ineligible.');
    END proc_flag_ineligible_donors;

    FUNCTION fn_total_stock(p_bank_id IN NUMBER) RETURN NUMBER IS
        v_total NUMBER;
    BEGIN
        SELECT SUM(units_available)
        INTO v_total
        FROM BLOOD_STOCK
        WHERE ref_bank_id = p_bank_id;
        
        RETURN NVL(v_total, 0);
    END fn_total_stock;

END pkg_blood_network;
/

BEGIN
    DBMS_OUTPUT.PUT_LINE('--- Package Execution ---');
    pkg_blood_network.proc_show_bank_summary(1);
    pkg_blood_network.proc_flag_ineligible_donors;
    DBMS_OUTPUT.PUT_LINE('Total stock for bank 1: ' || pkg_blood_network.fn_total_stock(1));
END;
/

-- ===== SECTION 6: ANONYMOUS BLOCKS =====

BEGIN
    DBMS_OUTPUT.PUT_LINE('--- Control Flow Block ---');
    DECLARE
        v_total_donors NUMBER;
    BEGIN
        SELECT COUNT(*) INTO v_total_donors FROM DONOR;
        
        IF v_total_donors > 20 THEN
            DBMS_OUTPUT.PUT_LINE('Donor pool is healthy');
        ELSIF v_total_donors > 10 THEN
            DBMS_OUTPUT.PUT_LINE('Donor pool is moderate');
        ELSE
            DBMS_OUTPUT.PUT_LINE('Donor pool is critically low');
        END IF;
        
        FOR i IN 1..3 LOOP
            DBMS_OUTPUT.PUT_LINE('Blood group check ' || i);
        END LOOP;
    EXCEPTION
        WHEN OTHERS THEN
            DBMS_OUTPUT.PUT_LINE('Error in pool check: ' || SQLERRM);
    END;
END;
/

BEGIN
    DBMS_OUTPUT.PUT_LINE('--- Add Donor Block ---');
    DECLARE
        v_full_name VARCHAR2(100) := 'Test Donor';
        v_dob DATE := TO_DATE('1995-05-10', 'YYYY-MM-DD');
        v_blood_group VARCHAR2(5) := 'B+';
        v_contact_no VARCHAR2(20) := '0300-9999999';
        v_city VARCHAR2(50) := 'Karachi';
        v_new_id NUMBER;
    BEGIN
        proc_add_donor(v_full_name, v_dob, v_blood_group, v_contact_no, v_city, v_new_id);
        DBMS_OUTPUT.PUT_LINE('Successfully returned new ID: ' || v_new_id);
    EXCEPTION
        WHEN OTHERS THEN
            DBMS_OUTPUT.PUT_LINE('Error adding donor: ' || SQLERRM);
    END;
END;
/
