const API = window.location.origin + '/api/tickets';
let sortField = 'id';
let sortDir = 'desc';
let allTickets = [];

function showPage(pageId, btn) {
    document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
    document.getElementById('page-' + pageId).classList.add('active');
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    if (btn) btn.classList.add('active');
    if (window.innerWidth <= 768) document.getElementById('sidebar').classList.remove('open');
    loadSection(pageId);
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
}

function showToast(msg, type = 'info') {
    const c = document.getElementById('toastContainer');
    const t = document.createElement('div');
    t.className = 'toast ' + type;
    const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', info: 'fa-info-circle' };
    t.innerHTML = '<i class="fas ' + (icons[type] || icons.info) + '" style="font-size:16px;"></i> <span>' + msg + '</span>';
    c.appendChild(t);
    setTimeout(() => {
        t.style.opacity = '0';
        t.style.transform = 'translateX(100px)';
        t.style.transition = '0.3s';
        setTimeout(() => t.remove(), 300);
    }, 3500);
}

function closeModal(id) {
    document.getElementById(id).classList.remove('active');
}

async function apiFetch(url, opts = {}) {
    const res = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...opts });
    if (!res.ok) throw new Error('API Error: ' + res.status);
    if (opts.method === 'DELETE') return null;
    return res.json();
}

async function loadDashboard() {
    try {
        const [tickets, stats] = await Promise.all([apiFetch(API), apiFetch(API + '/stats')]);
        document.getElementById('statsGrid').innerHTML = `
            <div class="stat-card"><div class="stat-top"><div class="stat-icon purple"><i class="fas fa-ticket-alt"></i></div></div>
                <div class="stat-value">${stats.total}</div><div class="stat-label">Total Tickets</div></div>
            <div class="stat-card"><div class="stat-top"><div class="stat-icon red"><i class="fas fa-exclamation-circle"></i></div></div>
                <div class="stat-value">${stats.open}</div><div class="stat-label">Open</div></div>
            <div class="stat-card"><div class="stat-top"><div class="stat-icon orange"><i class="fas fa-spinner"></i></div></div>
                <div class="stat-value">${stats.inProgress}</div><div class="stat-label">In Progress</div></div>
            <div class="stat-card"><div class="stat-top"><div class="stat-icon green"><i class="fas fa-check-circle"></i></div></div>
                <div class="stat-value">${stats.resolved}</div><div class="stat-label">Resolved</div></div>
        `;
        document.getElementById('totalBadge').textContent = stats.total;
        document.getElementById('openBadge').textContent = stats.open;
        document.getElementById('progressBadge').textContent = stats.inProgress;
        document.getElementById('resolvedBadge').textContent = stats.resolved;

        const open = tickets.filter(t => t.status === 'Open').slice(0, 5);
        document.getElementById('dashboardOpen').innerHTML = open.length ? renderTable(open, true) :
            '<div class="empty-state"><i class="fas fa-check-circle" style="color:#059669"></i><h4>All clear!</h4><p>No open tickets</p></div>';
        const resolved = tickets.filter(t => t.status === 'Resolved').slice(-5).reverse();
        document.getElementById('dashboardResolved').innerHTML = resolved.length ? renderTable(resolved, true) :
            '<div class="empty-state"><i class="fas fa-history"></i><h4>No resolved tickets yet</h4></div>';
    } catch (e) {
        showToast('Failed to load dashboard', 'error');
    }
}

function renderTable(tickets, simple = false) {
    if (!tickets.length) return '';
    let h = '<div class="table-responsive"><table><thead><tr>';
    const sortIcon = (f) => sortField === f ? (sortDir === 'asc' ? '<i class="fas fa-sort-up"></i>' : '<i class="fas fa-sort-down"></i>') : '<i class="fas fa-sort"></i>';
    h += '<th onclick="sortBy(\'id\')">ID' + sortIcon('id') + '</th><th onclick="sortBy(\'title\')">Title' + sortIcon('title') + '</th><th>Category</th><th onclick="sortBy(\'priority\')">Priority' + sortIcon('priority') + '</th><th>Status</th><th>Employee</th><th>Department</th><th onclick="sortBy(\'createdDate\')">Created' + sortIcon('createdDate') + '</th>';
    if (!simple) h += '<th>Actions</th>';
    h += '</tr></thead><tbody>';
    const sorted = [...tickets].sort((a, b) => {
        let va = a[sortField] || '';
        let vb = b[sortField] || '';
        if (sortField === 'id' || sortField === 'createdDate') {
            va = new Date(va).getTime() || va;
            vb = new Date(vb).getTime() || vb;
        } else {
            va = String(va).toLowerCase();
            vb = String(vb).toLowerCase();
        }
        return sortDir === 'asc' ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
    });
    sorted.forEach(t => {
        const d = new Date(t.createdDate);
        h += '<tr><td>#' + t.id + '</td><td><div class="td-title" title="' + t.title + '">' + t.title + '</div></td>';
        h += '<td><span class="badge badge-cat">' + t.category + '</span></td>';
        h += '<td><span class="badge badge-' + t.priority.toLowerCase() + '">' + t.priority + '</span></td>';
        h += '<td><span class="badge badge-' + (t.status === 'In Progress' ? 'progress' : t.status.toLowerCase()) + '">' + t.status + '</span></td>';
        h += '<td>' + t.employeeName + '</td><td>' + t.department + '</td>';
        h += '<td>' + d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + '</td>';
        if (!simple) {
            h += '<td><div class="action-group">';
            h += '<button class="action-btn" title="View" onclick="viewTicket(' + t.id + ')"><i class="fas fa-eye"></i></button>';
            h += '<button class="action-btn" title="Resolve" onclick="resolveTicket(' + t.id + ')"><i class="fas fa-check"></i></button>';
            h += '<button class="action-btn" title="Delete" onclick="deleteTicket(' + t.id + ')" style="color:#DC2626"><i class="fas fa-trash"></i></button>';
            h += '</div></td>';
        }
        h += '</tr>';
    });
    h += '</tbody></table></div>';
    return h;
}

function sortBy(field) {
    if (sortField === field) {
        sortDir = sortDir === 'asc' ? 'desc' : 'asc';
    } else {
        sortField = field;
        sortDir = 'desc';
    }
    filterAllTickets();
}

function loadSection(page) {
    if (page === 'dashboard') loadDashboard();
    else if (page === 'alltickets') loadAllTickets();
    else if (page === 'opentickets') loadByStatus('Open', 'openTicketsList');
    else if (page === 'inprogress') loadByStatus('In Progress', 'inProgressList');
    else if (page === 'resolved') loadByStatus('Resolved', 'resolvedList');
}

async function loadAllTickets() {
    try {
        allTickets = await apiFetch(API);
        renderAllTickets(allTickets);
    } catch (e) {
        document.getElementById('allTicketsList').innerHTML = '<div class="empty-state"><i class="fas fa-exclamation-triangle" style="color:#DC2626"></i><h4>Failed to load tickets</h4><p>Is the backend running?</p></div>';
    }
}

function renderAllTickets(tickets) {
    document.getElementById('allTicketsList').innerHTML = tickets.length ? renderTable(tickets) : '<div class="empty-state"><i class="fas fa-ticket"></i><h4>No tickets found</h4></div>';
}

function filterAllTickets() {
    let filtered = [...allTickets];
    const q = document.getElementById('ticketSearch').value.toLowerCase();
    const status = document.getElementById('filterStatus').value;
    const cat = document.getElementById('filterCategory').value;
    const pri = document.getElementById('filterPriority').value;
    const dept = document.getElementById('filterDepartment').value;
    if (q) filtered = filtered.filter(t => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.employeeName.toLowerCase().includes(q) || t.employeeEmail.toLowerCase().includes(q));
    if (status) filtered = filtered.filter(t => t.status === status);
    if (cat) filtered = filtered.filter(t => t.category === cat);
    if (pri) filtered = filtered.filter(t => t.priority === pri);
    if (dept) filtered = filtered.filter(t => t.department === dept);
    renderAllTickets(filtered);
}

async function loadByStatus(status, elId) {
    try {
        const tickets = await apiFetch(`${API}/filter?status=${status}`);
        document.getElementById(elId).innerHTML = tickets.length ? renderTable(tickets) : `<div class="empty-state"><i class="fas fa-inbox"></i><h4>No ${status} tickets</h4></div>`;
    } catch (e) {
        document.getElementById(elId).innerHTML = '<div class="empty-state"><i class="fas fa-exclamation-triangle" style="color:#DC2626"></i><h4>Failed to load</h4></div>';
    }
}

function openRaiseTicketModal() {
    ['ticketTitle', 'ticketDescription', 'ticketName', 'ticketEmail'].forEach(id => document.getElementById(id).value = '');
    document.getElementById('ticketCategory').value = 'Hardware';
    document.getElementById('ticketPriority').value = 'Medium';
    document.getElementById('ticketDepartment').value = 'IT';
    document.getElementById('raiseTicketModal').classList.add('active');
}

async function raiseTicket() {
    const title = document.getElementById('ticketTitle').value.trim();
    const desc = document.getElementById('ticketDescription').value.trim();
    const cat = document.getElementById('ticketCategory').value;
    const pri = document.getElementById('ticketPriority').value;
    const dept = document.getElementById('ticketDepartment').value;
    const name = document.getElementById('ticketName').value.trim();
    const email = document.getElementById('ticketEmail').value.trim();
    if (!title || !desc || !name || !email) {
        showToast('Please fill in all required fields', 'error');
        return;
    }
    try {
        await apiFetch(API, { method: 'POST', body: JSON.stringify({ title, description: desc, category: cat, priority: pri, department: dept, employeeName: name, employeeEmail: email }) });
        showToast('Ticket raised successfully!', 'success');
        closeModal('raiseTicketModal');
        loadSection(currentPage());
    } catch (e) {
        showToast('Failed: ' + e.message, 'error');
    }
}

function currentPage() {
    const active = document.querySelector('.page-section.active');
    return active ? active.id.replace('page-', '') : 'dashboard';
}

async function viewTicket(id) {
    try {
        const t = await apiFetch(API + '/' + id);
        document.getElementById('viewTicketTitle').textContent = '#' + t.id + ' - ' + t.title;
        const d = new Date(t.createdDate);
        const ud = t.updatedDate ? new Date(t.updatedDate) : null;
        let html = '<div class="grid-2" style="margin-bottom:14px;">';
        html += '<div><small style="color:var(--text-muted)">Category</small><br><span class="badge badge-cat">' + t.category + '</span></div>';
        html += '<div><small style="color:var(--text-muted)">Priority</small><br><span class="badge badge-' + t.priority.toLowerCase() + '">' + t.priority + '</span></div>';
        html += '<div><small style="color:var(--text-muted)">Status</small><br><span class="badge badge-' + (t.status === 'In Progress' ? 'progress' : t.status.toLowerCase()) + '">' + t.status + '</span></div>';
        html += '<div><small style="color:var(--text-muted)">Department</small><br>' + t.department + '</div>';
        html += '<div><small style="color:var(--text-muted)">Employee</small><br>' + t.employeeName + '</div>';
        html += '<div><small style="color:var(--text-muted)">Email</small><br>' + t.employeeEmail + '</div>';
        html += '<div><small style="color:var(--text-muted)">Created</small><br>' + d.toLocaleString() + '</div>';
        html += '<div><small style="color:var(--text-muted)">Updated</small><br>' + (ud ? ud.toLocaleString() : '-') + '</div>';
        if (t.assignedTo) html += '<div><small style="color:var(--text-muted)">Assigned To</small><br>' + t.assignedTo + '</div>';
        html += '</div>';
        html += '<div class="desc-box"><small>Description</small><p>' + t.description + '</p></div>';
        if (t.resolution) html += '<div class="resolution-box"><small><i class="fas fa-check-circle"></i> Resolution</small><p>' + t.resolution + '</p></div>';
        document.getElementById('viewTicketBody').innerHTML = html;
        let footer = '';
        if (t.status === 'Open') footer += '<button class="btn btn-warning btn-sm" onclick="quickUpdateStatus(' + t.id + ", 'In Progress'" + ')"><i class="fas fa-play"></i> Start Progress</button>';
        if (t.status === 'In Progress') footer += '<button class="btn btn-success btn-sm" onclick="quickUpdateStatus(' + t.id + ", 'Resolved'" + ')"><i class="fas fa-check"></i> Resolve</button>';
        footer += '<button class="btn btn-secondary btn-sm" onclick="closeModal(\'viewTicketModal\')">Close</button>';
        document.getElementById('viewTicketFooter').innerHTML = footer;
        document.getElementById('viewTicketModal').classList.add('active');
    } catch (e) {
        showToast('Failed to load details', 'error');
    }
}

async function quickUpdateStatus(id, status) {
    try {
        await apiFetch(API + '/' + id + '/status', { method: 'PATCH', body: '"' + status + '"' });
        showToast('Ticket #' + id + ' => ' + status, 'success');
        closeModal('viewTicketModal');
        loadSection(currentPage());
    } catch (e) {
        showToast('Failed update', 'error');
    }
}

async function resolveTicket(id) {
    const res = prompt('Resolution details:');
    if (res === null) return;
    try {
        await apiFetch(API + '/' + id, { method: 'PUT', body: JSON.stringify({ status: 'Resolved', resolution: res || 'Resolved.' }) });
        showToast('Ticket #' + id + ' resolved', 'success');
        loadSection(currentPage());
    } catch (e) {
        showToast('Failed', 'error');
    }
}

async function deleteTicket(id) {
    if (!confirm('Delete ticket #' + id + '?')) return;
    try {
        await apiFetch(API + '/' + id, { method: 'DELETE' });
        showToast('Deleted #' + id, 'info');
        loadSection(currentPage());
    } catch (e) {
        showToast('Failed delete', 'error');
    }
}

document.addEventListener('DOMContentLoaded', () => loadDashboard());
