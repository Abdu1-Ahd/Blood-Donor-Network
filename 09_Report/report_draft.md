# SECTION 1 — TITLE PAGE

Blood Donor Network
CL2005 Database Systems Lab
FAST NUCES CFD Campus, Spring 2026
Instructor: Hassan Ahmed
Abdul Ahad — 24F-0727
Jazib — 24F-0691
GitHub: https://github.com/Abdu1-Ahd/Blood-Donor-Network
Date: May 2026

# SECTION 2 — TABLE OF CONTENTS

1. Title Page
2. Table of Contents
3. Introduction
4. Requirements
   4.1 Functional Requirements
   4.2 Non-Functional Requirements
   4.3 System Scope
5. Database Design
   5.1 Entity Descriptions
   5.2 Relationships Summary
   5.3 Normalization Justification
   5.4 ERD Description
   5.5 EERD Description
6. Schema Description
7. Query Documentation
8. PL/SQL Documentation
9. GUI Documentation
10. Dashboard
11. Challenges and Lessons Learned
12. Individual Contribution Table

# SECTION 3 — INTRODUCTION

A blood donor network is a critical healthcare system that connects individuals willing to donate blood with those who urgently need it. In Pakistan, the demand for safe and accessible blood is constantly high due to medical emergencies, accidents, and chronic conditions like thalassemia. Having a proper system ensures that blood banks can manage their inventory effectively, and hospitals can quickly find the right blood groups, ultimately saving lives.

Before such systems, manual blood searching was a major problem. Finding a compatible donor often meant relying on social media posts, word of mouth, or calling multiple hospitals. This caused severe delays, and without a central record, it was impossible to track which blood banks had available stock. Sometimes, excess blood would go to waste in one area while another area faced extreme shortages.

This Blood Donor Network project solves these problems by providing a centralized, digital platform. It allows users to track blood stock, register donors, and manage requests efficiently. The system is built with an Oracle database for reliable data storage and complex query handling through PL/SQL. We created the frontend and backend using Node.js, Express, HTML, CSS, and plain JavaScript to connect the database and present it through an easy-to-use graphical interface.

# SECTION 4 — REQUIREMENTS

## 4.1 Functional Requirements
1. The system must allow adding new donors with their personal details and blood group.
2. The system must allow recording new blood donations linked to specific donors and blood banks.
3. The system must automatically update the blood stock whenever a donation is recorded.
4. The system must manage hospitals and the recipients admitted to them.
5. The system must allow recipients to submit blood requests for specific blood groups.
6. The system must be able to track the status of requests (Pending, Approved, Rejected).
7. The system must update the available blood stock automatically when a request is approved.
8. The system must keep an audit log of all deleted requests for security and tracking.
9. The system must support role-based login for administrative staff and technicians.
10. The system must provide a dashboard summarizing total donors, stock, and request statuses.

## 4.2 Non-Functional Requirements
1. Performance: The system must load database records and dashboard statistics quickly.
2. Usability: The graphical user interface should be clean, simple, and easy to navigate for non-technical hospital staff.
3. Reliability: The Oracle database must use constraints and triggers to ensure data consistency and prevent invalid stock levels.

## 4.3 System Scope
The system covers the registration of donors, recipients, and staff, along with inventory management for blood banks and handling hospital requests. It does not handle financial billing, donor medical history screening processes, or ambulance dispatching.

# SECTION 5 — DATABASE DESIGN

## 5.1 Entity Descriptions
- **DONOR**: People who register to donate blood. Stores details like name, date of birth, blood group, contact number, and eligibility status.
- **RECIPIENT**: Patients who need blood. Stores their name, blood group, contact, and the hospital they are admitted to.
- **BLOOD_BANK**: Facilities that store blood. Tracks their name, city, contact info, and storage capacity.
- **DONATION**: A weak entity recording actual donation events. Links a donor to a blood bank and tracks the date, units donated, and blood group.
- **BLOOD_STOCK**: Tracks the current available inventory of each blood group at specific blood banks.
- **REQUEST**: Records appeals for blood made by recipients to a specific blood bank. Tracks units needed and approval status.
- **HOSPITAL**: Medical facilities where recipients are admitted. Stores hospital name, city, and contact details.
- **STAFF**: Employees working within the network, separated into specific roles to manage the system.

## 5.2 Relationships Summary
- A Donor makes many Donations, but a Donation is made by one Donor.
- A Blood Bank receives many Donations, but a Donation goes to one Blood Bank.
- A Blood Bank stores many Blood Stock records (one for each blood type), and each Blood Stock belongs to one Blood Bank.
- A Blood Bank handles many Requests, but a Request targets one Blood Bank.
- A Recipient submits many Requests, but a Request comes from one Recipient.
- A Hospital admits many Recipients, and a Recipient is admitted to one Hospital.
- A Hospital partners with many Blood Banks, and a Blood Bank partners with many Hospitals (M:N relationship).
- A Staff member manages one Blood Bank, and a Blood Bank is managed by many Staff members.

## 5.3 Normalization Justification
- **1NF (First Normal Form)**: Every table has a primary key and atomic values. For example, in the DONOR table, the `full_name` and `contact_no` are single values per row, not comma-separated lists.
- **2NF (Second Normal Form)**: All non-key attributes depend entirely on the primary key. For example, in the DONATION table, the `units_donated` depends entirely on the composite of the weak entity key, preventing partial dependencies.
- **3NF (Third Normal Form)**: There are no transitive dependencies. For example, the DONOR table does not store the blood bank's contact number; that information lives solely in the BLOOD_BANK table and is connected via foreign keys, removing data redundancy.

## 5.4 ERD Description
Our Entity-Relationship Diagram maps the core data structure of the Blood Donor Network. At the center are the DONOR, BLOOD_BANK, and RECIPIENT entities. DONATION is modeled as a weak entity because a donation cannot exist without a corresponding donor and blood bank. The diagram clearly shows cardinalities, such as the 1:N relationship between DONOR and DONATION, and the M:N relationship between HOSPITAL and BLOOD_BANK, which was resolved using an associative table in the schema.

## 5.5 EERD Description
Our Enhanced Entity-Relationship Diagram expands on the STAFF entity by implementing specialization. STAFF acts as the superclass with a total, disjoint constraint leading to two subclasses: ADMIN and TECHNICIAN. Admin staff have extra attributes for system privileges (admin_level, can_approve), while Technicians have technical attributes (specialization, lab_certified). The diagram also illustrates aggregation, where the "handles" relationship between BLOOD_BANK and HOSPITAL is treated as a single higher-level entity that can process REQUESTs.

# SECTION 6 — SCHEMA DESCRIPTION

- **DONOR**: This table stores the personal details of people who can give blood. The primary key is `donor_id`. It includes constraints like ensuring the `blood_group` is one of the valid types (A+, O-, etc.) and checking that the `dob` indicates the donor is at least 18 years old.
- **RECIPIENT**: Holds information about patients needing blood. The primary key is `recipient_id`. It links to the HOSPITAL table via a foreign key `ref_hospital_id` to indicate where the patient is currently admitted.
- **BLOOD_BANK**: Represents the physical locations where blood is stored. Its primary key is `bank_id`. It has a check constraint ensuring that the `capacity` is greater than zero to prevent invalid data entries.
- **DONATION**: Records individual blood donations. It uses a primary key `donation_id`. It has foreign keys to DONOR (`ref_donor_id`) and BLOOD_BANK (`ref_bank_id`). It uses a check constraint to ensure `units_donated` is greater than 0.
- **BLOOD_STOCK**: Maintains the inventory levels. Its primary key is `stock_id`. It is linked to BLOOD_BANK (`ref_bank_id`). A unique constraint on `(ref_bank_id, blood_group)` ensures each bank has only one stock record per blood type.
- **REQUEST**: Tracks blood requests made by recipients. The primary key is `request_id`. It links to RECIPIENT (`ref_recipient_id`) and BLOOD_BANK (`ref_bank_id`). It uses a check constraint to ensure the `status` is either Pending, Approved, or Rejected.
- **HOSPITAL**: Stores data about partner hospitals. The primary key is `hospital_id`. The `contact_no` is forced to be unique so that no two hospitals have the exact same primary phone number in the system.
- **STAFF**: The supertype table for employees. The primary key is `staff_id`. It stores login credentials (`username`, `password_hash`) and links to the BLOOD_BANK (`ref_bank_id`) they work at. The `role` column distinguishes between Admin and Technician.
- **ADMIN_STAFF**: A subtype table containing details specific to administrators. The primary key is `admin_id`, which also acts as a foreign key referencing `staff_id`. It includes columns for approval privileges.
- **TECHNICIAN**: A subtype table for lab staff. The primary key is `tech_id`, which references `staff_id`. It stores their specific lab certifications and specializations.
- **HOSPITAL_BANK**: An associative table that resolves the many-to-many relationship between hospitals and blood banks. Its primary key is a composite of `hospital_id` and `bank_id`, which are both foreign keys.
- **REQUEST_AUDIT**: An audit table used to log deleted requests. It does not have standard foreign keys because the original records are deleted, but it stores the old request ID, recipient ID, and the date the deletion occurred.

# SECTION 7 — QUERY DOCUMENTATION

- **SELECT WITH WHERE**: This section filters records based on specific conditions. For example, we wrote a query to find all 'Pending' blood requests that require more than 2 units. This helps staff quickly identify large, urgent requests that haven't been processed yet.
- **SELECT WITH MULTIPLE TABLES (JOIN)**: This involves combining data from different tables using foreign keys. One query joins DONOR, DONATION, and BLOOD_BANK to display a full history of donations, showing the donor's name alongside the bank they donated to and the date.
- **SELECT WITH GROUP BY & HAVING**: This groups rows sharing a property and applies aggregate functions. We queried the total units donated per blood group, but only showed groups that had received more than 5 total units. This identifies our most abundant blood supplies.
- **SELECT WITH SUB-QUERIES**: This nests one query inside another. We wrote a query to find the names of donors who have made at least one donation, by looking up donor IDs that exist in the DONATION table.
- **SELECT WITH AGGREGATE FUNCTIONS**: This performs calculations on multiple rows. We used functions like COUNT and SUM to find the absolute total number of registered donors and the overall sum of available blood stock across the entire network.
- **SELECT WITH ORDER BY**: This sorts the result set. We generated a list of all blood banks ordered by their storage capacity in descending order, making it easy to see which facilities are the largest.
- **MISCELLANEOUS QUERIES**: This includes advanced operations like string manipulation and date formatting. We created a query that formats the donation date into a readable string and calculates how many days have passed since a specific donation occurred.

# SECTION 8 — PL/SQL DOCUMENTATION

- **proc_add_donor (Stored Procedure)**: This procedure simplifies adding a new donor. It takes parameters like full name, date of birth, and blood group. It handles the sequence generation for the ID automatically and includes exception handling for duplicate contact numbers. This enforces the business rule that donor registration should be a single, clean database transaction.
- **proc_update_request_status (Stored Procedure)**: This updates a blood request's status. It takes the request ID and the new status as parameters. It prevents invalid status text by using an exception block that raises an error if anything other than 'Pending', 'Approved', or 'Rejected' is provided.
- **proc_process_approved_request (Stored Procedure)**: This is a complex procedure that handles the logistics of an approved request. When a request is approved, this procedure deducts the required blood units from the corresponding bank's stock. If the stock is insufficient, it raises a custom exception, enforcing the rule that a bank cannot give out more blood than it has.
- **fn_get_donor_count (Function)**: This function calculates the total number of donors matching a specific blood group in a given city. It takes the blood group and city as input parameters and returns a number. It helps the UI quickly retrieve demographic stats without writing complex joins every time.
- **fn_calculate_stock_level (Function)**: This evaluates the health of a blood bank's inventory. It takes the bank ID and blood group, checks the available units against the bank's capacity, and returns a percentage representing how full the storage is for that specific blood type.
- **trg_before_donor_ins (Trigger)**: This trigger fires automatically right before a new donor is inserted. It checks the donor's date of birth and calculates their age. If they are under 18, it raises an application error, enforcing the legal business rule that minors cannot register as donors.
- **trg_after_donation_ins (Trigger)**: This trigger fires after a successful donation is recorded. It automatically updates the BLOOD_STOCK table, adding the newly donated units to the bank's inventory for that specific blood group. This guarantees that stock levels are always perfectly synced with donations.
- **trg_after_request_del (Trigger)**: This is an auditing trigger. Whenever a record in the REQUEST table is deleted, this trigger captures the old data and inserts it into the REQUEST_AUDIT table along with a timestamp. This creates a secure, automated paper trail.
- **Explicit Cursor Block (Anonymous)**: This block uses an explicit cursor to loop through all pending requests. For each request, it fetches the details, checks the stock, and prints a console message indicating whether the request can be fulfilled currently. This allows batch processing logic to be handled inside the database.
- **Parameterized Cursor Block (Anonymous)**: This block uses a cursor that accepts a blood bank ID as a parameter. It fetches and prints all the donors who have donated to that specific bank. This demonstrates how to make cursors dynamic and reusable for different inputs.
- **pkg_blood_network (Package Specification & Body)**: This package bundles related procedures and functions together, acting as an API. It contains `add_donation` and `get_bank_stock`. The package hides the internal implementation details and makes the PL/SQL code modular and easier to maintain.
- **Anonymous Block 1**: A simple test block that declares local variables, calls the `fn_get_donor_count` function, and uses `DBMS_OUTPUT` to print the result to the screen. It is used to verify that the function works correctly.
- **Anonymous Block 2**: A test block designed to trigger an exception. It attempts to add a donor who is under 18 years old, deliberately firing the `trg_before_donor_ins` trigger to ensure the exception handling successfully catches and reports the age violation.

# SECTION 9 — GUI DOCUMENTATION

- **Login Page**: This page secures the application. It provides a simple form where staff members enter their username and password. The system checks these credentials against the Oracle database and grants access if they are valid. Role-based access ensures that only authenticated staff can view the internal network data.
- **Dashboard**: The main hub of the application. It gives a quick, high-level overview of the entire system. Key features include KPI cards showing real-time metrics and dynamic charts visualizing donations and requests.
- **Donors Page**: This page manages the people who give blood. It displays a table of all registered donors pulled directly from the database. Staff can view donor details like blood group, city, and contact information all in one place.
- **Recipients Page**: This page tracks the patients in need of blood. It shows a list of recipients along with the hospitals they are admitted to and their required blood groups. It provides a clear view of where the demand is coming from.
- **Requests Page**: This page handles the actual appeals for blood. It lists all requests and their current statuses (Pending, Approved, Rejected). It is a vital tool for staff to monitor which requests still need to be fulfilled.
- **Blood Stock Page**: This page is the inventory tracker. It displays the available units of every blood group at different blood banks. It helps staff instantly see if there is enough blood to approve incoming requests.

**Role-Based Access Control**:
The application utilizes role-based access to determine what users can see. Administrators have full access; they can view all pages, approve requests, and see sensitive data. If we were to implement a generic donor login, their visibility would be heavily restricted—they would only see their own donation history and basic stock levels, without access to other people's data or approval mechanisms.

# SECTION 10 — DASHBOARD

The dashboard features four primary KPI cards:
1. **Total Donors**: Shows the absolute count of registered people.
2. **Total Requests**: Displays the total number of blood requests ever made.
3. **Pending Requests**: Highlights how many requests still need attention.
4. **Total Stock Units**: Calculates the sum of all blood bags currently available across all banks.

It also contains graphical charts. The bar chart (Donations by Blood Group) visually breaks down which blood types are donated most frequently. The pie chart (Requests by Status) gives a quick percentage view of how many requests are Approved, Pending, or Rejected. Finally, a summary table ranks the "Top 5 Blood Banks" based on their total available stock, helping administrators instantly spot the most resourceful facilities.

# SECTION 11 — CHALLENGES AND LESSONS LEARNED

Throughout the development of the Blood Donor Network, we faced several technical challenges. One major hurdle was discovering that "ADMIN" is a reserved word in some Oracle contexts, which caused syntax errors when we tried to create our subtype tables, forcing us to use names like ADMIN_STAFF. Another challenge occurred during data population; we had to be extremely careful with the order of our SQL inserts to prevent foreign key constraint violations. Writing the PL/SQL trigger to automatically update the BLOOD_STOCK table was tricky because we had to handle cases where a stock row didn't exist yet for a specific bank. Finally, setting up the Node.js `oracledb` library required us to configure connection pooling properly and ensure the thick client was enabled to communicate with our Oracle 11g database without crashing.

Despite these challenges, we learned valuable lessons that improved our engineering skills. We realized that putting effort into proper database normalization early on saved us a massive amount of time later because we didn't have to deal with update anomalies or duplicate data. We also learned the immense value of PL/SQL; by pushing business logic (like stock deductions) down to the database level using triggers and procedures, our Node.js application code remained surprisingly clean and simple. Separating our Express routes into different files based on the module (donors, requests, stock) made debugging much faster. Lastly, we learned that using Oracle sequences is a much safer and more reliable way to generate primary keys compared to manually querying the maximum ID and adding one.

# SECTION 12 — INDIVIDUAL CONTRIBUTION TABLE

| Phase | Abdul Ahad (24F-0727) | Jazib (24F-0691) |
|---|---|---|
| Phase 1: SRS | Written by Abdul | Reviewed by Jazib |
| Phase 2A: ERD/EERD | Designed by Abdul | Verified by Jazib |
| Phase 2B: DDL | Written by Abdul | Tested by Jazib |
| Phase 2C: Data Population | Reviewed by Abdul | Written by Jazib |
| Phase 2D: Queries | Reviewed by Abdul | Written by Jazib |
| Phase 3: GUI | Backend by Abdul | Frontend by Jazib |
| Phase 4: PL/SQL | Written by Abdul | Reviewed by Jazib |
| Phase 5: Oracle Connection | Configured by Abdul | Tested by Jazib |
| Phase 6: Report | Written by both | — |

Member 1 Signature: ___________________ Date: ___________
Member 2 Signature: ___________________ Date: ___________
