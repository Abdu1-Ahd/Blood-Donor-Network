function checkAuth() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.staff_id) {
        window.location.href = 'login.html';
        return false;
    }
    if (user.role !== 'Admin') {
        window.location.href = 'donor_portal.html';
        return false;
    }
    return user;
}

const user = checkAuth();
if (user) {
    document.getElementById('userName').innerText = user.full_name;
}

function logout() {
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}

async function loadDonors() {
    try {
        document.getElementById('searchCity').value = '';
        document.getElementById('searchBg').value = '';

        const res = await fetch('/api/donors');
        const data = await res.json();
        renderTable(data);
    } catch (err) {
        console.error('Error loading donors', err);
    }
}

async function searchDonors() {
    try {
        const city = document.getElementById('searchCity').value;
        const bg = document.getElementById('searchBg').value;
        const params = new URLSearchParams();
        if (city) params.append('city', city);
        if (bg) params.append('blood_group', bg);

        const res = await fetch(`/api/donors/search?${params.toString()}`);
        const data = await res.json();
        renderTable(data);
    } catch (err) {
        console.error('Error searching donors', err);
    }
}

function renderTable(data) {
    const tbody = document.getElementById('donorsTable');
    tbody.innerHTML = '';
    data.forEach(d => {
        // Date formatting wrapper
        const dateStr = d.DOB ? d.DOB.substring(0, 10) : '';
        tbody.innerHTML += `
            <tr>
                <td>${d.DONOR_ID}</td>
                <td>${d.FULL_NAME}</td>
                <td>${dateStr}</td>
                <td>${d.BLOOD_GROUP}</td>
                <td>${d.CONTACT_NO}</td>
                <td>${d.CITY}</td>
                <td>${d.IS_ELIGIBLE}</td>
                <td style="display: ${user.role === 'User' ? 'none' : 'table-cell'}">
                    <button class="btn btn-sm btn-secondary" onclick='editDonor(${JSON.stringify(d).replace(/'/g, "&#39;")})'>Edit</button>
                    <button class="btn btn-sm" onclick="deleteDonor(${d.DONOR_ID})">Delete</button>
                </td>
            </tr>
        `;
    });

    if (user.role === 'User') {
        const formContainer = document.querySelector('.form-container');
        if (formContainer) formContainer.style.display = 'none';
        const ths = document.querySelectorAll('th');
        ths.forEach(th => { if (th.innerText === 'Actions') th.style.display = 'none'; });
    }
}

document.getElementById('donorForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('donor_id').value;
    
    const payload = {
        full_name: document.getElementById('full_name').value,
        dob: document.getElementById('dob').value,
        blood_group: document.getElementById('blood_group').value,
        contact_no: document.getElementById('contact_no').value,
        city: document.getElementById('city').value,
        is_eligible: document.getElementById('is_eligible').value
    };

    try {
        const method = id ? 'PUT' : 'POST';
        const url = id ? `/api/donors/${id}` : '/api/donors';

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            resetForm();
            loadDonors();
        } else {
            const err = await res.json();
            alert(err.error || 'Failed to save');
        }
    } catch (err) {
        console.error(err);
    }
});

function editDonor(donor) {
    document.getElementById('formTitle').innerText = 'Edit Donor';
    document.getElementById('donor_id').value = donor.DONOR_ID;
    document.getElementById('full_name').value = donor.FULL_NAME;
    document.getElementById('dob').value = donor.DOB ? donor.DOB.substring(0, 10) : '';
    document.getElementById('blood_group').value = donor.BLOOD_GROUP;
    document.getElementById('contact_no').value = donor.CONTACT_NO;
    document.getElementById('city').value = donor.CITY;
    document.getElementById('is_eligible').value = donor.IS_ELIGIBLE;
}

function resetForm() {
    document.getElementById('formTitle').innerText = 'Add New Donor';
    document.getElementById('donorForm').reset();
    document.getElementById('donor_id').value = '';
}

async function deleteDonor(id) {
    if (!confirm('Are you sure you want to delete this donor?')) return;
    try {
        const res = await fetch(`/api/donors/${id}`, { method: 'DELETE' });
        if (res.ok) {
            loadDonors();
        } else {
            alert('Failed to delete');
        }
    } catch (err) {
        console.error(err);
    }
}

loadDonors();
