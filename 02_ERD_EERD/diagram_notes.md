# ERD and EERD Diagram Notes

Our Blood Donor Network database design includes an Entity-Relationship Diagram (ERD) to show the basic tables and a more advanced Extended Entity-Relationship Diagram (EERD) to capture special relationships.

## The Standard ERD
The top section of the diagram is the standard ERD. It contains our eight main entities: DONOR, RECIPIENT, BLOOD_BANK, DONATION, BLOOD_STOCK, REQUEST, HOSPITAL, and STAFF. We marked all primary keys with an underline by making the text bold and underlined. Notice that DONATION has a double rectangle around it. This is because it is a "weak entity"—a donation cannot exist without a specific donor making it, which is shown by the double diamond identifying relationship. 

## The EERD Specialization (STAFF)
In the bottom section, we show an EERD specialization for our hospital staff. Instead of putting all attributes into one huge STAFF table, we created a parent STAFF entity and two subtypes: ADMIN and TECHNICIAN. We used a circle symbol with a "d" inside to show they are disjoint, meaning a staff member is either an admin or a technician, but never both. The double line connecting the parent to the circle means total participation, so every staff member must belong to one of these two roles. Admins have special attributes like `admin_level`, while Technicians have `lab_certified`.

## The EERD Aggregation
Also in the bottom section, you'll see a dashed box wrapping around the HOSPITAL, BLOOD_BANK, and their `partners_with` relationship. This is called aggregation. It treats the partnership between a hospital and a blood bank as a single conceptual block. We connected the REQUEST entity directly to this block because a blood request isn't just sent to an isolated bank; it's sent in the context of the specific partnership between the requesting hospital and the handling blood bank.

## Relationships Summary

| Relationship Name | Entities Involved | Cardinality | Type |
| :--- | :--- | :--- | :--- |
| **makes** | DONOR, DONATION | (1,N) | Identifying (Weak Entity) |
| **receives** | BLOOD_BANK, DONATION | (1,N) | Standard |
| **stores** | BLOOD_BANK, BLOOD_STOCK | (1,N) | Standard |
| **submits** | RECIPIENT, REQUEST | (1,N) | Standard |
| **handles** | BLOOD_BANK, REQUEST | (1,N) | Standard |
| **admits** | HOSPITAL, RECIPIENT | (1,N) | Standard |
| **partners_with** | HOSPITAL, BLOOD_BANK | (M,N) | Standard |
| **manages** | STAFF, BLOOD_BANK | (N,1) | Standard (One bank has one head staff: 1:1) |
| **registered_at** | DONOR, BLOOD_BANK | (N,1) | Standard |
| **tracks** | BLOOD_STOCK, BLOOD_BANK | Aggregation | Standard |
