# Data Dictionary

## 1. DONOR
| Column Name | Data Type | Size | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- |
| donor_id | NUMBER | 10 | PK NOT NULL | Unique donor ID |
| full_name | VARCHAR2 | 100 | NOT NULL | Full name |
| dob | DATE | - | NOT NULL | Date of birth |
| blood_group | VARCHAR2 | 5 | NOT NULL CHECK(A+/A-/B+/B-/AB+/AB-/O+/O-) | Blood group |
| contact_no | VARCHAR2 | 15 | UNIQUE NOT NULL | Phone number |
| city | VARCHAR2 | 50 | NOT NULL | City of residence |
| is_eligible | CHAR | 1 | DEFAULT Y CHECK(Y/N) | Donation eligibility |

## 2. RECIPIENT
| Column Name | Data Type | Size | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- |
| recipient_id | NUMBER | 10 | PK NOT NULL | Unique recipient ID |
| full_name | VARCHAR2 | 100 | NOT NULL | Full name |
| blood_group | VARCHAR2 | 5 | NOT NULL | Required blood group |
| contact_no | VARCHAR2 | 15 | NOT NULL | Phone number |
| ref_hospital_id | NUMBER | 10 | FK NOT NULL | Hospital where admitted |
| admitted_date | DATE | - | NOT NULL | Date of admission |

## 3. BLOOD_BANK
| Column Name | Data Type | Size | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- |
| bank_id | NUMBER | 10 | PK NOT NULL | Unique bank ID |
| bank_name | VARCHAR2 | 100 | NOT NULL | Name of blood bank |
| city | VARCHAR2 | 50 | NOT NULL | City location |
| contact_no | VARCHAR2 | 15 | UNIQUE | Contact number |
| capacity | NUMBER | 5 | NOT NULL | Max unit storage capacity |
| established_date | DATE | - | - | Date established |

## 4. DONATION
| Column Name | Data Type | Size | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- |
| donation_id | NUMBER | 10 | PK NOT NULL | Unique donation ID |
| ref_donor_id | NUMBER | 10 | FK NOT NULL | Donor who donated |
| ref_bank_id | NUMBER | 10 | FK NOT NULL | Bank that received |
| donation_date | DATE | - | NOT NULL DEFAULT SYSDATE | Date of donation |
| units_donated | NUMBER | 3 | NOT NULL CHECK > 0 | Units donated |
| blood_group | VARCHAR2 | 5 | NOT NULL | Blood group donated |

## 5. BLOOD_STOCK
| Column Name | Data Type | Size | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- |
| stock_id | NUMBER | 10 | PK NOT NULL | Unique stock record ID |
| ref_bank_id | NUMBER | 10 | FK NOT NULL | Bank holding the stock |
| blood_group | VARCHAR2 | 5 | NOT NULL | Blood group |
| units_available | NUMBER | 5 | NOT NULL DEFAULT 0 | Current units |
| last_updated | DATE | - | DEFAULT SYSDATE | Last update timestamp |

## 6. REQUEST
| Column Name | Data Type | Size | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- |
| request_id | NUMBER | 10 | PK NOT NULL | Unique request ID |
| ref_recipient_id | NUMBER | 10 | FK NOT NULL | Recipient making request |
| ref_bank_id | NUMBER | 10 | FK NOT NULL | Bank handling request |
| blood_group | VARCHAR2 | 5 | NOT NULL | Requested blood group |
| units_needed | NUMBER | 3 | NOT NULL | Units required |
| status | VARCHAR2 | 20 | DEFAULT Pending CHECK(Pending/Approved/Rejected) | Request status |
| request_date | DATE | - | DEFAULT SYSDATE | Date of request |

## 7. HOSPITAL
| Column Name | Data Type | Size | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- |
| hospital_id | NUMBER | 10 | PK NOT NULL | Unique hospital ID |
| hospital_name | VARCHAR2 | 100 | NOT NULL | Hospital name |
| city | VARCHAR2 | 50 | NOT NULL | City |
| contact_no | VARCHAR2 | 15 | UNIQUE | Contact number |
| ref_bank_id | NUMBER | 10 | FK | Associated blood bank |

## 8. STAFF
| Column Name | Data Type | Size | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- |
| staff_id | NUMBER | 10 | PK NOT NULL | Unique staff ID |
| full_name | VARCHAR2 | 100 | NOT NULL | Full name |
| role | VARCHAR2 | 20 | NOT NULL CHECK(Admin/Technician) | Staff role |
| ref_bank_id | NUMBER | 10 | FK NOT NULL | Bank they work at |
| username | VARCHAR2 | 50 | UNIQUE NOT NULL | Login username |
| password_hash | VARCHAR2 | 255 | NOT NULL | Hashed password |
| hire_date | DATE | - | NOT NULL | Date of joining |

## Relationships Summary
- **RECIPIENT.ref_hospital_id** references **HOSPITAL.hospital_id** — each recipient is admitted to one hospital.
- **DONATION.ref_donor_id** references **DONOR.donor_id** — each donation belongs to one donor.
- **DONATION.ref_bank_id** references **BLOOD_BANK.bank_id** — each donation is received by one blood bank.
- **BLOOD_STOCK.ref_bank_id** references **BLOOD_BANK.bank_id** — each stock record belongs to one blood bank.
- **REQUEST.ref_recipient_id** references **RECIPIENT.recipient_id** — each request is made for one recipient.
- **REQUEST.ref_bank_id** references **BLOOD_BANK.bank_id** — each request is handled by one blood bank.
- **HOSPITAL.ref_bank_id** references **BLOOD_BANK.bank_id** — each hospital is associated with one primary blood bank.
- **STAFF.ref_bank_id** references **BLOOD_BANK.bank_id** — each staff member works at one blood bank.
