// Admin Panel JavaScript
const API_URL = 'http://localhost:5000/api';

// Check authentication
const token = localStorage.getItem('token');
if (!token) {
    window.location.href = 'index.html';
}

// Utility Functions
let quillInstances = {}; // Store quill instances

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function formatDateInput(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

async function apiCall(endpoint, options = {}) {
    const defaultOptions = {
        headers: {
            'Authorization': token,
            ...options.headers
        }
    };

    if (options.body && !(options.body instanceof FormData)) {
        defaultOptions.headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers
        }
    });

    if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('token');
        window.location.href = 'index.html';
        return null;
    }

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'An error occurred');
    }
    return data;
}

// Navigation
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const section = item.dataset.section;
        showSection(section);
        document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
    });
});

function showSection(sectionName) {
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });

    const section = document.getElementById(`${sectionName}-section`);
    if (section) {
        section.classList.add('active');
        const titles = {
            'dashboard': 'Dashboard',
            'events': 'Events Management',
            'upcoming': 'Upcoming Events',
            'activities': 'Activities Management',
            'about': 'About Information',
            'sections': 'Sections Management',
            'contact': 'Contact Information',
            'users': 'User Management'
        };
        document.getElementById('page-title').textContent = titles[sectionName] || 'Dashboard';

        // Load data when section is shown
        if (sectionName === 'dashboard') {
            loadDashboardStats();
        } else if (sectionName === 'events') {
            loadEvents();
        } else if (sectionName === 'upcoming') {
            loadUpcomingEvents();
        } else if (sectionName === 'activities') {
            loadActivities();
        } else if (sectionName === 'about') {
            loadAboutInfo();
        } else if (sectionName === 'sections') {
            loadSections();
        } else if (sectionName === 'contact') {
            loadContactInfo();
        } else if (sectionName === 'users') {
            loadUsers();
        }
    }
}

// Logout
document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
});

// Modal Functions
function openModal(modalId, title = '') {
    const modal = document.getElementById(modalId);
    if (title) {
        const titleEl = document.getElementById(`${modalId.replace('modal', 'modal-title')}`);
        if (titleEl) titleEl.textContent = title;
    }
    modal.classList.add('active');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('active');
    // Reset form
    const form = modal.querySelector('form');
    if (form) {
        form.reset();
        const preview = modal.querySelector('.image-preview');
        if (preview) preview.innerHTML = '';
        const hiddenId = modal.querySelector('input[type="hidden"]');
        if (hiddenId) hiddenId.value = '';
    }
}

document.querySelectorAll('.modal-close, [data-modal]').forEach(btn => {
    btn.addEventListener('click', (e) => {
        if (e.target.dataset.modal) {
            closeModal(e.target.dataset.modal);
        } else {
            const modal = e.target.closest('.modal');
            if (modal) closeModal(modal.id);
        }
    });
});

// Close modal on outside click
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal(modal.id);
        }
    });
});

// Dashboard Stats
async function loadDashboardStats() {
    try {
        const [events, upcoming, activities, sections] = await Promise.all([
            apiCall('/events'),
            apiCall('/upcoming-events'),
            apiCall('/activities/all'),
            apiCall('/sections')
        ]);

        document.getElementById('events-count').textContent = events?.length || 0;
        document.getElementById('upcoming-count').textContent = upcoming?.length || 0;
        document.getElementById('activities-count').textContent = activities?.length || 0;
        document.getElementById('sections-count').textContent = sections?.length || 0;
    } catch (err) {
        console.error('Error loading dashboard stats:', err);
    }
}

// Events Management
async function loadEvents() {
    const tbody = document.getElementById('events-tbody');
    tbody.innerHTML = '<tr><td colspan="5" class="loading">Loading events...</td></tr>';

    try {
        const events = await apiCall('/events');
        if (events && events.length > 0) {
            tbody.innerHTML = events.map(event => `
                <tr>
                    <td>${event.image_url ? `<img src="${event.image_url}" alt="Event">` : 'No image'}</td>
                    <td>${event.title_eng || 'N/A'}</td>
                    <td>${event.title_geo || 'N/A'}</td>
                    <td>${formatDate(event.event_date)}</td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn btn-sm btn-primary" onclick="editEvent(${event.id})">Edit</button>
                            <button class="btn btn-sm btn-danger" onclick="deleteEvent(${event.id})">Delete</button>
                        </div>
                    </td>
                </tr>
            `).join('');
        } else {
            tbody.innerHTML = '<tr><td colspan="5" class="empty-state">No events found</td></tr>';
        }
    } catch (err) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-state">Error loading events</td></tr>';
        showToast('Error loading events', 'error');
    }
}

document.getElementById('add-event-btn').addEventListener('click', () => {
    openModal('event-modal', 'Add Event');
});

document.getElementById('event-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title_geo', document.getElementById('event-title-geo').value);
    formData.append('title_eng', document.getElementById('event-title-eng').value);
    formData.append('event_date', document.getElementById('event-date').value);

    // Collect Custom Fields
    const customFields = [];
    const container = document.getElementById('event-custom-fields-container');
    container.querySelectorAll('.custom-field-item').forEach(item => {
        const id = item.dataset.id;
        const titleGeo = item.querySelector('.field-title-geo').value;
        const titleEng = item.querySelector('.field-title-eng').value;
        const contentGeo = quillInstances[`event-${id}-geo`].root.innerHTML;
        const contentEng = quillInstances[`event-${id}-eng`].root.innerHTML;

        if (titleGeo || titleEng) {
            customFields.push({
                id: id,
                title_geo: titleGeo,
                title_eng: titleEng,
                content_geo: contentGeo,
                content_eng: contentEng
            });
        }
    });
    formData.append('custom_fields', JSON.stringify(customFields));

    const imageFile = document.getElementById('event-image').files[0];
    if (imageFile) {
        formData.append('image', imageFile);
    }

    const eventId = document.getElementById('event-id').value;
    const isEdit = !!eventId;

    try {
        if (isEdit) {
            await apiCall(`/events/${eventId}`, {
                method: 'PUT',
                body: formData
            });
            showToast('Event updated successfully');
        } else {
            await apiCall('/events', {
                method: 'POST',
                body: formData
            });
            showToast('Event added successfully');
        }
        closeModal('event-modal');
        loadEvents();
        loadDashboardStats();
    } catch (err) {
        showToast(err.message || 'Error saving event', 'error');
    }
});

window.editEvent = async (id) => {
    try {
        const event = await apiCall(`/events/${id}`);
        document.getElementById('event-id').value = event.id;
        document.getElementById('event-title-geo').value = event.title_geo || '';
        document.getElementById('event-title-eng').value = event.title_eng || '';
        document.getElementById('event-date').value = formatDateInput(event.event_date);

        const preview = document.getElementById('event-image-preview');
        if (event.image_url) {
            preview.innerHTML = `<img src="${event.image_url}" alt="Preview">`;
        }

        if (event.image_url) {
            preview.innerHTML = `<img src="${event.image_url}" alt="Preview">`;
        }

        // Load Custom Fields
        document.getElementById('event-custom-fields-container').innerHTML = '';
        quillInstances = {};
        if (event.custom_fields) {
            const fields = typeof event.custom_fields === 'string' ? JSON.parse(event.custom_fields) : event.custom_fields;
            fields.forEach(field => addCustomField('event', field));
        }

        openModal('event-modal', 'Edit Event');
    } catch (err) {
        showToast('Error loading event', 'error');
    }
};

window.deleteEvent = async (id) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
        await apiCall(`/events/${id}`, { method: 'DELETE' });
        showToast('Event deleted successfully');
        loadEvents();
        loadDashboardStats();
    } catch (err) {
        showToast('Error deleting event', 'error');
    }
};

// Image preview
document.getElementById('event-image').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById('event-image-preview').innerHTML = `<img src="${e.target.result}" alt="Preview">`;
        };
        reader.readAsDataURL(file);
    }
});

// Search events
document.getElementById('events-search').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const rows = document.querySelectorAll('#events-tbody tr');
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
});

// Upcoming Events Management
async function loadUpcomingEvents() {
    const tbody = document.getElementById('upcoming-tbody');
    tbody.innerHTML = '<tr><td colspan="6" class="loading">Loading upcoming events...</td></tr>';

    try {
        const events = await apiCall('/upcoming-events');
        if (events && events.length > 0) {
            tbody.innerHTML = events.map(event => `
                <tr>
                    <td>${event.image_url ? `<img src="${event.image_url}" alt="Event">` : 'No image'}</td>
                    <td>${event.title_eng || 'N/A'}</td>
                    <td>${event.title_geo || 'N/A'}</td>
                    <td>${formatDate(event.start_date)}</td>
                    <td>${formatDate(event.end_date)}</td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn btn-sm btn-primary" onclick="editUpcoming(${event.id})">Edit</button>
                            <button class="btn btn-sm btn-danger" onclick="deleteUpcoming(${event.id})">Delete</button>
                        </div>
                    </td>
                </tr>
            `).join('');
        } else {
            tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No upcoming events found</td></tr>';
        }
    } catch (err) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-state">Error loading upcoming events</td></tr>';
        showToast('Error loading upcoming events', 'error');
    }
}

document.getElementById('add-upcoming-btn').addEventListener('click', () => {
    openModal('upcoming-modal', 'Add Upcoming Event');
});

document.getElementById('upcoming-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title_geo', document.getElementById('upcoming-title-geo').value);
    formData.append('title_eng', document.getElementById('upcoming-title-eng').value);
    formData.append('location_geo', document.getElementById('upcoming-location-geo').value);
    formData.append('location_eng', document.getElementById('upcoming-location-eng').value);
    formData.append('start_date', document.getElementById('upcoming-start-date').value);
    formData.append('end_date', document.getElementById('upcoming-end-date').value);

    // Collect Custom Fields
    const customFields = [];
    const container = document.getElementById('upcoming-custom-fields-container');
    container.querySelectorAll('.custom-field-item').forEach(item => {
        const id = item.dataset.id;
        const titleGeo = item.querySelector('.field-title-geo').value;
        const titleEng = item.querySelector('.field-title-eng').value;
        const contentGeo = quillInstances[`upcoming-${id}-geo`].root.innerHTML;
        const contentEng = quillInstances[`upcoming-${id}-eng`].root.innerHTML;

        if (titleGeo || titleEng) {
            customFields.push({
                id: id,
                title_geo: titleGeo,
                title_eng: titleEng,
                content_geo: contentGeo,
                content_eng: contentEng
            });
        }
    });
    formData.append('custom_fields', JSON.stringify(customFields));

    const imageFile = document.getElementById('upcoming-image').files[0];
    if (imageFile) {
        formData.append('image', imageFile);
    }

    const eventId = document.getElementById('upcoming-id').value;
    const isEdit = !!eventId;

    try {
        if (isEdit) {
            await apiCall(`/upcoming-events/${eventId}`, {
                method: 'PUT',
                body: formData
            });
            showToast('Upcoming event updated successfully');
        } else {
            await apiCall('/upcoming-events', {
                method: 'POST',
                body: formData
            });
            showToast('Upcoming event added successfully');
        }
        closeModal('upcoming-modal');
        loadUpcomingEvents();
        loadDashboardStats();
    } catch (err) {
        showToast(err.message || 'Error saving upcoming event', 'error');
    }
});

window.editUpcoming = async (id) => {
    try {
        const event = await apiCall(`/upcoming-events/${id}`);
        document.getElementById('upcoming-id').value = event.id;
        document.getElementById('upcoming-title-geo').value = event.title_geo || '';
        document.getElementById('upcoming-title-eng').value = event.title_eng || '';
        document.getElementById('upcoming-location-geo').value = event.location_geo || '';
        document.getElementById('upcoming-location-eng').value = event.location_eng || '';
        document.getElementById('upcoming-start-date').value = formatDateInput(event.start_date);
        document.getElementById('upcoming-end-date').value = formatDateInput(event.end_date);

        const preview = document.getElementById('upcoming-image-preview');
        if (event.image_url) {
            preview.innerHTML = `<img src="${event.image_url}" alt="Preview">`;
        }

        openModal('upcoming-modal', 'Edit Upcoming Event');

        // Load Custom Fields
        document.getElementById('upcoming-custom-fields-container').innerHTML = '';
        quillInstances = {};
        if (event.custom_fields) {
            const fields = typeof event.custom_fields === 'string' ? JSON.parse(event.custom_fields) : event.custom_fields;
            fields.forEach(field => addCustomField('upcoming', field));
        }

    } catch (err) {
        showToast('Error loading upcoming event', 'error');
    }
};

window.deleteUpcoming = async (id) => {
    if (!confirm('Are you sure you want to delete this upcoming event?')) return;

    try {
        await apiCall(`/upcoming-events/${id}`, { method: 'DELETE' });
        showToast('Upcoming event deleted successfully');
        loadUpcomingEvents();
        loadDashboardStats();
    } catch (err) {
        showToast('Error deleting upcoming event', 'error');
    }
};

document.getElementById('upcoming-image').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById('upcoming-image-preview').innerHTML = `<img src="${e.target.result}" alt="Preview">`;
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById('upcoming-search').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const rows = document.querySelectorAll('#upcoming-tbody tr');
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
});

// Activities Management
async function loadActivities() {
    const tbody = document.getElementById('activities-tbody');
    tbody.innerHTML = '<tr><td colspan="5" class="loading">Loading activities...</td></tr>';

    try {
        const activities = await apiCall('/activities/all');
        if (activities && activities.length > 0) {
            tbody.innerHTML = activities.map(activity => `
                <tr>
                    <td>${activity.image_url ? `<img src="${activity.image_url}" alt="Activity">` : 'No image'}</td>
                    <td>${activity.title_eng || 'N/A'}</td>
                    <td>${activity.title_geo || 'N/A'}</td>
                    <td>${formatDate(activity.activity_date)}</td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn btn-sm btn-primary" onclick="editActivity(${activity.id})">Edit</button>
                            <button class="btn btn-sm btn-danger" onclick="deleteActivity(${activity.id})">Delete</button>
                        </div>
                    </td>
                </tr>
            `).join('');
        } else {
            tbody.innerHTML = '<tr><td colspan="5" class="empty-state">No activities found</td></tr>';
        }
    } catch (err) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-state">Error loading activities</td></tr>';
        showToast('Error loading activities', 'error');
    }
}

document.getElementById('add-activity-btn').addEventListener('click', () => {
    openModal('activity-modal', 'Add Activity');
});

document.getElementById('activity-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title_geo', document.getElementById('activity-title-geo').value);
    formData.append('title_eng', document.getElementById('activity-title-eng').value);
    formData.append('activity_date', document.getElementById('activity-date').value);

    // Collect Custom Fields
    const customFields = [];
    const container = document.getElementById('activity-custom-fields-container');
    container.querySelectorAll('.custom-field-item').forEach(item => {
        const id = item.dataset.id;
        const titleGeo = item.querySelector('.field-title-geo').value;
        const titleEng = item.querySelector('.field-title-eng').value;
        const contentGeo = quillInstances[`activity-${id}-geo`].root.innerHTML;
        const contentEng = quillInstances[`activity-${id}-eng`].root.innerHTML;

        if (titleGeo || titleEng) {
            customFields.push({
                id: id,
                title_geo: titleGeo,
                title_eng: titleEng,
                content_geo: contentGeo,
                content_eng: contentEng
            });
        }
    });
    formData.append('custom_fields', JSON.stringify(customFields));

    const imageFile = document.getElementById('activity-image').files[0];
    if (imageFile) {
        formData.append('image', imageFile);
    }

    const activityId = document.getElementById('activity-id').value;
    const isEdit = !!activityId;

    try {
        if (isEdit) {
            await apiCall(`/activities/${activityId}`, {
                method: 'PUT',
                body: formData
            });
            showToast('Activity updated successfully');
        } else {
            await apiCall('/activities', {
                method: 'POST',
                body: formData
            });
            showToast('Activity added successfully');
        }
        closeModal('activity-modal');
        loadActivities();
        loadDashboardStats();
    } catch (err) {
        showToast(err.message || 'Error saving activity', 'error');
    }
});

window.editActivity = async (id) => {
    try {
        const activity = await apiCall(`/activities/${id}`);
        document.getElementById('activity-id').value = activity.id;
        document.getElementById('activity-title-geo').value = activity.title_geo || '';
        document.getElementById('activity-title-eng').value = activity.title_eng || '';
        document.getElementById('activity-date').value = formatDateInput(activity.activity_date);

        const preview = document.getElementById('activity-image-preview');
        if (activity.image_url) {
            preview.innerHTML = `<img src="${activity.image_url}" alt="Preview">`;
        }

        openModal('activity-modal', 'Edit Activity');

        // Load Custom Fields
        document.getElementById('activity-custom-fields-container').innerHTML = '';
        quillInstances = {};
        if (activity.custom_fields) {
            const fields = typeof activity.custom_fields === 'string' ? JSON.parse(activity.custom_fields) : activity.custom_fields;
            fields.forEach(field => addCustomField('activity', field));
        }

    } catch (err) {
        showToast('Error loading activity', 'error');
    }
};

window.deleteActivity = async (id) => {
    if (!confirm('Are you sure you want to delete this activity?')) return;

    try {
        await apiCall(`/activities/${id}`, { method: 'DELETE' });
        showToast('Activity deleted successfully');
        loadActivities();
        loadDashboardStats();
    } catch (err) {
        showToast('Error deleting activity', 'error');
    }
};

document.getElementById('activity-image').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById('activity-image-preview').innerHTML = `<img src="${e.target.result}" alt="Preview">`;
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById('activities-search').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const rows = document.querySelectorAll('#activities-tbody tr');
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
});

// About Info Management
async function loadAboutInfo() {
    try {
        const about = await apiCall('/about');
        if (about) {
            document.getElementById('about-title-geo').value = about.title_geo || '';
            document.getElementById('about-title-eng').value = about.title_eng || '';
            document.getElementById('about-content-geo').value = about.content_geo || '';
            document.getElementById('about-content-eng').value = about.content_eng || '';
        }
    } catch (err) {
        showToast('Error loading about info', 'error');
    }
}

document.getElementById('about-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        await apiCall('/about', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title_geo: document.getElementById('about-title-geo').value,
                title_eng: document.getElementById('about-title-eng').value,
                content_geo: document.getElementById('about-content-geo').value,
                content_eng: document.getElementById('about-content-eng').value
            })
        });
        showToast('About info saved successfully');
    } catch (err) {
        showToast(err.message || 'Error saving about info', 'error');
    }
});

// Sections Management
async function loadSections() {
    const tbody = document.getElementById('sections-tbody');
    tbody.innerHTML = '<tr><td colspan="3" class="loading">Loading sections...</td></tr>';

    try {
        const sections = await apiCall('/sections');
        if (sections && sections.length > 0) {
            tbody.innerHTML = sections.map(section => `
                <tr>
                    <td>${section.title_eng || 'N/A'}</td>
                    <td>${section.title_geo || 'N/A'}</td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn btn-sm btn-primary" onclick="editSection(${section.id})">Edit</button>
                            <button class="btn btn-sm btn-danger" onclick="deleteSection(${section.id})">Delete</button>
                        </div>
                    </td>
                </tr>
            `).join('');
        } else {
            tbody.innerHTML = '<tr><td colspan="3" class="empty-state">No sections found</td></tr>';
        }
    } catch (err) {
        tbody.innerHTML = '<tr><td colspan="3" class="empty-state">Error loading sections</td></tr>';
        showToast('Error loading sections', 'error');
    }
}

document.getElementById('add-section-btn').addEventListener('click', () => {
    openModal('section-modal', 'Add Section');
});

document.getElementById('section-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const sectionId = document.getElementById('section-id').value;
    const isEdit = !!sectionId;

    try {
        if (isEdit) {
            await apiCall(`/sections/${sectionId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title_geo: document.getElementById('section-title-geo').value,
                    title_eng: document.getElementById('section-title-eng').value
                })
            });
            showToast('Section updated successfully');
        } else {
            await apiCall('/sections', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title_geo: document.getElementById('section-title-geo').value,
                    title_eng: document.getElementById('section-title-eng').value
                })
            });
            showToast('Section added successfully');
        }
        closeModal('section-modal');
        loadSections();
        loadDashboardStats();
    } catch (err) {
        showToast(err.message || 'Error saving section', 'error');
    }
});

window.editSection = async (id) => {
    try {
        const sections = await apiCall('/sections');
        const section = sections.find(s => s.id === id);
        if (section) {
            document.getElementById('section-id').value = section.id;
            document.getElementById('section-title-geo').value = section.title_geo || '';
            document.getElementById('section-title-eng').value = section.title_eng || '';
            openModal('section-modal', 'Edit Section');
        }
    } catch (err) {
        showToast('Error loading section', 'error');
    }
};

window.deleteSection = async (id) => {
    if (!confirm('Are you sure you want to delete this section?')) return;

    try {
        await apiCall(`/sections/${id}`, { method: 'DELETE' });
        showToast('Section deleted successfully');
        loadSections();
        loadDashboardStats();
    } catch (err) {
        showToast('Error deleting section', 'error');
    }
};

// Contact Info Management
async function loadContactInfo() {
    try {
        const contact = await apiCall('/contact');
        if (contact) {
            document.getElementById('contact-phone').value = contact.phone || '';
            document.getElementById('contact-email').value = contact.email || '';
            document.getElementById('contact-address-geo').value = contact.address_geo || '';
            document.getElementById('contact-address-eng').value = contact.address_eng || '';
        }
    } catch (err) {
        showToast('Error loading contact info', 'error');
    }
}

document.getElementById('contact-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        await apiCall('/contact', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                phone: document.getElementById('contact-phone').value,
                email: document.getElementById('contact-email').value,
                address_geo: document.getElementById('contact-address-geo').value,
                address_eng: document.getElementById('contact-address-eng').value
            })
        });
        showToast('Contact info saved successfully');
    } catch (err) {
        showToast(err.message || 'Error saving contact info', 'error');
    }
});

// Users Management
async function loadUsers() {
    const tbody = document.getElementById('users-tbody');
    tbody.innerHTML = '<tr><td colspan="3" class="loading">Loading users...</td></tr>';

    try {
        const users = await apiCall('/admin/users');
        if (users && users.length > 0) {
            tbody.innerHTML = users.map(user => `
                <tr>
                    <td>${user.username}</td>
                    <td>${formatDate(user.created_at)}</td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn btn-sm btn-primary" onclick="editUser(${user.id}, '${user.username}')">Change Password</button>
                            <button class="btn btn-sm btn-danger" onclick="deleteUser(${user.id})">Delete</button>
                        </div>
                    </td>
                </tr>
            `).join('');
        } else {
            tbody.innerHTML = '<tr><td colspan="3" class="empty-state">No users found</td></tr>';
        }
    } catch (err) {
        tbody.innerHTML = '<tr><td colspan="3" class="empty-state">Error loading users</td></tr>';
        showToast('Error loading users', 'error');
    }
}

document.getElementById('add-user-btn').addEventListener('click', () => {
    document.getElementById('user-password-label').textContent = 'Password *';
    document.getElementById('user-password').required = true;
    openModal('user-modal', 'Add User');
});

document.getElementById('user-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const userId = document.getElementById('user-id').value;
    const isEdit = !!userId;

    try {
        if (isEdit) {
            await apiCall(`/admin/users/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    password: document.getElementById('user-password').value
                })
            });
            showToast('User password updated successfully');
        } else {
            await apiCall('/admin/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: document.getElementById('user-username').value,
                    password: document.getElementById('user-password').value
                })
            });
            showToast('User created successfully');
        }
        closeModal('user-modal');
        loadUsers();
    } catch (err) {
        showToast(err.message || 'Error saving user', 'error');
    }
});

// Custom Field Logic
window.addCustomField = (type, data = null) => {
    const container = document.getElementById(`${type}-custom-fields-container`);
    const id = data && data.id ? data.id : Date.now();

    const fieldHtml = `
        <div class="custom-field-item" data-id="${id}">
            <div class="custom-field-header">
                <h4>Custom Field</h4>
                <button type="button" class="remove-field-btn" onclick="removeCustomField(this)">Remove</button>
            </div>
            <div class="form-group">
                <label>Field Title (Georgian)</label>
                <input type="text" class="form-input field-title-geo" value="${data ? data.title_geo || '' : ''}">
            </div>
            <div class="form-group">
                <label>Field Title (English)</label>
                <input type="text" class="form-input field-title-eng" value="${data ? data.title_eng || '' : ''}">
            </div>
            <div class="form-group">
                <label>Content (Georgian)</label>
                <div id="${type}-${id}-geo" class="quill-editor-container"></div>
            </div>
            <div class="form-group">
                <label>Content (English)</label>
                <div id="${type}-${id}-eng" class="quill-editor-container"></div>
            </div>
        </div>
    `;

    container.insertAdjacentHTML('beforeend', fieldHtml);

    // Initialize Quill
    setTimeout(() => {
        const quillGeo = new Quill(`#${type}-${id}-geo`, {
            theme: 'snow',
            modules: {
                toolbar: [
                    ['bold', 'italic', 'underline', 'strike'],
                    ['blockquote', 'code-block'],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                    [{ 'color': [] }, { 'background': [] }],
                    ['clean']
                ]
            }
        });

        const quillEng = new Quill(`#${type}-${id}-eng`, {
            theme: 'snow',
            modules: {
                toolbar: [
                    ['bold', 'italic', 'underline', 'strike'],
                    ['blockquote', 'code-block'],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                    [{ 'color': [] }, { 'background': [] }],
                    ['clean']
                ]
            }
        });

        if (data && data.content_geo) quillGeo.root.innerHTML = data.content_geo;
        if (data && data.content_eng) quillEng.root.innerHTML = data.content_eng;

        quillInstances[`${type}-${id}-geo`] = quillGeo;
        quillInstances[`${type}-${id}-eng`] = quillEng;
    }, 0);
};

window.removeCustomField = (btn) => {
    if (confirm('Are you sure you want to remove this field?')) {
        const item = btn.closest('.custom-field-item');
        item.remove();
    }
};

window.editUser = (id, username) => {
    document.getElementById('user-id').value = id;
    document.getElementById('user-username').value = username;
    document.getElementById('user-username').disabled = true;
    document.getElementById('user-password-label').textContent = 'New Password *';
    document.getElementById('user-password').required = true;
    openModal('user-modal', 'Change Password');
};

window.deleteUser = async (id) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
        await apiCall(`/admin/users/${id}`, { method: 'DELETE' });
        showToast('User deleted successfully');
        loadUsers();
    } catch (err) {
        showToast(err.message || 'Error deleting user', 'error');
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadDashboardStats();
    showSection('dashboard');
});
