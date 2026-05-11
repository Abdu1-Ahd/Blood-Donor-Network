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
        const res = await fetch('/api/recipients/hospitals');
        const data = await res.json();
        const select = document.getElementById('ref_hospital_id');
        select.innerHTML = '<option value="">-- Select Hospital --</option>';
        data.forEach(h => {
            select.innerHTML += `<option value="${h.HOSPITAL_ID}">${h.HOSPITAL_NAME}</option>`;
        });
    } catch (err) {
        console.error('Failed to load hospitals', err);
    }
}

async function loadRecipients() {
    try {
        const res = await fetch('/api/recipients');
        const data = await res.json();
        const tbody = document.getElementById('recipientsTable');
        tbody.innerHTML = '';
        data.forEach(d => {
            const dateStr = d.ADMITTED_DATE ? d.ADMITTED_DATE.substring(0, 10) : '';
            tbody.innerHTML += `
                <tr>
                    <td>${d.RECIPIENT_ID}</td>
                    <td>${d.FULL_NAME}</td>
                    <td>${d.BLOOD_GROUP}</td>
                    <td>${d.CONTACT_NO}</td>
                    <td>${d.HOSPITAL_NAME}</td>
                    <td>${dateStr}</td>
                    <td style="display: ${user.role === 'User' ? 'none' : 'table-cell'}">
                        <button class="btn btn-sm btn-secondary" onclick='editRecipient(${JSON.stringify(d).replace(/'/g, "&#39;")})'>Edit</button>
                        <button class="btn btn-sm" onclick="deleteRecipient(${d.RECIPIENT_ID})">Delete</button>
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
        console.error('Error loading recipients', err);
    }
}

document.getElementById('recipientForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('recipient_id').value;
    
    const payload = {
        full_name: document.getElementById('full_name').value,
        blood_group: document.getElementById('blood_group').value,
        contact_no: document.getElementById('contact_no').value,
        ref_hospital_id: document.getElementById('ref_hospital_id').value,
        admitted_date: document.getElementById('admitted_date').value
    };

    try {
        const method = id ? 'PUT' : 'POST';
        const url = id ? `/api/recipients/${id}` : '/api/recipients';

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            resetForm();
            loadRecipients();
        } else {
            const err = await res.json();
            alert(err.error || 'Failed to save');
        }
    } catch (err) {
        console.error(err);
    }
});

function editRecipient(r) {
    document.getElementById('formTitle').innerText = 'Edit Recipient';
    document.getElementById('recipient_id').value = r.RECIPIENT_ID;
    document.getElementById('full_name').value = r.FULL_NAME;
    document.getElementById('blood_group').value = r.BLOOD_GROUP;
    document.getElementById('contact_no').value = r.CONTACT_NO;
    document.getElementById('ref_hospital_id').value = r.REF_HOSPITAL_ID;
    document.getElementById('admitted_date').value = r.ADMITTED_DATE ? r.ADMITTED_DATE.substring(0, 10) : '';
}

function resetForm() {
    document.getElementById('formTitle').innerText = 'Add New Recipient';
    document.getElementById('recipientForm').reset();
    document.getElementById('recipient_id').value = '';
}

async function deleteRecipient(id) {
    if (!confirm('Are you sure you want to delete this recipient?')) return;
    try {
        const res = await fetch(`/api/recipients/${id}`, { method: 'DELETE' });
        if (res.ok) {
            loadRecipients();
        } else {
            alert('Failed to delete');
        }
    } catch (err) {
        console.error(err);
    }
}

// Initialization
loadDropdowns().then(() => loadRecipients());
