const user = JSON.parse(localStorage.getItem('user'));
if (!user) window.location.href = 'index.html';
document.getElementById('userName').innerText = user.full_name;

function logout() {
    localStorage.removeItem('user');
    window.location.href = 'index.html';
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
                        <select onchange="updateStatus(${d.REQUEST_ID}, this.value)" class="status-badge ${statusClass}">
                            <option value="Pending" ${d.STATUS === 'Pending' ? 'selected' : ''}>Pending</option>
                            <option value="Approved" ${d.STATUS === 'Approved' ? 'selected' : ''}>Approved</option>
                            <option value="Rejected" ${d.STATUS === 'Rejected' ? 'selected' : ''}>Rejected</option>
                        </select>
                    </td>
                    <td>
                        <button class="btn btn-sm" onclick="deleteRequest(${d.REQUEST_ID})">Delete</button>
                    </td>
                </tr>
            `;
        });
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
