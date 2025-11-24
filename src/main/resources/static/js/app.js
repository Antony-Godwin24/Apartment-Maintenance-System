const API_URL = '/api';

// --- Auth Functions ---

function showTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.form-section').forEach(sec => sec.classList.add('hidden'));
    
    if (tab === 'login') {
        document.querySelector('button[onclick="showTab(\'login\')"]').classList.add('active');
        document.getElementById('login-form').classList.remove('hidden');
    } else {
        document.querySelector('button[onclick="showTab(\'register\')"]').classList.add('active');
        document.getElementById('register-form').classList.remove('hidden');
    }
}

async function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (res.ok) {
            const data = await res.json();
            localStorage.setItem('token', data.accessToken);
            localStorage.setItem('role', data.role);
            localStorage.setItem('username', username);
            window.location.href = 'dashboard.html';
        } else {
            alert('Login failed');
        }
    } catch (err) {
        console.error(err);
        alert('Error logging in');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const username = document.getElementById('reg-username').value;
    const password = document.getElementById('reg-password').value;
    const phoneNumber = document.getElementById('reg-phone').value;
    const role = document.getElementById('reg-role').value;

    try {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, phoneNumber, role })
        });

        if (res.ok) {
            alert('Registration successful! Please login.');
            showTab('login');
        } else {
            const msg = await res.text();
            alert('Registration failed: ' + msg);
        }
    } catch (err) {
        console.error(err);
        alert('Error registering');
    }
}

function logout() {
    localStorage.clear();
    window.location.href = 'index.html';
}

// --- Dashboard Functions ---

function loadDashboard() {
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');
    
    const formattedRole = role.replace('ROLE_', '');
    document.getElementById('user-display').textContent = `${username} | ${formattedRole}`;

    if (role === 'ROLE_ADMIN') {
        document.querySelectorAll('.admin-only').forEach(el => el.classList.remove('hidden'));
    }

    // Load home by default
    showSection('home');
}

function showSection(sectionId) {
    document.querySelectorAll('.content-section').forEach(sec => sec.classList.add('hidden'));
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));

    if (sectionId === 'home') {
        document.getElementById('home-section').classList.remove('hidden');
        document.querySelector('button[onclick="showSection(\'home\')"]').classList.add('active');
        loadHome();
    } else if (sectionId === 'create') {
        document.getElementById('create-section').classList.remove('hidden');
        document.querySelector('button[onclick="showSection(\'create\')"]').classList.add('active');
        loadApartments();
    } else if (sectionId === 'history') {
        document.getElementById('history-section').classList.remove('hidden');
        document.querySelector('button[onclick="showSection(\'history\')"]').classList.add('active');
        loadRequests('my');
    } else if (sectionId === 'add-apartment') {
        document.getElementById('add-apartment-section').classList.remove('hidden');
        document.querySelector('button[onclick="showSection(\'add-apartment\')"]').classList.add('active');
    }
}

async function loadHome() {
    try {
        const res = await fetch(`${API_URL}/maintenance/all`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (res.ok) {
            const requests = await res.json();
            renderHomeRequests(requests);
        }
    } catch (err) {
        console.error(err);
    }
}

function renderHomeRequests(requests) {
    const list = document.getElementById('home-requests-list');
    list.innerHTML = '';
    const role = localStorage.getItem('role');

    requests.forEach(req => {
        const card = document.createElement('div');
        card.className = 'request-card';
        
        let statusColor = 'var(--text-muted)';
        if (req.status === 'COMPLETED') statusColor = 'var(--success)';
        else if (req.status === 'REJECTED') statusColor = 'var(--danger)';
        else if (req.status === 'PENDING') statusColor = 'var(--warning)';

        let adminControls = '';
        if (role === 'ROLE_ADMIN' && req.status === 'PENDING') {
            adminControls = `
                <div class="admin-controls">
                    <button onclick="updateStatus('${req.id}', 'COMPLETED')" class="btn-success">Completed Work</button>
                </div>
            `;
        }

        card.innerHTML = `
            <h3>${req.description}</h3>
            <div class="meta">
                <span style="color: ${statusColor}; font-weight: bold;">${req.status}</span> | 
                Apt: ${req.apartmentUnit} | 
                By: ${req.username} | 
                ${new Date(req.requestDate).toLocaleString()}
            </div>
            <div class="actions">
                ${adminControls}
            </div>
        `;
        list.appendChild(card);
    });
}

async function updateStatus(id, status) {
    await fetch(`${API_URL}/maintenance/${id}/status?status=${status}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    loadHome();
}

async function loadApartments() {
    try {
        console.log('Fetching apartments...');
        const res = await fetch(`${API_URL}/apartments`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        console.log('Apartments response status:', res.status);

        if (res.ok) {
            const apartments = await res.json();
            console.log('Loaded apartments:', apartments);
            const select = document.getElementById('req-apartment-id');
            select.innerHTML = '<option value="">Select Apartment</option>';
            apartments.forEach(apt => {
                const option = document.createElement('option');
                option.value = apt.id;
                option.textContent = `Unit ${apt.unitNumber} (Floor ${apt.floor})`;
                select.appendChild(option);
            });
        } else {
            console.error('Failed to load apartments');
        }
    } catch (err) {
        console.error('Error loading apartments:', err);
    }
}

async function handleAddApartment(e) {
    e.preventDefault();
    const unitNumber = document.getElementById('apt-unit').value;
    const floor = document.getElementById('apt-floor').value;

    try {
        const res = await fetch(`${API_URL}/apartments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ unitNumber, floor })
        });

        if (res.ok) {
            alert('Apartment added successfully!');
            document.getElementById('apt-unit').value = '';
            document.getElementById('apt-floor').value = '';
            loadApartments(); // Refresh dropdown
        } else {
            alert('Failed to add apartment');
        }
    } catch (err) {
        console.error(err);
        alert('Error adding apartment');
    }
}

async function handleCreateRequest(e) {
    e.preventDefault();
    const btn = document.getElementById('create-btn');
    btn.disabled = true;
    btn.textContent = 'Submitting...';

    const payload = {
        description: document.getElementById('req-description').value,
        apartmentId: document.getElementById('req-apartment-id').value
    };

    try {
        const res = await fetch(`${API_URL}/maintenance`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            alert('Request submitted successfully!');
            document.getElementById('req-description').value = '';
            showSection('history');
        } else {
            const msg = await res.text();
            alert('Submission failed: ' + msg);
        }
    } catch (err) {
        console.error(err);
        alert('Error submitting request');
    } finally {
        btn.disabled = false;
        btn.textContent = 'Submit Request';
    }
}

async function loadRequests(type) {
    const endpoint = type === 'my' ? '' : '/all'; // Adjusted based on controller
    const containerId = type === 'my' ? 'history-list' : 'all-history-list';
    
    try {
        const res = await fetch(`${API_URL}/maintenance${endpoint}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (res.ok) {
            const requests = await res.json();
            const container = document.getElementById(containerId);
            container.innerHTML = '';
            
            if (requests.length === 0) {
                container.innerHTML = '<p>No requests found.</p>';
                return;
            }

            requests.forEach(req => {
                const div = document.createElement('div');
                div.className = 'paper-item';
                div.innerHTML = `
                    <div>
                        <strong>${req.description}</strong><br>
                        <small>Status: ${req.status} | Apt: ${req.apartmentUnit} | Date: ${new Date(req.requestDate).toLocaleString()}</small>
                    </div>
                `;
                container.appendChild(div);
            });
        }
    } catch (err) {
        console.error(err);
    }
}
