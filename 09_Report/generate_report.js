const fs = require('fs');
const path = require('path');
const { 
    Document, Packer, Paragraph, TextRun, ImageRun, Table, TableRow, TableCell, 
    HeadingLevel, AlignmentType, BorderStyle, WidthType, ShadingType, PageNumber, 
    PageOrientation, LevelFormat, Footer 
} = require('docx');
const sizeOf = require('image-size').imageSize;

const assetsDir = path.join(__dirname, '..', 'Assets');

// Helper to get image buffer and scaled dimensions
function getImageRun(filename, maxWidth = 500) {
    const fullPath = path.join(assetsDir, filename);
    const buffer = fs.readFileSync(fullPath);
    const dimensions = sizeOf(new Uint8Array(buffer));
    
    let width = dimensions.width;
    let height = dimensions.height;
    
    if (width > maxWidth) {
        const ratio = maxWidth / width;
        width = maxWidth;
        height = height * ratio;
    }
    
    return new ImageRun({
        data: buffer,
        transformation: {
            width: width,
            height: height
        }
    });
}

function createCaption(text) {
    return new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 }, // 6pt
        children: [
            new TextRun({ text: text, font: "Courier New", size: 20 }) // 10pt = 20 half-points
        ]
    });
}

function createHeading1(text) {
    return new Paragraph({
        text: text,
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 }
    });
}

function createHeading2(text) {
    return new Paragraph({
        text: text,
        heading: HeadingLevel.HEADING_2,
        alignment: AlignmentType.LEFT,
        spacing: { after: 120 }
    });
}

function createHeading3(text) {
    return new Paragraph({
        text: text,
        heading: HeadingLevel.HEADING_3,
        alignment: AlignmentType.LEFT,
        spacing: { after: 120 }
    });
}

function createParagraph(text) {
    return new Paragraph({
        spacing: { after: 120, line: 276 }, // 6pt after, 1.15 line spacing = 240 * 1.15 = 276
        children: [
            new TextRun({ text: text, font: "Times New Roman", size: 24 }) // 12pt = 24 half-points
        ]
    });
}

function createList(items) {
    return items.map(item => new Paragraph({
        spacing: { after: 120, line: 276 },
        numbering: { reference: "numbered", level: 0 },
        children: [
            new TextRun({ text: item, font: "Times New Roman", size: 24 })
        ]
    }));
}

function createBulletList(items) {
    return items.map(item => new Paragraph({
        spacing: { after: 120, line: 276 },
        numbering: { reference: "bulleted", level: 0 },
        children: [
            new TextRun({ text: item, font: "Times New Roman", size: 24 })
        ]
    }));
}

function createCodeBlock(text) {
    return new Paragraph({
        spacing: { after: 120, line: 276 },
        border: {
            top: { color: "000000", space: 1, value: BorderStyle.SINGLE, size: 6 },
            bottom: { color: "000000", space: 1, value: BorderStyle.SINGLE, size: 6 },
            left: { color: "000000", space: 1, value: BorderStyle.SINGLE, size: 6 },
            right: { color: "000000", space: 1, value: BorderStyle.SINGLE, size: 6 },
        },
        children: [
            new TextRun({ text: text, font: "Courier New", size: 20 })
        ]
    });
}

// Start defining document
const doc = new Document({
    numbering: {
        config: [
            {
                reference: "numbered",
                levels: [
                    {
                        level: 0,
                        format: LevelFormat.DECIMAL,
                        text: "%1.",
                        alignment: AlignmentType.START,
                        style: {
                            paragraph: {
                                indent: { left: 720, hanging: 360 },
                            },
                        },
                    }
                ]
            },
            {
                reference: "bulleted",
                levels: [
                    {
                        level: 0,
                        format: LevelFormat.BULLET,
                        text: "-",
                        alignment: AlignmentType.START,
                        style: {
                            paragraph: {
                                indent: { left: 720, hanging: 360 },
                            },
                        },
                    }
                ]
            }
        ]
    },
    sections: [{
        properties: {
            page: {
                size: {
                    width: 11906, // A4 width in DXA
                    height: 16838 // A4 height in DXA
                },
                margin: {
                    top: 1440, // 1 inch
                    right: 1440,
                    bottom: 1440,
                    left: 1440
                },
                pageNumbers: {
                    start: 1,
                    formatType: "decimal"
                }
            }
        },
        footers: {
            default: new Footer({
                children: [
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({ font: "Times New Roman", size: 24, children: [PageNumber.CURRENT] })
                        ]
                    })
                ]
            })
        },
        children: [
            // SECTION 1
            createHeading1("Blood Donor Network"),
            createHeading1("CL2005 Database Systems Lab"),
            createHeading1("FAST NUCES CFD Campus, Spring 2026"),
            createHeading1("Instructor: Hassan Ahmed"),
            createHeading1("Abdul Ahad — 24F-0727"),
            createHeading1("Jazib — 24F-0691"),
            createHeading1("GitHub: https://github.com/Abdu1-Ahd/Blood-Donor-Network"),
            createHeading1("Date: May 2026"),
            new Paragraph({ pageBreakBefore: true }),

            // SECTION 2
            createHeading1("SECTION 2 — TABLE OF CONTENTS"),
            createParagraph("1. Title Page"),
            createParagraph("2. Table of Contents"),
            createParagraph("3. Introduction"),
            createParagraph("4. Requirements"),
            createParagraph("   4.1 Functional Requirements"),
            createParagraph("   4.2 Non-Functional Requirements"),
            createParagraph("   4.3 System Scope"),
            createParagraph("5. Database Design"),
            createParagraph("   5.1 Entity Descriptions"),
            createParagraph("   5.2 Relationships Summary"),
            createParagraph("   5.3 Normalization Justification"),
            createParagraph("   5.4 ERD Description"),
            createParagraph("   5.5 EERD Description"),
            createParagraph("6. Schema Description"),
            createParagraph("7. Query Documentation"),
            createParagraph("8. PL/SQL Documentation"),
            createParagraph("9. GUI Documentation"),
            createParagraph("10. Dashboard"),
            createParagraph("11. Challenges and Lessons Learned"),
            createParagraph("12. Individual Contribution Table"),
            new Paragraph({ pageBreakBefore: true }),

            // SECTION 3
            createHeading1("SECTION 3 — INTRODUCTION"),
            createParagraph("A blood donor network is a critical healthcare system that connects individuals willing to donate blood with those who urgently need it. In Pakistan, the demand for safe and accessible blood is constantly high due to medical emergencies, accidents, and chronic conditions like thalassemia. Having a proper system ensures that blood banks can manage their inventory effectively, and hospitals can quickly find the right blood groups, ultimately saving lives."),
            createParagraph("Before such systems, manual blood searching was a major problem. Finding a compatible donor often meant relying on social media posts, word of mouth, or calling multiple hospitals. This caused severe delays, and without a central record, it was impossible to track which blood banks had available stock. Sometimes, excess blood would go to waste in one area while another area faced extreme shortages."),
            createParagraph("This Blood Donor Network project solves these problems by providing a centralized, digital platform. It allows users to track blood stock, register donors, and manage requests efficiently. The system is built with an Oracle database for reliable data storage and complex query handling through PL/SQL. We created the frontend and backend using Node.js, Express, HTML, CSS, and plain JavaScript to connect the database and present it through an easy-to-use graphical interface."),
            new Paragraph({ pageBreakBefore: true }),

            // SECTION 4
            createHeading1("SECTION 4 — REQUIREMENTS"),
            createHeading2("4.1 Functional Requirements"),
            ...createList([
                "The system must allow adding new donors with their personal details and blood group.",
                "The system must allow recording new blood donations linked to specific donors and blood banks.",
                "The system must automatically update the blood stock whenever a donation is recorded.",
                "The system must manage hospitals and the recipients admitted to them.",
                "The system must allow recipients to submit blood requests for specific blood groups.",
                "The system must be able to track the status of requests (Pending, Approved, Rejected).",
                "The system must update the available blood stock automatically when a request is approved.",
                "The system must keep an audit log of all deleted requests for security and tracking.",
                "The system must support role-based login for administrative staff and technicians.",
                "The system must provide a dashboard summarizing total donors, stock, and request statuses."
            ]),
            
            createHeading2("4.2 Non-Functional Requirements"),
            ...createList([
                "Performance: The system must load database records and dashboard statistics quickly.",
                "Usability: The graphical user interface should be clean, simple, and easy to navigate for non-technical hospital staff.",
                "Reliability: The Oracle database must use constraints and triggers to ensure data consistency and prevent invalid stock levels."
            ]),

            createHeading2("4.3 System Scope"),
            createParagraph("The system covers the registration of donors, recipients, and staff, along with inventory management for blood banks and handling hospital requests. It does not handle financial billing, donor medical history screening processes, or ambulance dispatching."),
            new Paragraph({ pageBreakBefore: true }),

            // SECTION 5
            createHeading1("SECTION 5 — DATABASE DESIGN"),
            createHeading2("5.1 Entity Descriptions"),
            ...createBulletList([
                "DONOR: People who register to donate blood. Stores details like name, date of birth, blood group, contact number, and eligibility status.",
                "RECIPIENT: Patients who need blood. Stores their name, blood group, contact, and the hospital they are admitted to.",
                "BLOOD_BANK: Facilities that store blood. Tracks their name, city, contact info, and storage capacity.",
                "DONATION: A weak entity recording actual donation events. Links a donor to a blood bank and tracks the date, units donated, and blood group.",
                "BLOOD_STOCK: Tracks the current available inventory of each blood group at specific blood banks.",
                "REQUEST: Records appeals for blood made by recipients to a specific blood bank. Tracks units needed and approval status.",
                "HOSPITAL: Medical facilities where recipients are admitted. Stores hospital name, city, and contact details.",
                "STAFF: Employees working within the network, separated into specific roles to manage the system."
            ]),

            createHeading2("5.2 Relationships Summary"),
            ...createBulletList([
                "A Donor makes many Donations, but a Donation is made by one Donor.",
                "A Blood Bank receives many Donations, but a Donation goes to one Blood Bank.",
                "A Blood Bank stores many Blood Stock records (one for each blood type), and each Blood Stock belongs to one Blood Bank.",
                "A Blood Bank handles many Requests, but a Request targets one Blood Bank.",
                "A Recipient submits many Requests, but a Request comes from one Recipient.",
                "A Hospital admits many Recipients, and a Recipient is admitted to one Hospital.",
                "A Hospital partners with many Blood Banks, and a Blood Bank partners with many Hospitals (M:N relationship).",
                "A Staff member manages one Blood Bank, and a Blood Bank is managed by many Staff members."
            ]),

            createHeading2("5.3 Normalization Justification"),
            ...createBulletList([
                "1NF (First Normal Form): Every table has a primary key and atomic values. For example, in the DONOR table, the full_name and contact_no are single values per row, not comma-separated lists.",
                "2NF (Second Normal Form): All non-key attributes depend entirely on the primary key. For example, in the DONATION table, the units_donated depends entirely on the composite of the weak entity key, preventing partial dependencies.",
                "3NF (Third Normal Form): There are no transitive dependencies. For example, the DONOR table does not store the blood bank's contact number; that information lives solely in the BLOOD_BANK table and is connected via foreign keys, removing data redundancy."
            ]),

            createHeading2("5.4 ERD Description"),
            createParagraph("Our Entity-Relationship Diagram maps the core data structure of the Blood Donor Network. At the center are the DONOR, BLOOD_BANK, and RECIPIENT entities. DONATION is modeled as a weak entity because a donation cannot exist without a corresponding donor and blood bank. The diagram clearly shows cardinalities, such as the 1:N relationship between DONOR and DONATION, and the M:N relationship between HOSPITAL and BLOOD_BANK, which was resolved using an associative table in the schema."),
            new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [getImageRun("ERD.png")]
            }),
            createCaption("Figure 1: Entity-Relationship Diagram (ERD)"),

            createHeading2("5.5 EERD Description"),
            createParagraph("Our Enhanced Entity-Relationship Diagram expands on the STAFF entity by implementing specialization. STAFF acts as the superclass with a total, disjoint constraint leading to two subclasses: ADMIN and TECHNICIAN. Admin staff have extra attributes for system privileges (admin_level, can_approve), while Technicians have technical attributes (specialization, lab_certified). The diagram also illustrates aggregation, where the handles relationship between BLOOD_BANK and HOSPITAL is treated as a single higher-level entity that can process REQUESTs."),
            new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [getImageRun("EERD.png")]
            }),
            createCaption("Figure 2: Enhanced Entity-Relationship Diagram (EERD)"),
            new Paragraph({ pageBreakBefore: true }),

            // SECTION 6
            createHeading1("SECTION 6 — SCHEMA DESCRIPTION"),
            createParagraph("DONOR: This table stores the personal details of people who can give blood. The primary key is donor_id. It includes constraints like ensuring the blood_group is one of the valid types (A+, O-, etc.) and checking that the dob indicates the donor is at least 18 years old."),
            createParagraph("RECIPIENT: Holds information about patients needing blood. The primary key is recipient_id. It links to the HOSPITAL table via a foreign key ref_hospital_id to indicate where the patient is currently admitted."),
            createParagraph("BLOOD_BANK: Represents the physical locations where blood is stored. Its primary key is bank_id. It has a check constraint ensuring that the capacity is greater than zero to prevent invalid data entries."),
            createParagraph("DONATION: Records individual blood donations. It uses a primary key donation_id. It has foreign keys to DONOR (ref_donor_id) and BLOOD_BANK (ref_bank_id). It uses a check constraint to ensure units_donated is greater than 0."),
            createParagraph("BLOOD_STOCK: Maintains the inventory levels. Its primary key is stock_id. It is linked to BLOOD_BANK (ref_bank_id). A unique constraint on (ref_bank_id, blood_group) ensures each bank has only one stock record per blood type."),
            createParagraph("REQUEST: Tracks blood requests made by recipients. The primary key is request_id. It links to RECIPIENT (ref_recipient_id) and BLOOD_BANK (ref_bank_id). It uses a check constraint to ensure the status is either Pending, Approved, or Rejected."),
            createParagraph("HOSPITAL: Stores data about partner hospitals. The primary key is hospital_id. The contact_no is forced to be unique so that no two hospitals have the exact same primary phone number in the system."),
            createParagraph("STAFF: The supertype table for employees. The primary key is staff_id. It stores login credentials (username, password_hash) and links to the BLOOD_BANK (ref_bank_id) they work at. The role column distinguishes between Admin and Technician."),
            createParagraph("ADMIN_STAFF: A subtype table containing details specific to administrators. The primary key is admin_id, which also acts as a foreign key referencing staff_id. It includes columns for approval privileges."),
            createParagraph("TECHNICIAN: A subtype table for lab staff. The primary key is tech_id, which references staff_id. It stores their specific lab certifications and specializations."),
            createParagraph("HOSPITAL_BANK: An associative table that resolves the many-to-many relationship between hospitals and blood banks. Its primary key is a composite of hospital_id and bank_id, which are both foreign keys."),
            createParagraph("REQUEST_AUDIT: An audit table used to log deleted requests. It does not have standard foreign keys because the original records are deleted, but it stores the old request ID, recipient ID, and the date the deletion occurred."),
            new Paragraph({ pageBreakBefore: true }),

            // SECTION 7
            createHeading1("SECTION 7 — QUERY DOCUMENTATION"),
            createParagraph("SELECT WITH WHERE: This section filters records based on specific conditions. For example, we wrote a query to find all 'Pending' blood requests that require more than 2 units. This helps staff quickly identify large, urgent requests that haven't been processed yet."),
            createParagraph("SELECT WITH MULTIPLE TABLES (JOIN): This involves combining data from different tables using foreign keys. One query joins DONOR, DONATION, and BLOOD_BANK to display a full history of donations, showing the donor's name alongside the bank they donated to and the date."),
            createParagraph("SELECT WITH GROUP BY & HAVING: This groups rows sharing a property and applies aggregate functions. We queried the total units donated per blood group, but only showed groups that had received more than 5 total units. This identifies our most abundant blood supplies."),
            createParagraph("SELECT WITH SUB-QUERIES: This nests one query inside another. We wrote a query to find the names of donors who have made at least one donation, by looking up donor IDs that exist in the DONATION table."),
            createParagraph("SELECT WITH AGGREGATE FUNCTIONS: This performs calculations on multiple rows. We used functions like COUNT and SUM to find the absolute total number of registered donors and the overall sum of available blood stock across the entire network."),
            createParagraph("SELECT WITH ORDER BY: This sorts the result set. We generated a list of all blood banks ordered by their storage capacity in descending order, making it easy to see which facilities are the largest."),
            createParagraph("MISCELLANEOUS QUERIES: This includes advanced operations like string manipulation and date formatting. We created a query that formats the donation date into a readable string and calculates how many days have passed since a specific donation occurred."),
            new Paragraph({ pageBreakBefore: true }),

            // SECTION 8
            createHeading1("SECTION 8 — PL/SQL DOCUMENTATION"),
            createParagraph("proc_add_donor (Stored Procedure): This procedure simplifies adding a new donor. It takes parameters like full name, date of birth, and blood group. It handles the sequence generation for the ID automatically and includes exception handling for duplicate contact numbers. This enforces the business rule that donor registration should be a single, clean database transaction."),
            createParagraph("proc_update_request_status (Stored Procedure): This updates a blood request's status. It takes the request ID and the new status as parameters. It prevents invalid status text by using an exception block that raises an error if anything other than 'Pending', 'Approved', or 'Rejected' is provided."),
            createParagraph("proc_process_approved_request (Stored Procedure): This is a complex procedure that handles the logistics of an approved request. When a request is approved, this procedure deducts the required blood units from the corresponding bank's stock. If the stock is insufficient, it raises a custom exception, enforcing the rule that a bank cannot give out more blood than it has."),
            createParagraph("fn_get_donor_count (Function): This function calculates the total number of donors matching a specific blood group in a given city. It takes the blood group and city as input parameters and returns a number. It helps the UI quickly retrieve demographic stats without writing complex joins every time."),
            createParagraph("fn_calculate_stock_level (Function): This evaluates the health of a blood bank's inventory. It takes the bank ID and blood group, checks the available units against the bank's capacity, and returns a percentage representing how full the storage is for that specific blood type."),
            createParagraph("trg_before_donor_ins (Trigger): This trigger fires automatically right before a new donor is inserted. It checks the donor's date of birth and calculates their age. If they are under 18, it raises an application error, enforcing the legal business rule that minors cannot register as donors."),
            createParagraph("trg_after_donation_ins (Trigger): This trigger fires after a successful donation is recorded. It automatically updates the BLOOD_STOCK table, adding the newly donated units to the bank's inventory for that specific blood group. This guarantees that stock levels are always perfectly synced with donations."),
            createParagraph("trg_after_request_del (Trigger): This is an auditing trigger. Whenever a record in the REQUEST table is deleted, this trigger captures the old data and inserts it into the REQUEST_AUDIT table along with a timestamp. This creates a secure, automated paper trail."),
            createParagraph("Explicit Cursor Block (Anonymous): This block uses an explicit cursor to loop through all pending requests. For each request, it fetches the details, checks the stock, and prints a console message indicating whether the request can be fulfilled currently. This allows batch processing logic to be handled inside the database."),
            createParagraph("Parameterized Cursor Block (Anonymous): This block uses a cursor that accepts a blood bank ID as a parameter. It fetches and prints all the donors who have donated to that specific bank. This demonstrates how to make cursors dynamic and reusable for different inputs."),
            createParagraph("pkg_blood_network (Package Specification & Body): This package bundles related procedures and functions together, acting as an API. It contains add_donation and get_bank_stock. The package hides the internal implementation details and makes the PL/SQL code modular and easier to maintain."),
            createParagraph("Anonymous Block 1: A simple test block that declares local variables, calls the fn_get_donor_count function, and uses DBMS_OUTPUT to print the result to the screen. It is used to verify that the function works correctly."),
            createParagraph("Anonymous Block 2: A test block designed to trigger an exception. It attempts to add a donor who is under 18 years old, deliberately firing the trg_before_donor_ins trigger to ensure the exception handling successfully catches and reports the age violation."),
            new Paragraph({ pageBreakBefore: true }),

            // SECTION 9
            createHeading1("SECTION 9 — GUI DOCUMENTATION"),
            
            createHeading2("Login Page"),
            createParagraph("This page secures the application. It provides a simple form where staff members enter their username and password. The system checks these credentials against the Oracle database and grants access if they are valid. Role-based access ensures that only authenticated staff can view the internal network data."),
            new Paragraph({ alignment: AlignmentType.CENTER, children: [getImageRun("Screenshot 2026-05-10 230815.png")] }),
            createCaption("Figure 3: Login Page"),
            
            createHeading2("Dashboard"),
            createParagraph("The main hub of the application. It gives a quick, high-level overview of the entire system. Key features include KPI cards showing real-time metrics and dynamic charts visualizing donations and requests."),
            new Paragraph({ alignment: AlignmentType.CENTER, children: [getImageRun("Screenshot 2026-05-10 230821.png")] }),
            createCaption("Figure 4: Dashboard Page"),

            createHeading2("Donors Page"),
            createParagraph("This page manages the people who give blood. It displays a table of all registered donors pulled directly from the database. Staff can view donor details like blood group, city, and contact information all in one place."),
            new Paragraph({ alignment: AlignmentType.CENTER, children: [getImageRun("Screenshot 2026-05-10 230825.png")] }),
            createCaption("Figure 5: Donors Page"),

            createHeading2("Recipients Page"),
            createParagraph("This page tracks the patients in need of blood. It shows a list of recipients along with the hospitals they are admitted to and their required blood groups. It provides a clear view of where the demand is coming from."),
            new Paragraph({ alignment: AlignmentType.CENTER, children: [getImageRun("Screenshot 2026-05-10 230840.png")] }),
            createCaption("Figure 6: Recipients Page"),

            createHeading2("Requests Page"),
            createParagraph("This page handles the actual appeals for blood. It lists all requests and their current statuses (Pending, Approved, Rejected). It is a vital tool for staff to monitor which requests still need to be fulfilled."),
            new Paragraph({ alignment: AlignmentType.CENTER, children: [getImageRun("Screenshot 2026-05-10 230845.png")] }),
            createCaption("Figure 7: Requests Page"),

            createHeading2("Blood Stock Page"),
            createParagraph("This page is the inventory tracker. It displays the available units of every blood group at different blood banks. It helps staff instantly see if there is enough blood to approve incoming requests."),
            new Paragraph({ alignment: AlignmentType.CENTER, children: [getImageRun("Screenshot 2026-05-10 230852.png")] }),
            createCaption("Figure 8: Blood Stock Page"),

            createParagraph("Role-Based Access Control: The application utilizes role-based access to determine what users can see. Administrators have full access; they can view all pages, approve requests, and see sensitive data. If we were to implement a generic donor login, their visibility would be heavily restricted—they would only see their own donation history and basic stock levels, without access to other people's data or approval mechanisms."),
            new Paragraph({ pageBreakBefore: true }),

            // SECTION 10
            createHeading1("SECTION 10 — DASHBOARD"),
            createParagraph("The dashboard features four primary KPI cards:"),
            ...createList([
                "Total Donors: Shows the absolute count of registered people.",
                "Total Requests: Displays the total number of blood requests ever made.",
                "Pending Requests: Highlights how many requests still need attention.",
                "Total Stock Units: Calculates the sum of all blood bags currently available across all banks."
            ]),
            createParagraph("It also contains graphical charts. The bar chart (Donations by Blood Group) visually breaks down which blood types are donated most frequently. The pie chart (Requests by Status) gives a quick percentage view of how many requests are Approved, Pending, or Rejected. Finally, a summary table ranks the Top 5 Blood Banks based on their total available stock, helping administrators instantly spot the most resourceful facilities."),
            new Paragraph({ alignment: AlignmentType.CENTER, children: [getImageRun("Screenshot 2026-05-10 230855.png")] }),
            createCaption("Figure 9: Dashboard Expanded View"),
            new Paragraph({ pageBreakBefore: true }),

            // SECTION 11
            createHeading1("SECTION 11 — CHALLENGES AND LESSONS LEARNED"),
            createParagraph("Throughout the development of the Blood Donor Network, we faced several technical challenges. One major hurdle was discovering that ADMIN is a reserved word in some Oracle contexts, which caused syntax errors when we tried to create our subtype tables, forcing us to use names like ADMIN_STAFF. Another challenge occurred during data population; we had to be extremely careful with the order of our SQL inserts to prevent foreign key constraint violations. Writing the PL/SQL trigger to automatically update the BLOOD_STOCK table was tricky because we had to handle cases where a stock row didn't exist yet for a specific bank. Finally, setting up the Node.js oracledb library required us to configure connection pooling properly and ensure the thick client was enabled to communicate with our Oracle 11g database without crashing."),
            createParagraph("Despite these challenges, we learned valuable lessons that improved our engineering skills. We realized that putting effort into proper database normalization early on saved us a massive amount of time later because we didn't have to deal with update anomalies or duplicate data. We also learned the immense value of PL/SQL; by pushing business logic (like stock deductions) down to the database level using triggers and procedures, our Node.js application code remained surprisingly clean and simple. Separating our Express routes into different files based on the module (donors, requests, stock) made debugging much faster. Lastly, we learned that using Oracle sequences is a much safer and more reliable way to generate primary keys compared to manually querying the maximum ID and adding one."),
            new Paragraph({ pageBreakBefore: true }),

            // SECTION 12
            createHeading1("SECTION 12 — INDIVIDUAL CONTRIBUTION TABLE"),
            
            new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                borders: {
                    top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                    bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                    left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                    right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                    insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                    insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                },
                rows: [
                    new TableRow({
                        children: [
                            new TableCell({ shading: { fill: "e0e0e0", type: ShadingType.CLEAR }, children: [createParagraph("Phase")] }),
                            new TableCell({ shading: { fill: "e0e0e0", type: ShadingType.CLEAR }, children: [createParagraph("Abdul Ahad (24F-0727)")] }),
                            new TableCell({ shading: { fill: "e0e0e0", type: ShadingType.CLEAR }, children: [createParagraph("Jazib (24F-0691)")] }),
                        ]
                    }),
                    new TableRow({ children: [new TableCell({ children: [createParagraph("Phase 1: SRS")] }), new TableCell({ children: [createParagraph("Written by Abdul")] }), new TableCell({ children: [createParagraph("Reviewed by Jazib")] })] }),
                    new TableRow({ children: [new TableCell({ children: [createParagraph("Phase 2A: ERD/EERD")] }), new TableCell({ children: [createParagraph("Designed by Abdul")] }), new TableCell({ children: [createParagraph("Verified by Jazib")] })] }),
                    new TableRow({ children: [new TableCell({ children: [createParagraph("Phase 2B: DDL")] }), new TableCell({ children: [createParagraph("Written by Abdul")] }), new TableCell({ children: [createParagraph("Tested by Jazib")] })] }),
                    new TableRow({ children: [new TableCell({ children: [createParagraph("Phase 2C: Data Population")] }), new TableCell({ children: [createParagraph("Reviewed by Abdul")] }), new TableCell({ children: [createParagraph("Written by Jazib")] })] }),
                    new TableRow({ children: [new TableCell({ children: [createParagraph("Phase 2D: Queries")] }), new TableCell({ children: [createParagraph("Reviewed by Abdul")] }), new TableCell({ children: [createParagraph("Written by Jazib")] })] }),
                    new TableRow({ children: [new TableCell({ children: [createParagraph("Phase 3: GUI")] }), new TableCell({ children: [createParagraph("Backend by Abdul")] }), new TableCell({ children: [createParagraph("Frontend by Jazib")] })] }),
                    new TableRow({ children: [new TableCell({ children: [createParagraph("Phase 4: PL/SQL")] }), new TableCell({ children: [createParagraph("Written by Abdul")] }), new TableCell({ children: [createParagraph("Reviewed by Jazib")] })] }),
                    new TableRow({ children: [new TableCell({ children: [createParagraph("Phase 5: Oracle Connection")] }), new TableCell({ children: [createParagraph("Configured by Abdul")] }), new TableCell({ children: [createParagraph("Tested by Jazib")] })] }),
                    new TableRow({ children: [new TableCell({ children: [createParagraph("Phase 6: Report")] }), new TableCell({ children: [createParagraph("Written by both")] }), new TableCell({ children: [createParagraph("—")] })] }),
                ]
            }),

            createParagraph(""),
            createParagraph(""),
            createParagraph("Member 1 Signature: ___________________ Date: ___________"),
            createParagraph("Member 2 Signature: ___________________ Date: ___________")
        ]
    }]
});

Packer.toBuffer(doc).then((buffer) => {
    fs.writeFileSync("report_final.docx", buffer);
    console.log("report_final.docx created successfully");
});
