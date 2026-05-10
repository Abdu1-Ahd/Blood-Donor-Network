-- ============================================================
-- Project  : Blood Donor Network
-- Script   : 04_DML_Inserts.sql
-- Members  : Abdul Ahad (24F-0727), Jazib (24F-0691)
-- Date     : 10-May-2026
-- Purpose  : DML — Populate all tables with realistic test data
-- ============================================================

-- Section: HOSPITAL Data
INSERT INTO HOSPITAL (hospital_id, hospital_name, city, contact_no) VALUES (seq_hospital.NEXTVAL, 'Shaukat Khanum Memorial', 'Lahore', '042-35905000');
INSERT INTO HOSPITAL (hospital_id, hospital_name, city, contact_no) VALUES (seq_hospital.NEXTVAL, 'Aga Khan University Hospital', 'Karachi', '021-34930051');
INSERT INTO HOSPITAL (hospital_id, hospital_name, city, contact_no) VALUES (seq_hospital.NEXTVAL, 'PIMS', 'Islamabad', '051-9261170');
INSERT INTO HOSPITAL (hospital_id, hospital_name, city, contact_no) VALUES (seq_hospital.NEXTVAL, 'Allied Hospital', 'Faisalabad', '041-9210080');
INSERT INTO HOSPITAL (hospital_id, hospital_name, city, contact_no) VALUES (seq_hospital.NEXTVAL, 'Lady Reading Hospital', 'Peshawar', '091-9211430');
INSERT INTO HOSPITAL (hospital_id, hospital_name, city, contact_no) VALUES (seq_hospital.NEXTVAL, 'Nishtar Hospital', 'Multan', '061-9200231');
INSERT INTO HOSPITAL (hospital_id, hospital_name, city, contact_no) VALUES (seq_hospital.NEXTVAL, 'Holy Family Hospital', 'Rawalpindi', '051-9290321');
INSERT INTO HOSPITAL (hospital_id, hospital_name, city, contact_no) VALUES (seq_hospital.NEXTVAL, 'Civil Hospital', 'Quetta', '081-9202012');
INSERT INTO HOSPITAL (hospital_id, hospital_name, city, contact_no) VALUES (seq_hospital.NEXTVAL, 'Jinnah Hospital', 'Lahore', '042-99231400');
INSERT INTO HOSPITAL (hospital_id, hospital_name, city, contact_no) VALUES (seq_hospital.NEXTVAL, 'Ziauddin Hospital', 'Karachi', '021-36648237');
COMMIT;

-- Section: BLOOD_BANK Data
INSERT INTO BLOOD_BANK (bank_id, bank_name, city, contact_no, capacity, established_date) VALUES (seq_blood_bank.NEXTVAL, 'Sundas Foundation', 'Lahore', '042-35955000', 5000, TO_DATE('1998-05-12', 'YYYY-MM-DD'));
INSERT INTO BLOOD_BANK (bank_id, bank_name, city, contact_no, capacity, established_date) VALUES (seq_blood_bank.NEXTVAL, 'Hussaini Blood Bank', 'Karachi', '021-32250051', 10000, TO_DATE('1979-11-20', 'YYYY-MM-DD'));
INSERT INTO BLOOD_BANK (bank_id, bank_name, city, contact_no, capacity, established_date) VALUES (seq_blood_bank.NEXTVAL, 'PRCS Blood Centre', 'Islamabad', '051-9250404', 3000, TO_DATE('2005-08-14', 'YYYY-MM-DD'));
INSERT INTO BLOOD_BANK (bank_id, bank_name, city, contact_no, capacity, established_date) VALUES (seq_blood_bank.NEXTVAL, 'Fatimid Foundation', 'Faisalabad', '041-2621814', 4500, TO_DATE('1985-02-18', 'YYYY-MM-DD'));
INSERT INTO BLOOD_BANK (bank_id, bank_name, city, contact_no, capacity, established_date) VALUES (seq_blood_bank.NEXTVAL, 'Al-Khidmat Blood Bank', 'Peshawar', '091-2211111', 2500, TO_DATE('2010-09-01', 'YYYY-MM-DD'));
INSERT INTO BLOOD_BANK (bank_id, bank_name, city, contact_no, capacity, established_date) VALUES (seq_blood_bank.NEXTVAL, 'Mina Blood Bank', 'Multan', '061-6512345', 1500, TO_DATE('2015-06-30', 'YYYY-MM-DD'));
INSERT INTO BLOOD_BANK (bank_id, bank_name, city, contact_no, capacity, established_date) VALUES (seq_blood_bank.NEXTVAL, 'Rawalpindi Blood Society', 'Rawalpindi', '051-4455667', 3500, TO_DATE('2000-01-15', 'YYYY-MM-DD'));
INSERT INTO BLOOD_BANK (bank_id, bank_name, city, contact_no, capacity, established_date) VALUES (seq_blood_bank.NEXTVAL, 'Quetta Blood Centre', 'Quetta', '081-2821111', 2000, TO_DATE('2012-04-10', 'YYYY-MM-DD'));
INSERT INTO BLOOD_BANK (bank_id, bank_name, city, contact_no, capacity, established_date) VALUES (seq_blood_bank.NEXTVAL, 'Life Savers Lahore', 'Lahore', '042-35889900', 4000, TO_DATE('2018-12-05', 'YYYY-MM-DD'));
INSERT INTO BLOOD_BANK (bank_id, bank_name, city, contact_no, capacity, established_date) VALUES (seq_blood_bank.NEXTVAL, 'Sindh Blood Bank', 'Karachi', '021-34981122', 8000, TO_DATE('1990-07-25', 'YYYY-MM-DD'));
COMMIT;

-- Section: DONOR Data
INSERT INTO DONOR (donor_id, full_name, dob, blood_group, contact_no, city, is_eligible) VALUES (seq_donor.NEXTVAL, 'Ali Raza', TO_DATE('1990-05-15', 'YYYY-MM-DD'), 'A+', '0300-1234567', 'Lahore', 'Y');
INSERT INTO DONOR (donor_id, full_name, dob, blood_group, contact_no, city, is_eligible) VALUES (seq_donor.NEXTVAL, 'Hassan Ali', TO_DATE('1985-08-20', 'YYYY-MM-DD'), 'O+', '0333-2345678', 'Karachi', 'Y');
INSERT INTO DONOR (donor_id, full_name, dob, blood_group, contact_no, city, is_eligible) VALUES (seq_donor.NEXTVAL, 'Fatima Noor', TO_DATE('1995-12-10', 'YYYY-MM-DD'), 'B+', '0321-3456789', 'Islamabad', 'Y');
INSERT INTO DONOR (donor_id, full_name, dob, blood_group, contact_no, city, is_eligible) VALUES (seq_donor.NEXTVAL, 'Ayesha Khan', TO_DATE('1988-03-25', 'YYYY-MM-DD'), 'AB+', '0301-4567890', 'Faisalabad', 'N');
INSERT INTO DONOR (donor_id, full_name, dob, blood_group, contact_no, city, is_eligible) VALUES (seq_donor.NEXTVAL, 'Bilal Ahmed', TO_DATE('1992-07-30', 'YYYY-MM-DD'), 'A-', '0345-5678901', 'Peshawar', 'Y');
INSERT INTO DONOR (donor_id, full_name, dob, blood_group, contact_no, city, is_eligible) VALUES (seq_donor.NEXTVAL, 'Zainab Bibi', TO_DATE('1980-11-12', 'YYYY-MM-DD'), 'O-', '0312-6789012', 'Multan', 'Y');
INSERT INTO DONOR (donor_id, full_name, dob, blood_group, contact_no, city, is_eligible) VALUES (seq_donor.NEXTVAL, 'Usman Tariq', TO_DATE('1998-02-18', 'YYYY-MM-DD'), 'B-', '0300-7890123', 'Rawalpindi', 'Y');
INSERT INTO DONOR (donor_id, full_name, dob, blood_group, contact_no, city, is_eligible) VALUES (seq_donor.NEXTVAL, 'Sara Baloch', TO_DATE('1991-09-05', 'YYYY-MM-DD'), 'AB-', '0333-8901234', 'Quetta', 'N');
INSERT INTO DONOR (donor_id, full_name, dob, blood_group, contact_no, city, is_eligible) VALUES (seq_donor.NEXTVAL, 'Kamran Shah', TO_DATE('1983-04-14', 'YYYY-MM-DD'), 'O+', '0321-9012345', 'Lahore', 'Y');
INSERT INTO DONOR (donor_id, full_name, dob, blood_group, contact_no, city, is_eligible) VALUES (seq_donor.NEXTVAL, 'Sadia Malik', TO_DATE('1996-01-22', 'YYYY-MM-DD'), 'A+', '0301-0123456', 'Karachi', 'Y');
INSERT INTO DONOR (donor_id, full_name, dob, blood_group, contact_no, city, is_eligible) VALUES (seq_donor.NEXTVAL, 'Omer Farooq', TO_DATE('1987-10-08', 'YYYY-MM-DD'), 'B+', '0345-1122334', 'Islamabad', 'Y');
INSERT INTO DONOR (donor_id, full_name, dob, blood_group, contact_no, city, is_eligible) VALUES (seq_donor.NEXTVAL, 'Hina Jamil', TO_DATE('1994-06-16', 'YYYY-MM-DD'), 'O+', '0312-2233445', 'Faisalabad', 'Y');
INSERT INTO DONOR (donor_id, full_name, dob, blood_group, contact_no, city, is_eligible) VALUES (seq_donor.NEXTVAL, 'Adnan Khan', TO_DATE('1989-12-01', 'YYYY-MM-DD'), 'A-', '0300-3344556', 'Peshawar', 'N');
INSERT INTO DONOR (donor_id, full_name, dob, blood_group, contact_no, city, is_eligible) VALUES (seq_donor.NEXTVAL, 'Maryam Nawaz', TO_DATE('1993-08-19', 'YYYY-MM-DD'), 'AB+', '0333-4455667', 'Multan', 'Y');
INSERT INTO DONOR (donor_id, full_name, dob, blood_group, contact_no, city, is_eligible) VALUES (seq_donor.NEXTVAL, 'Faizan Qureshi', TO_DATE('1997-03-28', 'YYYY-MM-DD'), 'B+', '0321-5566778', 'Rawalpindi', 'Y');
INSERT INTO DONOR (donor_id, full_name, dob, blood_group, contact_no, city, is_eligible) VALUES (seq_donor.NEXTVAL, 'Sanaullah Khan', TO_DATE('1981-05-04', 'YYYY-MM-DD'), 'O-', '0301-6677889', 'Quetta', 'Y');
INSERT INTO DONOR (donor_id, full_name, dob, blood_group, contact_no, city, is_eligible) VALUES (seq_donor.NEXTVAL, 'Rabia Sheikh', TO_DATE('1986-11-23', 'YYYY-MM-DD'), 'A+', '0345-7788990', 'Lahore', 'Y');
INSERT INTO DONOR (donor_id, full_name, dob, blood_group, contact_no, city, is_eligible) VALUES (seq_donor.NEXTVAL, 'Hamza Iqbal', TO_DATE('1999-07-11', 'YYYY-MM-DD'), 'O+', '0312-8899001', 'Karachi', 'N');
INSERT INTO DONOR (donor_id, full_name, dob, blood_group, contact_no, city, is_eligible) VALUES (seq_donor.NEXTVAL, 'Kiran Aslam', TO_DATE('1990-02-09', 'YYYY-MM-DD'), 'B-', '0300-9900112', 'Islamabad', 'Y');
INSERT INTO DONOR (donor_id, full_name, dob, blood_group, contact_no, city, is_eligible) VALUES (seq_donor.NEXTVAL, 'Tariq Mehmood', TO_DATE('1984-09-17', 'YYYY-MM-DD'), 'AB-', '0333-0011223', 'Faisalabad', 'Y');
INSERT INTO DONOR (donor_id, full_name, dob, blood_group, contact_no, city, is_eligible) VALUES (seq_donor.NEXTVAL, 'Nida Yasir', TO_DATE('1995-04-26', 'YYYY-MM-DD'), 'A+', '0321-1122112', 'Peshawar', 'Y');
INSERT INTO DONOR (donor_id, full_name, dob, blood_group, contact_no, city, is_eligible) VALUES (seq_donor.NEXTVAL, 'Shoaib Akhtar', TO_DATE('1982-10-15', 'YYYY-MM-DD'), 'O+', '0301-2233223', 'Multan', 'Y');
INSERT INTO DONOR (donor_id, full_name, dob, blood_group, contact_no, city, is_eligible) VALUES (seq_donor.NEXTVAL, 'Amna Baig', TO_DATE('1992-06-21', 'YYYY-MM-DD'), 'B+', '0345-3344334', 'Rawalpindi', 'N');
INSERT INTO DONOR (donor_id, full_name, dob, blood_group, contact_no, city, is_eligible) VALUES (seq_donor.NEXTVAL, 'Junaid Safdar', TO_DATE('1988-12-30', 'YYYY-MM-DD'), 'AB+', '0312-4455445', 'Quetta', 'Y');
INSERT INTO DONOR (donor_id, full_name, dob, blood_group, contact_no, city, is_eligible) VALUES (seq_donor.NEXTVAL, 'Bushra Ansari', TO_DATE('1996-03-05', 'YYYY-MM-DD'), 'O-', '0300-5566556', 'Lahore', 'Y');
COMMIT;

-- Section: STAFF Data
INSERT INTO STAFF (staff_id, full_name, role, ref_bank_id, username, password_hash, hire_date) VALUES (seq_staff.NEXTVAL, 'Nadeem Shah', 'Admin', 1, 'nadeem_admin', 'hash123', TO_DATE('2015-01-10', 'YYYY-MM-DD'));
INSERT INTO STAFF (staff_id, full_name, role, ref_bank_id, username, password_hash, hire_date) VALUES (seq_staff.NEXTVAL, 'Salman Butt', 'Admin', 2, 'salman_admin', 'hash123', TO_DATE('2016-03-15', 'YYYY-MM-DD'));
INSERT INTO STAFF (staff_id, full_name, role, ref_bank_id, username, password_hash, hire_date) VALUES (seq_staff.NEXTVAL, 'Fahad Mustafa', 'Admin', 3, 'fahad_admin', 'hash123', TO_DATE('2017-05-20', 'YYYY-MM-DD'));
INSERT INTO STAFF (staff_id, full_name, role, ref_bank_id, username, password_hash, hire_date) VALUES (seq_staff.NEXTVAL, 'Asad Umar', 'Admin', 4, 'asad_admin', 'hash123', TO_DATE('2018-07-25', 'YYYY-MM-DD'));
INSERT INTO STAFF (staff_id, full_name, role, ref_bank_id, username, password_hash, hire_date) VALUES (seq_staff.NEXTVAL, 'Imran Khan', 'Admin', 5, 'imran_admin', 'hash123', TO_DATE('2019-09-30', 'YYYY-MM-DD'));
INSERT INTO STAFF (staff_id, full_name, role, ref_bank_id, username, password_hash, hire_date) VALUES (seq_staff.NEXTVAL, 'Shahid Afridi', 'Admin', 6, 'shahid_admin', 'hash123', TO_DATE('2020-11-05', 'YYYY-MM-DD'));
INSERT INTO STAFF (staff_id, full_name, role, ref_bank_id, username, password_hash, hire_date) VALUES (seq_staff.NEXTVAL, 'Younis Khan', 'Admin', 7, 'younis_admin', 'hash123', TO_DATE('2021-01-10', 'YYYY-MM-DD'));
INSERT INTO STAFF (staff_id, full_name, role, ref_bank_id, username, password_hash, hire_date) VALUES (seq_staff.NEXTVAL, 'Misbah ul Haq', 'Technician', 1, 'misbah_tech', 'hash123', TO_DATE('2015-02-15', 'YYYY-MM-DD'));
INSERT INTO STAFF (staff_id, full_name, role, ref_bank_id, username, password_hash, hire_date) VALUES (seq_staff.NEXTVAL, 'Babar Azam', 'Technician', 2, 'babar_tech', 'hash123', TO_DATE('2016-04-20', 'YYYY-MM-DD'));
INSERT INTO STAFF (staff_id, full_name, role, ref_bank_id, username, password_hash, hire_date) VALUES (seq_staff.NEXTVAL, 'Shaheen Afridi', 'Technician', 3, 'shaheen_tech', 'hash123', TO_DATE('2017-06-25', 'YYYY-MM-DD'));
INSERT INTO STAFF (staff_id, full_name, role, ref_bank_id, username, password_hash, hire_date) VALUES (seq_staff.NEXTVAL, 'Mohammad Rizwan', 'Technician', 4, 'rizwan_tech', 'hash123', TO_DATE('2018-08-30', 'YYYY-MM-DD'));
INSERT INTO STAFF (staff_id, full_name, role, ref_bank_id, username, password_hash, hire_date) VALUES (seq_staff.NEXTVAL, 'Shadab Khan', 'Technician', 5, 'shadab_tech', 'hash123', TO_DATE('2019-10-05', 'YYYY-MM-DD'));
INSERT INTO STAFF (staff_id, full_name, role, ref_bank_id, username, password_hash, hire_date) VALUES (seq_staff.NEXTVAL, 'Haris Rauf', 'Technician', 6, 'haris_tech', 'hash123', TO_DATE('2020-12-10', 'YYYY-MM-DD'));
INSERT INTO STAFF (staff_id, full_name, role, ref_bank_id, username, password_hash, hire_date) VALUES (seq_staff.NEXTVAL, 'Fakhar Zaman', 'Technician', 7, 'fakhar_tech', 'hash123', TO_DATE('2021-02-15', 'YYYY-MM-DD'));
INSERT INTO STAFF (staff_id, full_name, role, ref_bank_id, username, password_hash, hire_date) VALUES (seq_staff.NEXTVAL, 'Imam ul Haq', 'Technician', 8, 'imam_tech', 'hash123', TO_DATE('2022-04-20', 'YYYY-MM-DD'));
COMMIT;

-- Section: ADMIN_STAFF Data
INSERT INTO ADMIN_STAFF (admin_id, ref_staff_id, admin_level, can_approve) VALUES (seq_admin_staff.NEXTVAL, 1, 1, 'Y');
INSERT INTO ADMIN_STAFF (admin_id, ref_staff_id, admin_level, can_approve) VALUES (seq_admin_staff.NEXTVAL, 2, 2, 'Y');
INSERT INTO ADMIN_STAFF (admin_id, ref_staff_id, admin_level, can_approve) VALUES (seq_admin_staff.NEXTVAL, 3, 1, 'Y');
INSERT INTO ADMIN_STAFF (admin_id, ref_staff_id, admin_level, can_approve) VALUES (seq_admin_staff.NEXTVAL, 4, 3, 'N');
INSERT INTO ADMIN_STAFF (admin_id, ref_staff_id, admin_level, can_approve) VALUES (seq_admin_staff.NEXTVAL, 5, 2, 'Y');
INSERT INTO ADMIN_STAFF (admin_id, ref_staff_id, admin_level, can_approve) VALUES (seq_admin_staff.NEXTVAL, 6, 1, 'Y');
INSERT INTO ADMIN_STAFF (admin_id, ref_staff_id, admin_level, can_approve) VALUES (seq_admin_staff.NEXTVAL, 7, 2, 'N');
COMMIT;

-- Section: TECHNICIAN Data
INSERT INTO TECHNICIAN (tech_id, ref_staff_id, specialization, lab_certified) VALUES (seq_technician.NEXTVAL, 8, 'Phlebotomy', 'Y');
INSERT INTO TECHNICIAN (tech_id, ref_staff_id, specialization, lab_certified) VALUES (seq_technician.NEXTVAL, 9, 'Hematology', 'Y');
INSERT INTO TECHNICIAN (tech_id, ref_staff_id, specialization, lab_certified) VALUES (seq_technician.NEXTVAL, 10, 'Pathology', 'N');
INSERT INTO TECHNICIAN (tech_id, ref_staff_id, specialization, lab_certified) VALUES (seq_technician.NEXTVAL, 11, 'Blood Typing', 'Y');
INSERT INTO TECHNICIAN (tech_id, ref_staff_id, specialization, lab_certified) VALUES (seq_technician.NEXTVAL, 12, 'Phlebotomy', 'Y');
INSERT INTO TECHNICIAN (tech_id, ref_staff_id, specialization, lab_certified) VALUES (seq_technician.NEXTVAL, 13, 'Hematology', 'N');
INSERT INTO TECHNICIAN (tech_id, ref_staff_id, specialization, lab_certified) VALUES (seq_technician.NEXTVAL, 14, 'Pathology', 'Y');
INSERT INTO TECHNICIAN (tech_id, ref_staff_id, specialization, lab_certified) VALUES (seq_technician.NEXTVAL, 15, 'Blood Typing', 'Y');
COMMIT;

-- Section: RECIPIENT Data
INSERT INTO RECIPIENT (recipient_id, full_name, blood_group, contact_no, ref_hospital_id, admitted_date) VALUES (seq_recipient.NEXTVAL, 'Mubashir Hassan', 'A+', '0300-1112233', 1, TO_DATE('2025-01-10', 'YYYY-MM-DD'));
INSERT INTO RECIPIENT (recipient_id, full_name, blood_group, contact_no, ref_hospital_id, admitted_date) VALUES (seq_recipient.NEXTVAL, 'Jawad Ahmed', 'O+', '0333-2223344', 2, TO_DATE('2025-01-12', 'YYYY-MM-DD'));
INSERT INTO RECIPIENT (recipient_id, full_name, blood_group, contact_no, ref_hospital_id, admitted_date) VALUES (seq_recipient.NEXTVAL, 'Aqsa Riaz', 'B+', '0321-3334455', 3, TO_DATE('2025-01-15', 'YYYY-MM-DD'));
INSERT INTO RECIPIENT (recipient_id, full_name, blood_group, contact_no, ref_hospital_id, admitted_date) VALUES (seq_recipient.NEXTVAL, 'Zoya Ali', 'AB+', '0301-4445566', 4, TO_DATE('2025-01-18', 'YYYY-MM-DD'));
INSERT INTO RECIPIENT (recipient_id, full_name, blood_group, contact_no, ref_hospital_id, admitted_date) VALUES (seq_recipient.NEXTVAL, 'Wahab Riaz', 'A-', '0345-5556677', 5, TO_DATE('2025-01-20', 'YYYY-MM-DD'));
INSERT INTO RECIPIENT (recipient_id, full_name, blood_group, contact_no, ref_hospital_id, admitted_date) VALUES (seq_recipient.NEXTVAL, 'Ehsan Adil', 'O-', '0312-6667788', 6, TO_DATE('2025-01-22', 'YYYY-MM-DD'));
INSERT INTO RECIPIENT (recipient_id, full_name, blood_group, contact_no, ref_hospital_id, admitted_date) VALUES (seq_recipient.NEXTVAL, 'Rumman Raees', 'B-', '0300-7778899', 7, TO_DATE('2025-01-25', 'YYYY-MM-DD'));
INSERT INTO RECIPIENT (recipient_id, full_name, blood_group, contact_no, ref_hospital_id, admitted_date) VALUES (seq_recipient.NEXTVAL, 'Usama Mir', 'AB-', '0333-8889900', 8, TO_DATE('2025-01-28', 'YYYY-MM-DD'));
INSERT INTO RECIPIENT (recipient_id, full_name, blood_group, contact_no, ref_hospital_id, admitted_date) VALUES (seq_recipient.NEXTVAL, 'Zaman Khan', 'O+', '0321-9990011', 9, TO_DATE('2025-02-01', 'YYYY-MM-DD'));
INSERT INTO RECIPIENT (recipient_id, full_name, blood_group, contact_no, ref_hospital_id, admitted_date) VALUES (seq_recipient.NEXTVAL, 'Abrar Ahmed', 'A+', '0301-0001122', 10, TO_DATE('2025-02-05', 'YYYY-MM-DD'));
INSERT INTO RECIPIENT (recipient_id, full_name, blood_group, contact_no, ref_hospital_id, admitted_date) VALUES (seq_recipient.NEXTVAL, 'Noman Ali', 'B+', '0345-1112233', 1, TO_DATE('2025-02-10', 'YYYY-MM-DD'));
INSERT INTO RECIPIENT (recipient_id, full_name, blood_group, contact_no, ref_hospital_id, admitted_date) VALUES (seq_recipient.NEXTVAL, 'Sajid Khan', 'O+', '0312-2223344', 2, TO_DATE('2025-02-15', 'YYYY-MM-DD'));
INSERT INTO RECIPIENT (recipient_id, full_name, blood_group, contact_no, ref_hospital_id, admitted_date) VALUES (seq_recipient.NEXTVAL, 'Salman Ali Agha', 'A-', '0300-3334455', 3, TO_DATE('2025-02-20', 'YYYY-MM-DD'));
INSERT INTO RECIPIENT (recipient_id, full_name, blood_group, contact_no, ref_hospital_id, admitted_date) VALUES (seq_recipient.NEXTVAL, 'Saud Shakeel', 'AB+', '0333-4445566', 4, TO_DATE('2025-02-25', 'YYYY-MM-DD'));
INSERT INTO RECIPIENT (recipient_id, full_name, blood_group, contact_no, ref_hospital_id, admitted_date) VALUES (seq_recipient.NEXTVAL, 'Abdullah Shafique', 'B-', '0321-5556677', 5, TO_DATE('2025-03-01', 'YYYY-MM-DD'));
INSERT INTO RECIPIENT (recipient_id, full_name, blood_group, contact_no, ref_hospital_id, admitted_date) VALUES (seq_recipient.NEXTVAL, 'Shan Masood', 'O-', '0301-6667788', 6, TO_DATE('2025-03-05', 'YYYY-MM-DD'));
INSERT INTO RECIPIENT (recipient_id, full_name, blood_group, contact_no, ref_hospital_id, admitted_date) VALUES (seq_recipient.NEXTVAL, 'Saim Ayub', 'A+', '0345-7778899', 7, TO_DATE('2025-03-10', 'YYYY-MM-DD'));
INSERT INTO RECIPIENT (recipient_id, full_name, blood_group, contact_no, ref_hospital_id, admitted_date) VALUES (seq_recipient.NEXTVAL, 'Mohammad Haris', 'O+', '0312-8889900', 8, TO_DATE('2025-03-15', 'YYYY-MM-DD'));
INSERT INTO RECIPIENT (recipient_id, full_name, blood_group, contact_no, ref_hospital_id, admitted_date) VALUES (seq_recipient.NEXTVAL, 'Azam Khan', 'B+', '0300-9990011', 9, TO_DATE('2025-03-20', 'YYYY-MM-DD'));
INSERT INTO RECIPIENT (recipient_id, full_name, blood_group, contact_no, ref_hospital_id, admitted_date) VALUES (seq_recipient.NEXTVAL, 'Iftikhar Ahmed', 'AB-', '0333-0001122', 10, TO_DATE('2025-03-25', 'YYYY-MM-DD'));
COMMIT;

-- Section: DONATION Data
INSERT INTO DONATION (donation_id, ref_donor_id, ref_bank_id, donation_date, units_donated, blood_group) VALUES (seq_donation.NEXTVAL, 1, 1, TO_DATE('2024-05-10', 'YYYY-MM-DD'), 1, 'A+');
INSERT INTO DONATION (donation_id, ref_donor_id, ref_bank_id, donation_date, units_donated, blood_group) VALUES (seq_donation.NEXTVAL, 2, 2, TO_DATE('2024-06-15', 'YYYY-MM-DD'), 2, 'O+');
INSERT INTO DONATION (donation_id, ref_donor_id, ref_bank_id, donation_date, units_donated, blood_group) VALUES (seq_donation.NEXTVAL, 3, 3, TO_DATE('2024-07-20', 'YYYY-MM-DD'), 1, 'B+');
INSERT INTO DONATION (donation_id, ref_donor_id, ref_bank_id, donation_date, units_donated, blood_group) VALUES (seq_donation.NEXTVAL, 4, 4, TO_DATE('2024-08-25', 'YYYY-MM-DD'), 1, 'AB+');
INSERT INTO DONATION (donation_id, ref_donor_id, ref_bank_id, donation_date, units_donated, blood_group) VALUES (seq_donation.NEXTVAL, 5, 5, TO_DATE('2024-09-30', 'YYYY-MM-DD'), 2, 'A-');
INSERT INTO DONATION (donation_id, ref_donor_id, ref_bank_id, donation_date, units_donated, blood_group) VALUES (seq_donation.NEXTVAL, 6, 6, TO_DATE('2024-10-05', 'YYYY-MM-DD'), 1, 'O-');
INSERT INTO DONATION (donation_id, ref_donor_id, ref_bank_id, donation_date, units_donated, blood_group) VALUES (seq_donation.NEXTVAL, 7, 7, TO_DATE('2024-11-10', 'YYYY-MM-DD'), 3, 'B-');
INSERT INTO DONATION (donation_id, ref_donor_id, ref_bank_id, donation_date, units_donated, blood_group) VALUES (seq_donation.NEXTVAL, 8, 8, TO_DATE('2024-12-15', 'YYYY-MM-DD'), 1, 'AB-');
INSERT INTO DONATION (donation_id, ref_donor_id, ref_bank_id, donation_date, units_donated, blood_group) VALUES (seq_donation.NEXTVAL, 9, 9, TO_DATE('2025-01-20', 'YYYY-MM-DD'), 2, 'O+');
INSERT INTO DONATION (donation_id, ref_donor_id, ref_bank_id, donation_date, units_donated, blood_group) VALUES (seq_donation.NEXTVAL, 10, 10, TO_DATE('2025-02-25', 'YYYY-MM-DD'), 1, 'A+');
INSERT INTO DONATION (donation_id, ref_donor_id, ref_bank_id, donation_date, units_donated, blood_group) VALUES (seq_donation.NEXTVAL, 11, 1, TO_DATE('2025-03-01', 'YYYY-MM-DD'), 1, 'B+');
INSERT INTO DONATION (donation_id, ref_donor_id, ref_bank_id, donation_date, units_donated, blood_group) VALUES (seq_donation.NEXTVAL, 12, 2, TO_DATE('2025-04-05', 'YYYY-MM-DD'), 2, 'O+');
INSERT INTO DONATION (donation_id, ref_donor_id, ref_bank_id, donation_date, units_donated, blood_group) VALUES (seq_donation.NEXTVAL, 13, 3, TO_DATE('2025-05-10', 'YYYY-MM-DD'), 1, 'A-');
INSERT INTO DONATION (donation_id, ref_donor_id, ref_bank_id, donation_date, units_donated, blood_group) VALUES (seq_donation.NEXTVAL, 14, 4, TO_DATE('2025-06-15', 'YYYY-MM-DD'), 1, 'AB+');
INSERT INTO DONATION (donation_id, ref_donor_id, ref_bank_id, donation_date, units_donated, blood_group) VALUES (seq_donation.NEXTVAL, 15, 5, TO_DATE('2025-07-20', 'YYYY-MM-DD'), 3, 'B+');
INSERT INTO DONATION (donation_id, ref_donor_id, ref_bank_id, donation_date, units_donated, blood_group) VALUES (seq_donation.NEXTVAL, 16, 6, TO_DATE('2025-08-25', 'YYYY-MM-DD'), 1, 'O-');
INSERT INTO DONATION (donation_id, ref_donor_id, ref_bank_id, donation_date, units_donated, blood_group) VALUES (seq_donation.NEXTVAL, 17, 7, TO_DATE('2025-09-30', 'YYYY-MM-DD'), 2, 'A+');
INSERT INTO DONATION (donation_id, ref_donor_id, ref_bank_id, donation_date, units_donated, blood_group) VALUES (seq_donation.NEXTVAL, 18, 8, TO_DATE('2025-10-05', 'YYYY-MM-DD'), 1, 'O+');
INSERT INTO DONATION (donation_id, ref_donor_id, ref_bank_id, donation_date, units_donated, blood_group) VALUES (seq_donation.NEXTVAL, 19, 9, TO_DATE('2025-11-10', 'YYYY-MM-DD'), 1, 'B-');
INSERT INTO DONATION (donation_id, ref_donor_id, ref_bank_id, donation_date, units_donated, blood_group) VALUES (seq_donation.NEXTVAL, 20, 10, TO_DATE('2025-12-15', 'YYYY-MM-DD'), 2, 'AB-');
INSERT INTO DONATION (donation_id, ref_donor_id, ref_bank_id, donation_date, units_donated, blood_group) VALUES (seq_donation.NEXTVAL, 21, 1, TO_DATE('2026-01-20', 'YYYY-MM-DD'), 1, 'A+');
INSERT INTO DONATION (donation_id, ref_donor_id, ref_bank_id, donation_date, units_donated, blood_group) VALUES (seq_donation.NEXTVAL, 22, 2, TO_DATE('2026-02-25', 'YYYY-MM-DD'), 3, 'O+');
INSERT INTO DONATION (donation_id, ref_donor_id, ref_bank_id, donation_date, units_donated, blood_group) VALUES (seq_donation.NEXTVAL, 23, 3, TO_DATE('2026-03-01', 'YYYY-MM-DD'), 1, 'B+');
INSERT INTO DONATION (donation_id, ref_donor_id, ref_bank_id, donation_date, units_donated, blood_group) VALUES (seq_donation.NEXTVAL, 24, 4, TO_DATE('2026-04-05', 'YYYY-MM-DD'), 2, 'AB+');
INSERT INTO DONATION (donation_id, ref_donor_id, ref_bank_id, donation_date, units_donated, blood_group) VALUES (seq_donation.NEXTVAL, 25, 5, TO_DATE('2026-05-01', 'YYYY-MM-DD'), 1, 'O-');
COMMIT;

-- Section: BLOOD_STOCK Data
INSERT INTO BLOOD_STOCK (stock_id, ref_bank_id, blood_group, units_available, last_updated) VALUES (seq_blood_stock.NEXTVAL, 1, 'A+', 50, SYSDATE - 2);
INSERT INTO BLOOD_STOCK (stock_id, ref_bank_id, blood_group, units_available, last_updated) VALUES (seq_blood_stock.NEXTVAL, 1, 'O+', 120, SYSDATE - 1);
INSERT INTO BLOOD_STOCK (stock_id, ref_bank_id, blood_group, units_available, last_updated) VALUES (seq_blood_stock.NEXTVAL, 2, 'B+', 80, SYSDATE - 3);
INSERT INTO BLOOD_STOCK (stock_id, ref_bank_id, blood_group, units_available, last_updated) VALUES (seq_blood_stock.NEXTVAL, 2, 'AB+', 20, SYSDATE);
INSERT INTO BLOOD_STOCK (stock_id, ref_bank_id, blood_group, units_available, last_updated) VALUES (seq_blood_stock.NEXTVAL, 3, 'A-', 15, SYSDATE - 5);
INSERT INTO BLOOD_STOCK (stock_id, ref_bank_id, blood_group, units_available, last_updated) VALUES (seq_blood_stock.NEXTVAL, 3, 'O-', 30, SYSDATE - 1);
INSERT INTO BLOOD_STOCK (stock_id, ref_bank_id, blood_group, units_available, last_updated) VALUES (seq_blood_stock.NEXTVAL, 4, 'B-', 10, SYSDATE - 2);
INSERT INTO BLOOD_STOCK (stock_id, ref_bank_id, blood_group, units_available, last_updated) VALUES (seq_blood_stock.NEXTVAL, 4, 'AB-', 5, SYSDATE - 4);
INSERT INTO BLOOD_STOCK (stock_id, ref_bank_id, blood_group, units_available, last_updated) VALUES (seq_blood_stock.NEXTVAL, 5, 'A+', 45, SYSDATE);
INSERT INTO BLOOD_STOCK (stock_id, ref_bank_id, blood_group, units_available, last_updated) VALUES (seq_blood_stock.NEXTVAL, 5, 'O+', 110, SYSDATE - 1);
INSERT INTO BLOOD_STOCK (stock_id, ref_bank_id, blood_group, units_available, last_updated) VALUES (seq_blood_stock.NEXTVAL, 6, 'B+', 70, SYSDATE - 2);
INSERT INTO BLOOD_STOCK (stock_id, ref_bank_id, blood_group, units_available, last_updated) VALUES (seq_blood_stock.NEXTVAL, 6, 'AB+', 25, SYSDATE - 3);
INSERT INTO BLOOD_STOCK (stock_id, ref_bank_id, blood_group, units_available, last_updated) VALUES (seq_blood_stock.NEXTVAL, 7, 'A-', 20, SYSDATE);
INSERT INTO BLOOD_STOCK (stock_id, ref_bank_id, blood_group, units_available, last_updated) VALUES (seq_blood_stock.NEXTVAL, 7, 'O-', 35, SYSDATE - 1);
INSERT INTO BLOOD_STOCK (stock_id, ref_bank_id, blood_group, units_available, last_updated) VALUES (seq_blood_stock.NEXTVAL, 8, 'B-', 12, SYSDATE - 4);
INSERT INTO BLOOD_STOCK (stock_id, ref_bank_id, blood_group, units_available, last_updated) VALUES (seq_blood_stock.NEXTVAL, 8, 'AB-', 8, SYSDATE - 2);
INSERT INTO BLOOD_STOCK (stock_id, ref_bank_id, blood_group, units_available, last_updated) VALUES (seq_blood_stock.NEXTVAL, 9, 'A+', 60, SYSDATE);
INSERT INTO BLOOD_STOCK (stock_id, ref_bank_id, blood_group, units_available, last_updated) VALUES (seq_blood_stock.NEXTVAL, 9, 'O+', 130, SYSDATE - 1);
INSERT INTO BLOOD_STOCK (stock_id, ref_bank_id, blood_group, units_available, last_updated) VALUES (seq_blood_stock.NEXTVAL, 10, 'B+', 90, SYSDATE - 2);
INSERT INTO BLOOD_STOCK (stock_id, ref_bank_id, blood_group, units_available, last_updated) VALUES (seq_blood_stock.NEXTVAL, 10, 'O-', 40, SYSDATE - 3);
COMMIT;

-- Section: REQUEST Data
INSERT INTO REQUEST (request_id, ref_recipient_id, ref_bank_id, blood_group, units_needed, status, request_date) VALUES (seq_request.NEXTVAL, 1, 1, 'A+', 2, 'Approved', SYSDATE - 10);
INSERT INTO REQUEST (request_id, ref_recipient_id, ref_bank_id, blood_group, units_needed, status, request_date) VALUES (seq_request.NEXTVAL, 2, 2, 'O+', 3, 'Fulfilled', SYSDATE - 9);
INSERT INTO REQUEST (request_id, ref_recipient_id, ref_bank_id, blood_group, units_needed, status, request_date) VALUES (seq_request.NEXTVAL, 3, 3, 'B+', 1, 'Pending', SYSDATE - 8);
INSERT INTO REQUEST (request_id, ref_recipient_id, ref_bank_id, blood_group, units_needed, status, request_date) VALUES (seq_request.NEXTVAL, 4, 4, 'AB+', 2, 'Rejected', SYSDATE - 7);
INSERT INTO REQUEST (request_id, ref_recipient_id, ref_bank_id, blood_group, units_needed, status, request_date) VALUES (seq_request.NEXTVAL, 5, 5, 'A-', 1, 'Approved', SYSDATE - 6);
INSERT INTO REQUEST (request_id, ref_recipient_id, ref_bank_id, blood_group, units_needed, status, request_date) VALUES (seq_request.NEXTVAL, 6, 6, 'O-', 2, 'Fulfilled', SYSDATE - 5);
INSERT INTO REQUEST (request_id, ref_recipient_id, ref_bank_id, blood_group, units_needed, status, request_date) VALUES (seq_request.NEXTVAL, 7, 7, 'B-', 1, 'Pending', SYSDATE - 4);
INSERT INTO REQUEST (request_id, ref_recipient_id, ref_bank_id, blood_group, units_needed, status, request_date) VALUES (seq_request.NEXTVAL, 8, 8, 'AB-', 2, 'Rejected', SYSDATE - 3);
INSERT INTO REQUEST (request_id, ref_recipient_id, ref_bank_id, blood_group, units_needed, status, request_date) VALUES (seq_request.NEXTVAL, 9, 9, 'O+', 3, 'Approved', SYSDATE - 2);
INSERT INTO REQUEST (request_id, ref_recipient_id, ref_bank_id, blood_group, units_needed, status, request_date) VALUES (seq_request.NEXTVAL, 10, 10, 'A+', 1, 'Fulfilled', SYSDATE - 1);
INSERT INTO REQUEST (request_id, ref_recipient_id, ref_bank_id, blood_group, units_needed, status, request_date) VALUES (seq_request.NEXTVAL, 11, 1, 'B+', 2, 'Pending', SYSDATE);
INSERT INTO REQUEST (request_id, ref_recipient_id, ref_bank_id, blood_group, units_needed, status, request_date) VALUES (seq_request.NEXTVAL, 12, 2, 'O+', 1, 'Approved', SYSDATE);
INSERT INTO REQUEST (request_id, ref_recipient_id, ref_bank_id, blood_group, units_needed, status, request_date) VALUES (seq_request.NEXTVAL, 13, 3, 'A-', 2, 'Fulfilled', SYSDATE - 1);
INSERT INTO REQUEST (request_id, ref_recipient_id, ref_bank_id, blood_group, units_needed, status, request_date) VALUES (seq_request.NEXTVAL, 14, 4, 'AB+', 1, 'Pending', SYSDATE - 2);
INSERT INTO REQUEST (request_id, ref_recipient_id, ref_bank_id, blood_group, units_needed, status, request_date) VALUES (seq_request.NEXTVAL, 15, 5, 'B-', 3, 'Rejected', SYSDATE - 3);
INSERT INTO REQUEST (request_id, ref_recipient_id, ref_bank_id, blood_group, units_needed, status, request_date) VALUES (seq_request.NEXTVAL, 16, 6, 'O-', 2, 'Approved', SYSDATE - 4);
INSERT INTO REQUEST (request_id, ref_recipient_id, ref_bank_id, blood_group, units_needed, status, request_date) VALUES (seq_request.NEXTVAL, 17, 7, 'A+', 1, 'Fulfilled', SYSDATE - 5);
INSERT INTO REQUEST (request_id, ref_recipient_id, ref_bank_id, blood_group, units_needed, status, request_date) VALUES (seq_request.NEXTVAL, 18, 8, 'O+', 2, 'Pending', SYSDATE - 6);
INSERT INTO REQUEST (request_id, ref_recipient_id, ref_bank_id, blood_group, units_needed, status, request_date) VALUES (seq_request.NEXTVAL, 19, 9, 'B+', 1, 'Rejected', SYSDATE - 7);
INSERT INTO REQUEST (request_id, ref_recipient_id, ref_bank_id, blood_group, units_needed, status, request_date) VALUES (seq_request.NEXTVAL, 20, 10, 'AB-', 2, 'Approved', SYSDATE - 8);
COMMIT;

-- Section: HOSPITAL_BANK Data
INSERT INTO HOSPITAL_BANK (hb_id, ref_hospital_id, ref_bank_id) VALUES (seq_hospital_bank.NEXTVAL, 1, 1);
INSERT INTO HOSPITAL_BANK (hb_id, ref_hospital_id, ref_bank_id) VALUES (seq_hospital_bank.NEXTVAL, 1, 9);
INSERT INTO HOSPITAL_BANK (hb_id, ref_hospital_id, ref_bank_id) VALUES (seq_hospital_bank.NEXTVAL, 2, 2);
INSERT INTO HOSPITAL_BANK (hb_id, ref_hospital_id, ref_bank_id) VALUES (seq_hospital_bank.NEXTVAL, 2, 10);
INSERT INTO HOSPITAL_BANK (hb_id, ref_hospital_id, ref_bank_id) VALUES (seq_hospital_bank.NEXTVAL, 3, 3);
INSERT INTO HOSPITAL_BANK (hb_id, ref_hospital_id, ref_bank_id) VALUES (seq_hospital_bank.NEXTVAL, 4, 4);
INSERT INTO HOSPITAL_BANK (hb_id, ref_hospital_id, ref_bank_id) VALUES (seq_hospital_bank.NEXTVAL, 5, 5);
INSERT INTO HOSPITAL_BANK (hb_id, ref_hospital_id, ref_bank_id) VALUES (seq_hospital_bank.NEXTVAL, 6, 6);
INSERT INTO HOSPITAL_BANK (hb_id, ref_hospital_id, ref_bank_id) VALUES (seq_hospital_bank.NEXTVAL, 7, 7);
INSERT INTO HOSPITAL_BANK (hb_id, ref_hospital_id, ref_bank_id) VALUES (seq_hospital_bank.NEXTVAL, 8, 8);
INSERT INTO HOSPITAL_BANK (hb_id, ref_hospital_id, ref_bank_id) VALUES (seq_hospital_bank.NEXTVAL, 9, 1);
INSERT INTO HOSPITAL_BANK (hb_id, ref_hospital_id, ref_bank_id) VALUES (seq_hospital_bank.NEXTVAL, 10, 2);
COMMIT;
