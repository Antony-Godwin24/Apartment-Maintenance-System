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
    } else if (sectionId === 'all-history') {
        document.getElementById('all-history-section').classList.remove('hidden');
        document.querySelector('button[onclick="showSection(\'all-history\')"]').classList.add('active');
        loadRequests('all');
    } else if (sectionId === 'book-apartment') {
        document.getElementById('book-apartment-section').classList.remove('hidden');
        document.querySelector('button[onclick="showSection(\'book-apartment\')"]').classList.add('active');
        loadBookingBlocks();
    } else if (sectionId === 'booking-requests') {
        document.getElementById('booking-requests-section').classList.remove('hidden');
        document.querySelector('button[onclick="showSection(\'booking-requests\')"]').classList.add('active');
        loadBookingRequests();
    } else if (sectionId === 'my-bookings') {
        document.getElementById('my-bookings-section').classList.remove('hidden');
        document.querySelector('button[onclick="showSection(\'my-bookings\')"]').classList.add('active');
        loadMyBookings();
    } else if (sectionId === 'all-flats') {
        document.getElementById('all-flats-section').classList.remove('hidden');
        document.querySelector('button[onclick="showSection(\'all-flats\')"]').classList.add('active');
        loadAllFlats();
    } else if (sectionId === 'all-users') {
        document.getElementById('all-users-section').classList.remove('hidden');
        document.querySelector('button[onclick="showSection(\'all-users\')"]').classList.add('active');
        loadAllUsers();
    } else if (sectionId === 'user-assignments') {
        document.getElementById('user-assignments-section').classList.remove('hidden');
        document.querySelector('button[onclick="showSection(\'user-assignments\')"]').classList.add('active');
        loadUserAssignments();
    } else if (sectionId === 'view-all-flats') {
        document.getElementById('view-all-flats-section').classList.remove('hidden');
        document.querySelector('button[onclick="showSection(\'view-all-flats\')"]').classList.add('active');
        loadViewAllFlats();
    } else if (sectionId === 'add-apartment') {
        document.getElementById('add-apartment-section').classList.remove('hidden');
        document.querySelector('button[onclick="showSection(\'add-apartment\')"]').classList.add('active');
    }
}



async function loadHome() {
    try {
        const [maintenanceRes, bookingRes] = await Promise.all([
            fetch(`${API_URL}/maintenance/all`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }),
            fetch(`${API_URL}/bookings`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })
        ]);

        let requests = [];

        if (maintenanceRes.ok) {
            const maintenance = await maintenanceRes.json();
            requests = requests.concat(maintenance.map(r => ({ ...r, type: 'MAINTENANCE' })));
        }

        if (bookingRes.ok) {
            const bookings = await bookingRes.json();
            // Normalize booking structure to match maintenance for display
            requests = requests.concat(bookings.map(b => ({
                id: b.id,
                description: `Booking Request for Block ${b.apartment.block} - Unit ${b.apartment.unitNumber}`,
                status: b.status,
                apartmentUnit: b.apartment.unitNumber,
                username: b.user.username,
                requestDate: b.requestDate,
                type: 'BOOKING',
                raw: b // Keep raw data for actions
            })));
        }

        // Sort by date desc
        requests.sort((a, b) => new Date(b.requestDate) - new Date(a.requestDate));
        renderHomeRequests(requests);

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
        if (req.status === 'COMPLETED' || req.status === 'APPROVED') statusColor = 'var(--success)';
        else if (req.status === 'REJECTED') statusColor = 'var(--danger)';
        else if (req.status === 'PENDING') statusColor = 'var(--warning)';

        let typeBadge = req.type === 'MAINTENANCE' 
            ? '<span class="status-badge" style="background: rgba(99, 102, 241, 0.1); color: var(--primary);">Maintenance</span>'
            : '<span class="status-badge" style="background: rgba(236, 72, 153, 0.1); color: var(--secondary);">Booking</span>';

        let adminControls = '';
        if (role === 'ROLE_ADMIN' && req.status === 'PENDING') {
            if (req.type === 'MAINTENANCE') {
                adminControls = `
                    <div class="admin-controls">
                        <button onclick="updateStatus('${req.id}', 'COMPLETED')" class="btn-success">Completed Work</button>
                    </div>
                `;
            } else if (req.type === 'BOOKING') {
                adminControls = `
                    <div class="admin-controls">
                        <button onclick="handleBookingAction('${req.id}', 'APPROVED')" class="btn-success">Approve</button>
                        <button onclick="handleBookingAction('${req.id}', 'REJECTED')" class="btn-danger">Reject</button>
                    </div>
                `;
            }
        }

        card.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">
                <h3>${req.description}</h3>
                ${typeBadge}
            </div>
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
                option.textContent = `Block ${apt.block || 'N/A'} - Unit ${apt.unitNumber} (Floor ${apt.floor})`;
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
    const block = document.getElementById('apt-block').value;
    const unitNumber = document.getElementById('apt-unit').value;
    const floor = document.getElementById('apt-floor').value;

    try {
        const res = await fetch(`${API_URL}/apartments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ block, unitNumber, floor })
        });

        if (res.ok) {
            alert('Apartment added successfully!');
            document.getElementById('apt-block').value = '';
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

// --- Booking Functions ---

let allApartments = [];

async function loadBookingBlocks() {
    try {
        const res = await fetch(`${API_URL}/apartments`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (res.ok) {
            allApartments = await res.json();
            const blocks = [...new Set(allApartments.map(a => a.block).filter(Boolean))].sort();
            
            const select = document.getElementById('booking-block-select');
            select.innerHTML = '<option value="">Select Block</option>';
            blocks.forEach(block => {
                const option = document.createElement('option');
                option.value = block;
                option.textContent = `Block ${block}`;
                select.appendChild(option);
            });
        }
    } catch (err) {
        console.error(err);
    }
}

function handleBlockSelect() {
    const block = document.getElementById('booking-block-select').value;
    const floorSelect = document.getElementById('booking-floor-select');
    const grid = document.getElementById('apartment-grid');
    
    floorSelect.innerHTML = '<option value="">Select Floor</option>';
    grid.innerHTML = '';
    
    if (!block) {
        floorSelect.disabled = true;
        return;
    }

    const floors = [...new Set(allApartments
        .filter(a => a.block === block)
        .map(a => a.floor))]
        .sort((a, b) => a - b);

    floors.forEach(floor => {
        const option = document.createElement('option');
        option.value = floor;
        option.textContent = `Floor ${floor}`;
        floorSelect.appendChild(option);
    });
    
    floorSelect.disabled = false;
}

function handleFloorSelect() {
    const block = document.getElementById('booking-block-select').value;
    const floor = parseInt(document.getElementById('booking-floor-select').value);
    const grid = document.getElementById('apartment-grid');
    
    grid.innerHTML = '';
    
    if (!block || isNaN(floor)) return;

    const apartments = allApartments.filter(a => a.block === block && a.floor === floor);
    
    apartments.forEach(apt => {
        const isBooked = apt.resident !== null;
        const div = document.createElement('div');
        div.className = `apartment-seat ${isBooked ? 'booked' : 'available'}`;
        div.onclick = () => !isBooked && bookApartment(apt.id);
        
        div.innerHTML = `
            <div class="seat-icon">🏠</div>
            <div class="seat-number">${apt.unitNumber}</div>
            <div class="seat-status">${isBooked ? 'Booked' : 'Available'}</div>
        `;
        
        grid.appendChild(div);
    });
}

async function bookApartment(apartmentId) {
    if (!confirm('Do you want to request to book this apartment?')) return;

    try {
        const res = await fetch(`${API_URL}/bookings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ apartment: { id: apartmentId } })
        });

        if (res.ok) {
            alert('Booking request sent successfully!');
            loadBookingBlocks(); // Refresh grid
        } else {
            const msg = await res.text();
            alert('Booking failed: ' + msg);
        }
    } catch (err) {
        console.error(err);
        alert('Error booking apartment');
    }
}

async function loadMyBookings() {
    try {
        const res = await fetch(`${API_URL}/bookings/my`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });

        if (res.ok) {
            const bookings = await res.json();
            const container = document.getElementById('my-bookings-list');
            container.innerHTML = '';

            if (bookings.length === 0) {
                container.innerHTML = '<p>No bookings found.</p>';
                return;
            }

            bookings.forEach(booking => {
                const div = document.createElement('div');
                div.className = 'paper-item';
                div.innerHTML = `
                    <div>
                        <strong>Block ${booking.apartment.block} - Unit ${booking.apartment.unitNumber}</strong><br>
                        <span class="status-badge status-${booking.status.toLowerCase()}">${booking.status}</span>
                        <small> | Date: ${new Date(booking.requestDate).toLocaleString()}</small>
                    </div>
                `;
                container.appendChild(div);
            });
        }
    } catch (err) {
        console.error(err);
    }
}

async function loadBookingRequests() {
    try {
        const res = await fetch(`${API_URL}/bookings`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });

        if (res.ok) {
            const requests = await res.json();
            const container = document.getElementById('booking-requests-list');
            container.innerHTML = '';

            if (requests.length === 0) {
                container.innerHTML = '<p>No pending requests.</p>';
                return;
            }

            requests.forEach(req => {
                const div = document.createElement('div');
                div.className = 'paper-item';
                
                let actions = '';
                if (req.status === 'PENDING') {
                    actions = `
                        <div class="admin-controls">
                            <button onclick="handleBookingAction('${req.id}', 'APPROVED')" class="btn-success">Approve</button>
                            <button onclick="handleBookingAction('${req.id}', 'REJECTED')" class="btn-danger">Reject</button>
                        </div>
                    `;
                }

                div.innerHTML = `
                    <div>
                        <strong>Request from ${req.user.username}</strong><br>
                        Block ${req.apartment.block} - Unit ${req.apartment.unitNumber}<br>
                        <span class="status-badge status-${req.status.toLowerCase()}">${req.status}</span>
                    </div>
                    ${actions}
                `;
                container.appendChild(div);
            });
        }
    } catch (err) {
        console.error(err);
    }
}

async function handleBookingAction(id, status) {
    if (!confirm(`Are you sure you want to ${status.toLowerCase()} this request?`)) return;

    try {
        const res = await fetch(`${API_URL}/bookings/${id}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'text/plain',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: status
        });

        if (res.ok) {
            loadBookingRequests();
            loadHome(); // Refresh home to update apartment status
        } else {
            alert('Action failed');
        }
    } catch (err) {
        console.error(err);
    }
}

// --- New Admin Functions ---

async function loadAllFlats() {
    try {
        const res = await fetch(`${API_URL}/apartments`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });

        if (res.ok) {
            const apartments = await res.json();
            const tbody = document.getElementById('all-flats-table-body');
            tbody.innerHTML = '';

            if (apartments.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No apartments found.</td></tr>';
                return;
            }

            // Sort by block, then floor, then unit number
            apartments.sort((a, b) => {
                if (a.block !== b.block) return a.block.localeCompare(b.block);
                if (a.floor !== b.floor) return a.floor - b.floor;
                return a.unitNumber.localeCompare(b.unitNumber);
            });

            apartments.forEach(apt => {
                const row = document.createElement('tr');
                const isBooked = apt.resident !== null;
                const status = isBooked ? 'Booked' : 'Available';
                const statusClass = isBooked ? 'status-booked' : 'status-available';
                const resident = isBooked ? apt.resident.username : '-';

                row.innerHTML = `
                    <td>${apt.block}</td>
                    <td>${apt.floor}</td>
                    <td>${apt.unitNumber}</td>
                    <td><span class="status-badge ${statusClass}">${status}</span></td>
                    <td>${resident}</td>
                `;
                tbody.appendChild(row);
            });
        }
    } catch (err) {
        console.error(err);
    }
}

async function loadAllUsers() {
    try {
        const res = await fetch(`${API_URL}/users`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });

        if (res.ok) {
            const users = await res.json();
            const tbody = document.getElementById('all-users-table-body');
            tbody.innerHTML = '';

            if (users.length === 0) {
                tbody.innerHTML = '<tr><td colspan="4" style="text-align: center;">No users found.</td></tr>';
                return;
            }

            // Sort by username
            users.sort((a, b) => a.username.localeCompare(b.username));

            users.forEach(user => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${user.username}</td>
                    <td>${user.phoneNumber || '-'}</td>
                    <td><span class="status-badge status-${user.role.toLowerCase()}">${user.role}</span></td>
                    <td>
                        <button onclick="deleteUser('${user.id}', '${user.username}')" class="btn-danger" style="font-size: 0.85rem; padding: 0.4rem 0.8rem;">Delete</button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        }
    } catch (err) {
        console.error(err);
    }
}

async function deleteUser(userId, username) {
    if (!confirm(`Are you sure you want to delete user "${username}"?\n\nThis will:\n- Remove their account\n- Free up their apartment (if any)\n- Delete all their bookings and maintenance requests\n\nThis action cannot be undone.`)) {
        return;
    }

    try {
        const res = await fetch(`${API_URL}/users/${userId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });

        if (res.ok) {
            alert('User deleted successfully!');
            loadAllUsers(); // Refresh the table
        } else {
            alert('Failed to delete user');
        }
    } catch (err) {
        console.error(err);
        alert('Error deleting user');
    }
}


async function loadUserAssignments() {
    try {
        const res = await fetch(`${API_URL}/apartments/assignments`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });

        if (res.ok) {
            const assignments = await res.json();
            const tbody = document.getElementById('user-assignments-table-body');
            tbody.innerHTML = '';

            if (assignments.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No user assignments found.</td></tr>';
                return;
            }

            // Sort by username
            assignments.sort((a, b) => a.resident.username.localeCompare(b.resident.username));

            assignments.forEach(apt => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${apt.resident.username}</td>
                    <td>${apt.resident.phoneNumber || '-'}</td>
                    <td>${apt.block}</td>
                    <td>${apt.floor}</td>
                    <td>${apt.unitNumber}</td>
                `;
                tbody.appendChild(row);
            });
        }
    } catch (err) {
        console.error(err);
    }
}

async function loadViewAllFlats() {
    try {
        const res = await fetch(`${API_URL}/apartments`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });

        if (res.ok) {
            const apartments = await res.json();
            const tbody = document.getElementById('view-all-flats-table-body');
            tbody.innerHTML = '';

            if (apartments.length === 0) {
                tbody.innerHTML = '<tr><td colspan="4" style="text-align: center;">No apartments found.</td></tr>';
                return;
            }

            // Sort by block, then floor, then unit number
            apartments.sort((a, b) => {
                if (a.block !== b.block) return a.block.localeCompare(b.block);
                if (a.floor !== b.floor) return a.floor - b.floor;
                return a.unitNumber.localeCompare(b.unitNumber);
            });

            apartments.forEach(apt => {
                const row = document.createElement('tr');
                const isBooked = apt.resident !== null;
                const status = isBooked ? 'Booked' : 'Available';
                const statusClass = isBooked ? 'status-booked' : 'status-available';

                row.innerHTML = `
                    <td>${apt.block}</td>
                    <td>${apt.floor}</td>
                    <td>${apt.unitNumber}</td>
                    <td><span class="status-badge ${statusClass}">${status}</span></td>
                `;
                tbody.appendChild(row);
            });
        }
    } catch (err) {
        console.error(err);
    }
}

