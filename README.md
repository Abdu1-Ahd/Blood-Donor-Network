# Blood Donor Network

## Domain
Blood Donor Network System

## Course
CL2005 Database Systems Lab — FAST NUCES CFD Campus, Spring 2026

## Members
- Abdul Ahad (24F-0727)
- Jazib (24F-0691)

## Tech Stack
- **Database**: Oracle
- **Backend/GUI**: Node.js + HTML/CSS/JS

## Folder Structure
- `01_SRS.md` & `01_DataDictionary.md`: Requirements and data definitions.
- `02_ERD_EERD/`: Entity Relationship Diagrams.
- `03_DDL.sql`: Database schema creation scripts.
- `04_DML_Inserts.sql`: Data population scripts.
- `05_Queries.sql`: SQL queries for application logic and reporting.
- `06_PLSQL.sql`: Procedures, functions, and triggers.
- `07_GUI/`: Node.js based web application.
- `08_Dashboard/`: Additional UI components or dashboards.
- `09_Report/`: Project report drafts and final submissions.

## How to Run

### 1. Database Setup (Oracle)
1. Ensure Oracle 11g or later is installed and running.
2. Run the SQL scripts in the following order:
   - `03_DDL.sql` (Creates tables and sequences)
   - `04_DML_Inserts.sql` (Populates test data)
   - `06_PLSQL.sql` (Registers procedures and triggers)
3. Ensure the `STAFF` table has your user credentials (e.g., username `Jazib` or `User`).

### 2. GUI Setup (Node.js)
1. Navigate to the `07_GUI/` directory:
   ```bash
   cd 07_GUI
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure the `.env` file with your Oracle credentials:
   ```env
   DB_USER=your_oracle_user
   DB_PASS=your_oracle_password
   DB_HOST=localhost:1521/XE
   PORT=3000
   ```
4. Start the server:
   ```bash
   npm start
   ```
5. Open `http://localhost:3000` in your browser.

### 3. Usage
- **Admin**: Login with `Jazib` (Password: `DB123`) to access the Dashboard.
- **Donor**: Login with `User` (Password: `DB123`) to access the Donor Portal.

## GitHub
## GitHub
https://github.com/Abdu1-Ahd/Blood-Donor-Network
