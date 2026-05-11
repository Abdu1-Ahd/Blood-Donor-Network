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
    document.getElementById('userRole').innerText = user.role;
}

function logout() {
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}

// Charts Instances
let barChartInstance = null;
let pieChartInstance = null;

async function loadDashboard() {
    try {
        // 1. KPIs
        const kpiRes = await fetch('/api/dashboard/kpis');
        if (kpiRes.ok) {
            const kpis = await kpiRes.json();
            document.getElementById('kpiDonors').innerText = kpis.total_donors;
            document.getElementById('kpiReqs').innerText = kpis.total_requests;
            document.getElementById('kpiPend').innerText = kpis.pending_requests;
            document.getElementById('kpiStock').innerText = kpis.total_stock_units;
        }

        // 2. Bar Chart
        const barRes = await fetch('/api/dashboard/donations-by-bloodgroup');
        if (barRes.ok) {
            const barData = await barRes.json();
            const ctx = document.getElementById('barChart').getContext('2d');
            
            if (barChartInstance) barChartInstance.destroy();
            
            barChartInstance = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: barData.map(d => d.BLOOD_GROUP),
                    datasets: [{
                        label: 'Donations',
                        data: barData.map(d => d.DONATION_COUNT),
                        backgroundColor: '#c0392b'
                    }]
                },
                options: { scales: { y: { beginAtZero: true } } }
            });
        }

        // 3. Pie Chart
        const pieRes = await fetch('/api/dashboard/requests-by-status');
        if (pieRes.ok) {
            const pieData = await pieRes.json();
            const ctx = document.getElementById('pieChart').getContext('2d');
            
            if (pieChartInstance) pieChartInstance.destroy();

            const colors = pieData.map(d => {
                const status = d.STATUS.toLowerCase();
                if(status === 'approved') return '#2ecc71';  // Light Green
                if(status === 'fulfilled') return '#27ae60'; // Dark Green
                if(status === 'pending') return '#f1c40f';   // Yellow
                if(status === 'rejected') return '#e74c3c';  // Red
                return '#34495e'; // Dark Blue/Gray for unknown
            });

            pieChartInstance = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: pieData.map(d => d.STATUS),
                    datasets: [{
                        data: pieData.map(d => d.STATUS_COUNT),
                        backgroundColor: colors
                    }]
                }
            });
        }

        // 4. Top Banks Table
        const tbRes = await fetch('/api/dashboard/top-banks');
        if (tbRes.ok) {
            const banks = await tbRes.json();
            const tbody = document.getElementById('topBanksTable');
            tbody.innerHTML = '';
            banks.forEach(b => {
                tbody.innerHTML += `
                    <tr>
                        <td>${b.BANK_NAME}</td>
                        <td>${b.CITY}</td>
                        <td><strong>${b.TOTAL_STOCK}</strong></td>
                    </tr>
                `;
            });
        }

    } catch (err) {
        console.error('Error loading dashboard:', err);
    }
}

// Initialize
loadDashboard();
