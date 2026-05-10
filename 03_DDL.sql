-- ============================================================
-- Project  : Blood Donor Network
-- Script   : 03_DDL.sql
-- Members  : Abdul Ahad (24F-0727), Jazib (24F-0691)
-- Date     : 10-May-2026
-- Purpose  : DDL — Create all tables with constraints, indexes, views
-- ============================================================

-- Section: HOSPITAL

-- 3NF: No partial dependencies (single-col PK). No transitive dependencies.
CREATE TABLE HOSPITAL (
    hospital_id NUMBER,
    hospital_name VARCHAR2(100) NOT NULL,
    city VARCHAR2(50) NOT NULL,
    contact_no VARCHAR2(20),
    CONSTRAINT pk_hospital PRIMARY KEY (hospital_id)
);

-- Section: BLOOD_BANK

-- 3NF: No partial dependencies (single-col PK). No transitive dependencies.
CREATE TABLE BLOOD_BANK (
    bank_id NUMBER,
    bank_name VARCHAR2(100) NOT NULL,
    city VARCHAR2(50) NOT NULL,
    contact_no VARCHAR2(20),
    capacity NUMBER,
    established_date DATE,
    CONSTRAINT pk_blood_bank PRIMARY KEY (bank_id)
);

-- Section: DONOR

-- 3NF: No partial dependencies (single-col PK). No transitive dependencies.
CREATE TABLE DONOR (
    donor_id NUMBER,
    full_name VARCHAR2(100) NOT NULL,
    dob DATE NOT NULL,
    blood_group VARCHAR2(5),
    contact_no VARCHAR2(20),
    city VARCHAR2(50),
    is_eligible CHAR(1) DEFAULT 'Y',
    CONSTRAINT pk_donor PRIMARY KEY (donor_id),
    CONSTRAINT uq_donor_contact UNIQUE (contact_no),
    CONSTRAINT chk_donor_blood_group CHECK (blood_group IN ('A+','A-','B+','B-','AB+','AB-','O+','O-')),
    CONSTRAINT chk_donor_is_eligible CHECK (is_eligible IN ('Y','N'))
);

-- Section: STAFF

-- 3NF: No partial dependencies (single-col PK). No transitive dependencies.
CREATE TABLE STAFF (
    staff_id NUMBER,
    full_name VARCHAR2(100) NOT NULL,
    role VARCHAR2(50) NOT NULL,
    ref_bank_id NUMBER,
    username VARCHAR2(50),
    password_hash VARCHAR2(255),
    hire_date DATE,
    CONSTRAINT pk_staff PRIMARY KEY (staff_id),
    CONSTRAINT uq_staff_username UNIQUE (username),
    CONSTRAINT fk_staff_bank FOREIGN KEY (ref_bank_id) REFERENCES BLOOD_BANK(bank_id)
);

-- Section: ADMIN_STAFF

-- 3NF: No partial dependencies (single-col PK). No transitive dependencies.
CREATE TABLE ADMIN_STAFF (
    admin_id NUMBER,
    ref_staff_id NUMBER,
    admin_level NUMBER NOT NULL,
    can_approve CHAR(1),
    CONSTRAINT pk_admin_staff PRIMARY KEY (admin_id),
    CONSTRAINT fk_admin_staff FOREIGN KEY (ref_staff_id) REFERENCES STAFF(staff_id) ON DELETE CASCADE,
    CONSTRAINT chk_admin_approve CHECK (can_approve IN ('Y','N'))
);

-- Section: TECHNICIAN

-- 3NF: No partial dependencies (single-col PK). No transitive dependencies.
CREATE TABLE TECHNICIAN (
    tech_id NUMBER,
    ref_staff_id NUMBER,
    specialization VARCHAR2(100) NOT NULL,
    lab_certified CHAR(1),
    CONSTRAINT pk_technician PRIMARY KEY (tech_id),
    CONSTRAINT fk_technician_staff FOREIGN KEY (ref_staff_id) REFERENCES STAFF(staff_id) ON DELETE CASCADE,
    CONSTRAINT chk_tech_certified CHECK (lab_certified IN ('Y','N'))
);

-- Section: RECIPIENT

-- 3NF: No partial dependencies (single-col PK). No transitive dependencies.
CREATE TABLE RECIPIENT (
    recipient_id NUMBER,
    full_name VARCHAR2(100) NOT NULL,
    blood_group VARCHAR2(5) NOT NULL,
    contact_no VARCHAR2(20),
    ref_hospital_id NUMBER,
    admitted_date DATE,
    CONSTRAINT pk_recipient PRIMARY KEY (recipient_id),
    CONSTRAINT fk_recipient_hospital FOREIGN KEY (ref_hospital_id) REFERENCES HOSPITAL(hospital_id) ON DELETE SET NULL,
    CONSTRAINT chk_recipient_blood_group CHECK (blood_group IN ('A+','A-','B+','B-','AB+','AB-','O+','O-'))
);

-- Section: DONATION

-- 3NF: No partial dependencies (single-col PK). No transitive dependencies.
CREATE TABLE DONATION (
    donation_id NUMBER,
    ref_donor_id NUMBER NOT NULL,
    ref_bank_id NUMBER,
    donation_date DATE NOT NULL,
    units_donated NUMBER,
    blood_group VARCHAR2(5),
    CONSTRAINT pk_donation PRIMARY KEY (donation_id),
    CONSTRAINT fk_donation_donor FOREIGN KEY (ref_donor_id) REFERENCES DONOR(donor_id) ON DELETE CASCADE,
    CONSTRAINT fk_donation_bank FOREIGN KEY (ref_bank_id) REFERENCES BLOOD_BANK(bank_id),
    CONSTRAINT chk_donation_units CHECK (units_donated > 0)
);

-- Section: BLOOD_STOCK

-- 3NF: No partial dependencies (single-col PK). No transitive dependencies.
CREATE TABLE BLOOD_STOCK (
    stock_id NUMBER,
    ref_bank_id NUMBER,
    blood_group VARCHAR2(5) NOT NULL,
    units_available NUMBER,
    last_updated DATE DEFAULT SYSDATE,
    CONSTRAINT pk_blood_stock PRIMARY KEY (stock_id),
    CONSTRAINT fk_stock_bank FOREIGN KEY (ref_bank_id) REFERENCES BLOOD_BANK(bank_id)
);

-- Section: REQUEST

-- 3NF: No partial dependencies (single-col PK). No transitive dependencies.
CREATE TABLE REQUEST (
    request_id NUMBER,
    ref_recipient_id NUMBER NOT NULL,
    ref_bank_id NUMBER,
    blood_group VARCHAR2(5) NOT NULL,
    units_needed NUMBER,
    status VARCHAR2(20) DEFAULT 'Pending',
    request_date DATE DEFAULT SYSDATE,
    CONSTRAINT pk_request PRIMARY KEY (request_id),
    CONSTRAINT fk_request_recipient FOREIGN KEY (ref_recipient_id) REFERENCES RECIPIENT(recipient_id),
    CONSTRAINT fk_request_bank FOREIGN KEY (ref_bank_id) REFERENCES BLOOD_BANK(bank_id) ON DELETE SET NULL,
    CONSTRAINT chk_request_status CHECK (status IN ('Pending','Approved','Rejected','Fulfilled'))
);

-- Section: HOSPITAL_BANK

-- 3NF: No partial dependencies (single-col PK). No transitive dependencies.
CREATE TABLE HOSPITAL_BANK (
    hb_id NUMBER,
    ref_hospital_id NUMBER,
    ref_bank_id NUMBER,
    CONSTRAINT pk_hospital_bank PRIMARY KEY (hb_id),
    CONSTRAINT fk_hb_hospital FOREIGN KEY (ref_hospital_id) REFERENCES HOSPITAL(hospital_id),
    CONSTRAINT fk_hb_bank FOREIGN KEY (ref_bank_id) REFERENCES BLOOD_BANK(bank_id)
);

-- Section: Sequences

CREATE SEQUENCE seq_hospital     START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;
CREATE SEQUENCE seq_blood_bank   START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;
CREATE SEQUENCE seq_donor        START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;
CREATE SEQUENCE seq_staff        START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;
CREATE SEQUENCE seq_admin_staff  START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;
CREATE SEQUENCE seq_technician   START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;
CREATE SEQUENCE seq_recipient    START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;
CREATE SEQUENCE seq_donation     START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;
CREATE SEQUENCE seq_blood_stock  START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;
CREATE SEQUENCE seq_request      START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;
CREATE SEQUENCE seq_hospital_bank START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;

-- Section: Indexes

CREATE INDEX idx_donor_name ON DONOR(full_name);
CREATE INDEX idx_stock_bank ON BLOOD_STOCK(ref_bank_id);

-- Section: Views

CREATE OR REPLACE VIEW vw_active_donors AS
    SELECT donor_id, full_name, blood_group, city
    FROM DONOR WHERE is_eligible = 'Y';

CREATE OR REPLACE VIEW vw_pending_requests AS
    SELECT r.request_id, r.blood_group, r.units_needed, r.request_date,
           rc.full_name AS recipient_name, bb.bank_name
    FROM REQUEST r
    JOIN RECIPIENT rc ON r.ref_recipient_id = rc.recipient_id
    JOIN BLOOD_BANK bb ON r.ref_bank_id = bb.bank_id
    WHERE r.status = 'Pending';

COMMIT;
