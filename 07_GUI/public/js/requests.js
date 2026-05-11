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

async function loadDropdowns() {
    try {
        // Load recipients
        const recRes = await fetch('/api/recipients');
        const recipients = await recRes.json();
        const recSelect = document.getElementById('ref_recipient_id');
        recipients.forEach(r => {
            recSelect.innerHTML += `<option value="${r.RECIPIENT_ID}">${r.FULL_NAME}</option>`;
        });

        // Load banks
        const bankRes = await fetch('/api/stock/banks');
        const banks = await bankRes.json();
        const bankSelect = document.getElementById('ref_bank_id');
        banks.forEach(b => {
            bankSelect.innerHTML += `<option value="${b.BANK_ID}">${b.BANK_NAME}</option>`;
        });
    } catch (err) {
        console.error('Failed to load dropdowns', err);
    }
}

async function loadRequests(filter = 'all') {
    try {
        const url = filter === 'pending' ? '/api/requests/pending' : '/api/requests';
        const res = await fetch(url);
        const data = await res.json();
        const tbody = document.getElementById('requestsTable');
        tbody.innerHTML = '';
        data.forEach(d => {
            const statusClass = d.STATUS === 'Approved' ? 'status-approved' : 
                              d.STATUS === 'Fulfilled' ? 'status-fulfilled' :
                              d.STATUS === 'Rejected' ? 'status-rejected' : 'status-pending';
            
            tbody.innerHTML += `
                <tr>
                    <td>${d.REQUEST_ID}</td>
                    <td>${d.RECIPIENT_NAME}</td>
                    <td>${d.BANK_NAME || 'Any'}</td>
                    <td>${d.BLOOD_GROUP}</td>
                    <td>${d.UNITS_NEEDED}</td>
                    <td>${d.REQUEST_DATE}</td>
                    <td>
                        <select onchange="updateStatus(${d.REQUEST_ID}, this.value)" class="status-badge ${statusClass}" ${user.role === 'User' ? 'disabled' : ''}>
                            <option value="Pending" ${d.STATUS === 'Pending' ? 'selected' : ''}>Pending</option>
                            <option value="Approved" ${d.STATUS === 'Approved' ? 'selected' : ''}>Approved</option>
                            <option value="Fulfilled" ${d.STATUS === 'Fulfilled' ? 'selected' : ''}>Fulfilled</option>
                            <option value="Rejected" ${d.STATUS === 'Rejected' ? 'selected' : ''}>Rejected</option>
                        </select>
                    </td>
                    <td style="display: ${user.role === 'User' ? 'none' : 'table-cell'}">
                        <button class="btn btn-sm" onclick="deleteRequest(${d.REQUEST_ID})">Delete</button>
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
    } catch (err) {
        console.error('Error loading requests', err);
    }
}

document.getElementById('requestForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
        ref_recipient_id: document.getElementById('ref_recipient_id').value,
        ref_bank_id: document.getElementById('ref_bank_id').value || null,
        blood_group: document.getElementById('blood_group').value,
        units_needed: document.getElementById('units_needed').value
    };

    try {
        const res = await fetch('/api/requests', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            document.getElementById('requestForm').reset();
            loadRequests();
        } else {
            const err = await res.json();
            alert(err.error || 'Failed to submit request');
        }
    } catch (err) {
        console.error(err);
    }
});

async function updateStatus(id, newStatus) {
    try {
        const res = await fetch(`/api/requests/${id}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });
        
        if (res.ok) {
            loadRequests();
        } else {
            const err = await res.json();
            alert(err.error || 'Failed to update status');
            loadRequests(); // revert select UI on fail
        }
    } catch (err) {
        console.error(err);
    }
}

async function deleteRequest(id) {
    if (!confirm('Are you sure you want to delete this request?')) return;
    try {
        const res = await fetch(`/api/requests/${id}`, { method: 'DELETE' });
        if (res.ok) {
            loadRequests();
        } else {
            alert('Failed to delete');
        }
    } catch (err) {
        console.error(err);
    }
}

// Initialization
loadDropdowns().then(() => loadRequests());
