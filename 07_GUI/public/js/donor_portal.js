function checkAuth() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.staff_id) {
        window.location.href = 'login.html';
        return false;
    }
    if (user.role === 'Admin') {
        window.location.href = 'dashboard.html';
        return false;
    }
    return user;
}

const user = checkAuth();

document.getElementById('userName').innerText = user.full_name;

function logout() {
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}

function showSection(id, element) {
    // Update Sidebar
    document.querySelectorAll('.sidebar-nav a').forEach(a => a.classList.remove('active'));
    element.classList.add('active');

    // Update Content
    document.querySelectorAll('.portal-section').forEach(s => s.style.display = 'none');
    document.getElementById('section-' + id).style.display = 'block';

    // Clear messages
    document.getElementById('msgBox').style.display = 'none';

    // Load data if needed
    if (id === 'profile') loadProfile();
    if (id === 'register') prepareRegister();
    if (id === 'request') loadBanks();
    if (id === 'donations') loadMyDonations();
    if (id === 'my-requests') loadMyRequests();
    if (id === 'availability') loadAvailability();
}

function showMsg(text, isError = false) {
    const box = document.getElementById('msgBox');
    box.innerText = text;
    box.style.display = 'block';
    box.style.backgroundColor = isError ? '#f8d7da' : '#d4edda';
    box.style.color = isError ? '#721c24' : '#155724';
    box.style.border = `1px solid ${isError ? '#f5c6cb' : '#c3e6cb'}`;
}

// 1. Profile Section
async function loadProfile() {
    try {
        const res = await fetch(`/api/donor-portal/profile/${user.staff_id}`);
        const data = await res.json();
        if (res.ok) {
            document.getElementById('prof-id').value = data.STAFF_ID;
            document.getElementById('prof-username').value = data.USERNAME;
            document.getElementById('prof-name').value = data.FULL_NAME;
            document.getElementById('prof-contact').value = data.CONTACT_NO || '';
            document.getElementById('prof-role').value = data.ROLE;
        }
    } catch (err) {
        console.error(err);
    }
}

async function saveProfile() {
    const btn = document.getElementById('btn-save-profile');
    const name = document.getElementById('prof-name').value.trim();
    const contact = document.getElementById('prof-contact').value.trim();

    if (!name) return showMsg('Full name is required', true);
    if (!contact || isNaN(contact) || contact.length !== 11) return showMsg('Contact number must be exactly 11 digits', true);

    btn.disabled = true;
    try {
        const res = await fetch(`/api/donor-portal/profile/${user.staff_id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ full_name: name, contact_no: contact })
        });
        const data = await res.json();
        if (res.ok) {
            showMsg('Profile updated successfully');
            // Update local storage and UI
            user.full_name = name;
            localStorage.setItem('user', JSON.stringify(user));
            document.getElementById('userName').innerText = name;
        } else {
            showMsg(data.error, true);
        }
    } catch (err) {
        showMsg('Server error', true);
    } finally {
        btn.disabled = false;
    }
}

// 2. Register as Donor Section
function prepareRegister() {
    document.getElementById('reg-name').value = user.full_name;
    // Fetch contact from profile if available
    loadProfile().then(() => {
        document.getElementById('reg-contact').value = document.getElementById('prof-contact').value;
    });
}

async function registerAsDonor() {
    const btn = document.getElementById('btn-register-donor');
    const name = document.getElementById('reg-name').value.trim();
    const dob = document.getElementById('reg-dob').value;
    const bg = document.getElementById('reg-bg').value;
    const contact = document.getElementById('reg-contact').value.trim();
    const city = document.getElementById('reg-city').value.trim();

    if (!name || !dob || !bg || !contact || !city) return showMsg('All fields are required', true);
    if (new Date(dob) >= new Date()) return showMsg('Date of birth must be in the past', true);

    btn.disabled = true;
    try {
        const res = await fetch('/api/donor-portal/register-donor', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ full_name: name, dob, blood_group: bg, contact_no: contact, city })
        });
        const data = await res.json();
        if (res.ok) {
            showMsg(`Registered successfully as a donor. Donor ID: ${data.donor_id}`);
        } else {
            showMsg(data.error, true);
        }
    } catch (err) {
        showMsg('Server error', true);
    } finally {
        btn.disabled = false;
    }
}

// 3. Submit Blood Request Section
async function loadBanks() {
    try {
        const res = await fetch('/api/donor-portal/banks');
        const banks = await res.json();
        const select = document.getElementById('req-bank');
        select.innerHTML = '<option value="">Select Blood Bank</option>';
        banks.forEach(b => {
            select.innerHTML += `<option value="${b.BANK_ID}">${b.BANK_NAME} (${b.CITY})</option>`;
        });
    } catch (err) {
        console.error(err);
    }
}

async function submitRequest() {
    const btn = document.getElementById('btn-submit-request');
    const bg = document.getElementById('req-bg').value;
    const units = document.getElementById('req-units').value;
    const bankId = document.getElementById('req-bank').value;
    
    // We need the contact number from the profile
    await loadProfile();
    const contact = document.getElementById('prof-contact').value;

    if (!bg || !units || !bankId) return showMsg('All fields are required', true);
    if (!contact) return showMsg('Please set your contact number in Profile first', true);

    btn.disabled = true;
    try {
        const res = await fetch('/api/donor-portal/request', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contact_no: contact, blood_group: bg, units_needed: units, ref_bank_id: bankId })
        });
        const data = await res.json();
        if (res.ok) {
            showMsg(`Request submitted successfully. Request ID: ${data.request_id}`);
        } else {
            showMsg(data.error, true);
        }
    } catch (err) {
        showMsg('Server error', true);
    } finally {
        btn.disabled = false;
    }
}

// 4. My Donations Section
async function loadMyDonations() {
    try {
        await loadProfile();
        const contact = document.getElementById('prof-contact').value;
        if (!contact) {
            document.getElementById('donationsTable').innerHTML = '<tr><td colspan="5">Please set your contact number in Profile first.</td></tr>';
            return;
        }

        const res = await fetch(`/api/donor-portal/my-donations/${contact}`);
        const data = await res.json();
        const tbody = document.getElementById('donationsTable');
        tbody.innerHTML = '';
        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5">No donations recorded yet.</td></tr>';
        } else {
            data.forEach(d => {
                tbody.innerHTML += `
                    <tr>
                        <td>${d.DONATION_ID}</td>
                        <td>${d.DONATION_DATE}</td>
                        <td>${d.BLOOD_GROUP}</td>
                        <td>${d.UNITS_DONATED}</td>
                        <td>${d.BANK_NAME}</td>
                    </tr>
                `;
            });
        }
    } catch (err) {
        console.error(err);
    }
}

// 5. My Requests Section
async function loadMyRequests() {
    try {
        await loadProfile();
        const contact = document.getElementById('prof-contact').value;
        if (!contact) {
            document.getElementById('myRequestsTable').innerHTML = '<tr><td colspan="6">Please set your contact number in Profile first.</td></tr>';
            return;
        }

        const res = await fetch(`/api/donor-portal/my-requests/${contact}`);
        const data = await res.json();
        const tbody = document.getElementById('myRequestsTable');
        tbody.innerHTML = '';
        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6">No requests found.</td></tr>';
        } else {
            data.forEach(r => {
                const statusClass = r.STATUS === 'Approved' ? 'status-approved' : 
                                  r.STATUS === 'Fulfilled' ? 'status-fulfilled' :
                                  r.STATUS === 'Rejected' ? 'status-rejected' : 'status-pending';
                tbody.innerHTML += `
                    <tr>
                        <td>${r.REQUEST_ID}</td>
                        <td>${r.REQUEST_DATE}</td>
                        <td>${r.BLOOD_GROUP}</td>
                        <td>${r.UNITS_NEEDED}</td>
                        <td><span class="status-badge ${statusClass}">${r.STATUS}</span></td>
                        <td>${r.BANK_NAME}</td>
                    </tr>
                `;
            });
        }
    } catch (err) {
        console.error(err);
    }
}

// 6. Availability Section
let availabilityData = [];
async function loadAvailability() {
    try {
        const res = await fetch('/api/donor-portal/availability');
        availabilityData = await res.json();
        filterAvailability();
    } catch (err) {
        console.error(err);
    }
}

function filterAvailability() {
    const bg = document.getElementById('filter-bg').value;
    const tbody = document.getElementById('availabilityTable');
    tbody.innerHTML = '';
    
    const filtered = bg === 'all' ? availabilityData : availabilityData.filter(d => d.BLOOD_GROUP === bg);
    
    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4">No stock found matching the filter.</td></tr>';
    } else {
        filtered.forEach(d => {
            tbody.innerHTML += `
                <tr>
                    <td>${d.BANK_NAME}</td>
                    <td>${d.CITY}</td>
                    <td>${d.BLOOD_GROUP}</td>
                    <td>${d.UNITS_AVAILABLE}</td>
                </tr>
            `;
        });
    }
}

// Init
loadProfile();
