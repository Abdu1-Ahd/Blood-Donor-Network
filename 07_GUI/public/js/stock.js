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

async function loadBanks() {
    try {
        const res = await fetch('/api/stock/banks');
        const data = await res.json();
        const formSelect = document.getElementById('ref_bank_id');
        const filterSelect = document.getElementById('filterBank');
        
        data.forEach(b => {
            const option = `<option value="${b.BANK_ID}">${b.BANK_NAME}</option>`;
            formSelect.innerHTML += option;
            filterSelect.innerHTML += option;
        });
    } catch (err) {
        console.error('Failed to load banks', err);
    }
}

async function loadStock() {
    try {
        const filterBank = document.getElementById('filterBank').value;
        const url = filterBank ? `/api/stock/bank/${filterBank}` : '/api/stock';
        
        const res = await fetch(url);
        const data = await res.json();
        const tbody = document.getElementById('stockTable');
        tbody.innerHTML = '';
        data.forEach(d => {
            tbody.innerHTML += `
                <tr>
                    <td>${d.STOCK_ID}</td>
                    <td>${d.BANK_NAME}</td>
                    <td><strong>${d.BLOOD_GROUP}</strong></td>
                    <td>${d.UNITS_AVAILABLE}</td>
                    <td>${d.LAST_UPDATED}</td>
                    <td style="display: ${user.role === 'User' ? 'none' : 'table-cell'}">
                        <button class="btn btn-sm btn-secondary" onclick='editStock(${JSON.stringify(d).replace(/'/g, "&#39;")})'>Edit Units</button>
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
        console.error('Error loading stock', err);
    }
}

document.getElementById('stockForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('stock_id').value;
    
    const payload = {
        ref_bank_id: document.getElementById('ref_bank_id').value,
        blood_group: document.getElementById('blood_group').value,
        units_available: document.getElementById('units_available').value
    };

    try {
        const method = id ? 'PUT' : 'POST';
        const url = id ? `/api/stock/${id}` : '/api/stock';

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            resetForm();
            loadStock();
        } else {
            const err = await res.json();
            alert(err.error || 'Failed to save');
        }
    } catch (err) {
        console.error(err);
    }
});

function editStock(s) {
    document.getElementById('formTitle').innerText = 'Edit Stock Units';
    document.getElementById('stock_id').value = s.STOCK_ID;
    document.getElementById('ref_bank_id').value = s.REF_BANK_ID;
    document.getElementById('ref_bank_id').disabled = true; // Cannot change bank of existing stock row
    document.getElementById('blood_group').value = s.BLOOD_GROUP;
    document.getElementById('blood_group').disabled = true; // Cannot change BG of existing stock row
    document.getElementById('units_available').value = s.UNITS_AVAILABLE;
}

function resetForm() {
    document.getElementById('formTitle').innerText = 'Add/Update Stock Entry';
    document.getElementById('stockForm').reset();
    document.getElementById('stock_id').value = '';
    document.getElementById('ref_bank_id').disabled = false;
    document.getElementById('blood_group').disabled = false;
}

// Initialization
loadBanks().then(() => loadStock());

// session:ba19f863
