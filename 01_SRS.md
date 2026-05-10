# Software Requirements Specification (SRS)

## Project Information
- **Project Name:** Blood Donor Network
- **Course:** CL2005 Database Systems Lab — FAST NUCES CFD Campus, Spring 2026
- **Members:** Abdul Ahad (24F-0727), Jazib (24F-0691)
- **Instructor:** Hassan Ahmed
- **Date:** May 10, 2026

## Introduction
A blood donor network is a platform that connects people who want to donate blood with patients who urgently need it. Finding the right blood group during a medical emergency is often slow and stressful because hospitals rely on manual calling or social media posts to find donors. This delay can cost lives.

Our system solves this problem by creating a centralized database of registered donors, hospitals, and available blood stocks. When a patient needs a specific blood group, the hospital can quickly search the database to see if a nearby blood bank has it or instantly find eligible donors in the same city.

This system makes the whole process faster and more organized. It tracks blood donations, manages hospital requests, and keeps an updated record of the inventory in different blood banks so that no time is wasted when someone needs blood.

## Functional Requirements
1. The system shall allow donors to register by providing their personal details, contact information, and blood group.
2. The system shall allow hospitals to register recipients who need blood transfusions.
3. The system shall enable hospitals or patients to submit requests for specific blood groups and units needed.
4. The system shall track the current stock of different blood groups available at registered blood banks.
5. The system shall record details of every blood donation, including the date, units donated, and the donor's ID.
6. The system shall update the status of blood requests to indicate whether they are pending, approved, or rejected.
7. The system shall manage information about participating blood banks, including their storage capacity and location.
8. The system shall provide secure login access for staff members, enforcing specific permissions for Admin and Technician roles.
9. The system shall allow users to search for donors or available blood stock filtering by city and blood group.
10. The system shall generate basic reports showing total donations, active requests, and current inventory levels.

## Non-Functional Requirements
1. The system shall respond to database queries within 2 seconds to ensure fast search results during emergencies.
2. The system shall secure user accounts by storing all staff passwords as cryptographic hashes instead of plain text.
3. The system shall handle the concurrent registration and searching of up to 1,000 donors without performance degradation.

## System Scope
The Blood Donor Network manages donor records, tracks blood inventory in blood banks, and processes blood requests from hospitals or recipients. It acts purely as an information system to connect donors with those in need. It does not include hardware integration for testing blood samples, nor does it handle payment processing or logistics for physically transporting blood between hospitals.
