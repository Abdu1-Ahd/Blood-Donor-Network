# AGENTS.md — Blood Donor Network Project Rules

## Project
- Domain: Blood Donor Network
- Course: CL2005 Database Systems Lab, FAST NUCES CFD, Spring 2026
- Members: Abdul Ahad (24F-0727), Jazib (24F-0691)
- GUI: Node.js + HTML/CSS/JS
- Database: Oracle (scripts written now, connected later)
- GitHub: https://github.com/Abdu1-Ahd/Blood-Donor-Network

## Execution Rules
- GENERATE mock data/tests automatically for data-heavy projects.
- USE skills from `C:\Users\zawia\.antigravity\University\skills`.
- APPLY `humanizer.skill` before finalizing text/reports.
- APPLY human code style when writing/refactoring code.
- STORE ALL temp files/drafts in `C:\Users\zawia\.antigravity\University\cache`.
- PREFIX temp files with `[CACHE]_`.
- ASK user to delete cache files after task finishes.

## Code Style Rules
- Short natural variable names: i, j, n, cnt, arr
- Minimal comments, one to two words only
- No docstrings, no type hints, no over-engineered abstractions
- Beginner-friendly logic, avoid complex patterns
- All code must look human-written, not AI-generated

## SQL / Oracle Rules
- All table names: SINGULAR NOUN, UPPER CASE (e.g. DONOR, HOSPITAL)
- All column names: lower_case_with_underscores (e.g. donor_id, full_name)
- Primary key format: tablename_id (e.g. donor_id)
- Foreign key format: ref_tablename_id (e.g. ref_bank_id)
- Procedure names: proc_verb_noun (e.g. proc_add_donor)
- Function names: fn_noun (e.g. fn_calculate_stock)
- Trigger names: trg_timing_table_action (e.g. trg_before_donor_ins)
- Package names: pkg_domain (e.g. pkg_donor)
- View names: vw_description (e.g. vw_active_donors)
- Index names: idx_table_column (e.g. idx_donor_name)
- Every script must begin with a header comment block containing: project name, script purpose, group members, roll numbers, date

## Git Rules
- Every phase ends with a commit
- Commit message format: type: description (e.g. init: project scaffold, docs: add SRS, sql: add DDL)
- Never commit build artifacts, node_modules, bin, obj, pycache, or .vs folders
- .gitignore must cover: node_modules/, *.log, .env, cache/

## Phase Tracking
- Phase 0: Scaffold — DONE
- Phase 1: SRS + Data Dictionary — DONE
- Phase 2A: ERD + EERD — DONE
- Phase 2B: DDL Schema — PENDING
- Phase 2C: Data Population — PENDING
- Phase 2D: Queries — PENDING
- Phase 3: GUI (mock data) — PENDING
- Phase 4: PL/SQL — PENDING
- Phase 5: Oracle Connection — PENDING (waiting for Oracle setup)
- Phase 6: Report Draft — PENDING
