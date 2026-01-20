// Admin Panel JavaScript
const API_URL = '/api';

// Check authentication
const token = localStorage.getItem('token');
if (!token) {
    window.location.href = 'index.html';
}

// Utility Functions
let editorInstances = {}; // Store TinyMCE editor instances

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
            'publications': 'Publications Management',
            'contact': 'Contact Information',
            'users': 'User Management',
            'employees': 'Employees Management',
            'news': 'News Management'
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
        } else if (sectionName === 'publications') {
            loadPublications();
        } else if (sectionName === 'contact') {
            loadContactInfo();
        } else if (sectionName === 'users') {
            loadUsers();
        } else if (sectionName === 'employees') {
            loadEmployees();
        } else if (sectionName === 'news') {
            loadNews();
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
        const [events, upcoming, activities, sections, employees, publications, news] = await Promise.all([
            apiCall('/events'),
            apiCall('/upcoming-events'),
            apiCall('/activities/all'),
            apiCall('/sections'),
            apiCall('/employees'),
            apiCall('/publications/all'),
            apiCall('/news/all')
        ]);

        document.getElementById('events-count').textContent = events?.length || 0;
        document.getElementById('upcoming-count').textContent = upcoming?.length || 0;
        document.getElementById('activities-count').textContent = activities?.length || 0;
        document.getElementById('sections-count').textContent = sections?.length || 0;
        document.getElementById('employees-count').textContent = employees?.length || 0;
        document.getElementById('publications-count').textContent = publications?.length || 0;
        document.getElementById('news-count').textContent = news?.length || 0;
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
                    <td>${event.image_url ? `<img src="${event.image_url.startsWith('http') || event.image_url.startsWith('/') ? event.image_url : '/' + event.image_url}" alt="Event">` : 'No image'}</td>
                    <td>${event.title_eng || 'N/A'}</td>
                    <td>${event.title_geo || 'N/A'}</td>
                    <td>${formatDate(event.event_date)}</td>
                    <td>
                        <div class="action-buttons">
                            <a href="event-form.html?id=${event.id}" class="btn btn-sm btn-primary">Edit</a>
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
        const contentGeo = editorInstances[`event-${id}-geo`] ? editorInstances[`event-${id}-geo`].getContent() : '';
        const contentEng = editorInstances[`event-${id}-eng`] ? editorInstances[`event-${id}-eng`].getContent() : '';

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
            preview.innerHTML = `<img src="${event.image_url.startsWith('http') || event.image_url.startsWith('/') ? event.image_url : '/' + event.image_url}" alt="Preview">`;
        }

        // Load Custom Fields
        document.getElementById('event-custom-fields-container').innerHTML = '';
        // Remove old TinyMCE instances
        Object.keys(editorInstances).forEach(key => {
            if (key.startsWith('event-')) {
                tinymce.get(key.replace('event-', ''))?.remove();
                delete editorInstances[key];
            }
        });
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
                    <td>${event.image_url ? `<img src="${event.image_url.startsWith('http') || event.image_url.startsWith('/') ? event.image_url : '/' + event.image_url}" alt="Event">` : 'No image'}</td>
                    <td>${event.title_eng || 'N/A'}</td>
                    <td>${event.title_geo || 'N/A'}</td>
                    <td>${formatDate(event.start_date)}</td>
                    <td>${formatDate(event.end_date)}</td>
                    <td>
                        <div class="action-buttons">
                            <a href="upcoming-form.html?id=${event.id}" class="btn btn-sm btn-primary">Edit</a>
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
        const contentGeo = editorInstances[`upcoming-${id}-geo`] ? editorInstances[`upcoming-${id}-geo`].getContent() : '';
        const contentEng = editorInstances[`upcoming-${id}-eng`] ? editorInstances[`upcoming-${id}-eng`].getContent() : '';

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
            preview.innerHTML = `<img src="${event.image_url.startsWith('http') || event.image_url.startsWith('/') ? event.image_url : '/' + event.image_url}" alt="Preview">`;
        }

        openModal('upcoming-modal', 'Edit Upcoming Event');

        // Load Custom Fields
        document.getElementById('upcoming-custom-fields-container').innerHTML = '';
        // Remove old TinyMCE instances
        Object.keys(editorInstances).forEach(key => {
            if (key.startsWith('upcoming-')) {
                tinymce.get(key.replace('upcoming-', ''))?.remove();
                delete editorInstances[key];
            }
        });
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
                    <td>${activity.image_url ? `<img src="${activity.image_url.startsWith('http') || activity.image_url.startsWith('/') ? activity.image_url : '/' + activity.image_url}" alt="Activity">` : 'No image'}</td>
                    <td>${activity.title_eng || 'N/A'}</td>
                    <td>${activity.title_geo || 'N/A'}</td>
                    <td>${formatDate(activity.activity_date)}</td>
                    <td>
                        <div class="action-buttons">
                            <a href="activity-form.html?id=${activity.id}" class="btn btn-sm btn-primary">Edit</a>
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
        const contentGeo = editorInstances[`activity-${id}-geo`] ? editorInstances[`activity-${id}-geo`].getContent() : '';
        const contentEng = editorInstances[`activity-${id}-eng`] ? editorInstances[`activity-${id}-eng`].getContent() : '';

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
            preview.innerHTML = `<img src="${activity.image_url.startsWith('http') || activity.image_url.startsWith('/') ? activity.image_url : '/' + activity.image_url}" alt="Preview">`;
        }

        openModal('activity-modal', 'Edit Activity');

        // Load Custom Fields
        document.getElementById('activity-custom-fields-container').innerHTML = '';
        // Remove old TinyMCE instances
        Object.keys(editorInstances).forEach(key => {
            if (key.startsWith('activity-')) {
                tinymce.get(key.replace('activity-', ''))?.remove();
                delete editorInstances[key];
            }
        });
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

// --- News Management ---
// Initialize News TinyMCE Editors
if (document.getElementById('news-content-geo-container')) {
    tinymce.init({
        selector: '#news-content-geo-container',
        plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
        toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
        height: 300,
        images_upload_url: '/api/upload-image',
        automatic_uploads: true,
        images_reuse_filename: false,
        images_upload_handler: function (blobInfo, progress) {
            return new Promise((resolve, reject) => {
                const formData = new FormData();
                formData.append('file', blobInfo.blob(), blobInfo.filename());
                
                fetch('/api/upload-image', {
                    method: 'POST',
                    headers: {
                        'Authorization': token
                    },
                    body: formData
                })
                .then(response => response.json())
                .then(result => {
                    if (result.location) {
                        resolve(result.location);
                    } else {
                        reject('Upload failed');
                    }
                })
                .catch(err => reject(err));
            });
        },
        setup: function(editor) {
            editor.on('init', function() {
                editorInstances['news-geo'] = editor;
            });
        }
    });

    tinymce.init({
        selector: '#news-content-eng-container',
        plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
        toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
        height: 300,
        images_upload_url: '/api/upload-image',
        automatic_uploads: true,
        images_reuse_filename: false,
        images_upload_handler: function (blobInfo, progress) {
            return new Promise((resolve, reject) => {
                const formData = new FormData();
                formData.append('file', blobInfo.blob(), blobInfo.filename());
                
                fetch('/api/upload-image', {
                    method: 'POST',
                    headers: {
                        'Authorization': token
                    },
                    body: formData
                })
                .then(response => response.json())
                .then(result => {
                    if (result.location) {
                        resolve(result.location);
                    } else {
                        reject('Upload failed');
                    }
                })
                .catch(err => reject(err));
            });
        },
        setup: function(editor) {
            editor.on('init', function() {
                editorInstances['news-eng'] = editor;
            });
        }
    });
}

async function loadNews() {
    const tbody = document.getElementById('news-tbody');
    tbody.innerHTML = '<tr><td colspan="5" class="loading">Loading news...</td></tr>';

    try {
        const news = await apiCall('/news/all');
        if (news && news.length > 0) {
            tbody.innerHTML = news.map(item => `
                <tr>
                    <td>${item.image_url ? `<img src="${item.image_url.startsWith('http') || item.image_url.startsWith('/') ? item.image_url : '/' + item.image_url}" alt="News">` : 'No image'}</td>
                    <td>${item.title_eng || 'N/A'}</td>
                    <td>${item.title_geo || 'N/A'}</td>
                    <td>${formatDate(item.created_at)}</td>
                    <td>
                        <div class="action-buttons">
                            <a href="news-form.html?id=${item.id}" class="btn btn-sm btn-primary">Edit</a>
                            <button class="btn btn-sm btn-danger" onclick="deleteNews(${item.id})">Delete</button>
                        </div>
                    </td>
                </tr>
            `).join('');
        } else {
            tbody.innerHTML = '<tr><td colspan="5" class="empty-state">No news found</td></tr>';
        }
    } catch (err) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-state">Error loading news</td></tr>';
        showToast('Error loading news', 'error');
    }
}

document.getElementById('add-news-btn').addEventListener('click', () => {
    // Reset TinyMCE editors
    if (editorInstances['news-geo']) editorInstances['news-geo'].setContent('');
    if (editorInstances['news-eng']) editorInstances['news-eng'].setContent('');
    openModal('news-modal', 'Add News');
});

document.getElementById('news-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title_geo', document.getElementById('news-title-geo').value);
    formData.append('title_eng', document.getElementById('news-title-eng').value);

    // Get content from TinyMCE
    const contentGeo = editorInstances['news-geo'].getContent();
    const contentEng = editorInstances['news-eng'].getContent();

    formData.append('content_geo', contentGeo);
    formData.append('content_eng', contentEng);

    const imageFile = document.getElementById('news-image').files[0];
    if (imageFile) {
        formData.append('image', imageFile);
    }

    const newsId = document.getElementById('news-id').value;
    const isEdit = !!newsId;

    try {
        if (isEdit) {
            await apiCall(`/news/${newsId}`, {
                method: 'PUT',
                body: formData
            });
            showToast('News updated successfully');
        } else {
            await apiCall('/news', {
                method: 'POST',
                body: formData
            });
            showToast('News added successfully');
        }
        closeModal('news-modal');
        loadNews();
        loadDashboardStats();
    } catch (err) {
        showToast(err.message || 'Error saving news', 'error');
    }
});

window.editNews = async (id) => {
    try {
        const newsList = await apiCall('/news/all'); // Or fetch single if endpoint exists
        const item = newsList.find(n => n.id === id); // Mock fetch single if needed or use /news/:id

        // Better to fetch single to be safe if list isn't full detail, but list has fields
        // Let's assume list has fields for now or fetch single
        // const item = await apiCall(`/news/${id}`); // Assuming public endpoint can be used or add admin specific one if needed.
        // Actually public endpoint /news/:id is public, so admin can use it or the list.

        if (item) {
            document.getElementById('news-id').value = item.id;
            document.getElementById('news-title-geo').value = item.title_geo || '';
            document.getElementById('news-title-eng').value = item.title_eng || '';

            if (editorInstances['news-geo']) editorInstances['news-geo'].setContent(item.content_geo || '');
            if (editorInstances['news-eng']) editorInstances['news-eng'].setContent(item.content_eng || '');

            const preview = document.getElementById('news-image-preview');
            if (item.image_url) {
                preview.innerHTML = `<img src="${item.image_url.startsWith('http') || item.image_url.startsWith('/') ? item.image_url : '/' + item.image_url}" alt="Preview">`;
            }

            openModal('news-modal', 'Edit News');
        }
    } catch (err) {
        showToast('Error loading news item', 'error');
    }
};

window.deleteNews = async (id) => {
    if (!confirm('Are you sure you want to delete this news item?')) return;

    try {
        await apiCall(`/news/${id}`, { method: 'DELETE' });
        showToast('News deleted successfully');
        loadNews();
        loadDashboardStats();
    } catch (err) {
        showToast('Error deleting news', 'error');
    }
};

document.getElementById('news-image').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById('news-image-preview').innerHTML = `<img src="${e.target.result}" alt="Preview">`;
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById('news-search').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const rows = document.querySelectorAll('#news-tbody tr');
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
});


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

// Publications Management
async function loadPublications() {
    const tbody = document.getElementById('publications-tbody');
    tbody.innerHTML = '<tr><td colspan="5" class="loading">Loading publications...</td></tr>';

    try {
        const publications = await apiCall('/publications/all');
        if (publications && publications.length > 0) {
            tbody.innerHTML = publications.map(pub => `
                <tr>
                    <td>${pub.title_eng || 'N/A'}</td>
                    <td>${pub.title_geo || 'N/A'}</td>
                    <td style="max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                        <a href="${pub.link}" target="_blank" rel="noopener noreferrer" title="${pub.link}">${pub.link}</a>
                    </td>
                    <td>${pub.order_index || 0}</td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn btn-sm btn-primary" onclick="editPublication(${pub.id})">Edit</button>
                            <button class="btn btn-sm btn-danger" onclick="deletePublication(${pub.id})">Delete</button>
                        </div>
                    </td>
                </tr>
            `).join('');
        } else {
            tbody.innerHTML = '<tr><td colspan="5" class="empty-state">No publications found</td></tr>';
        }
    } catch (err) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-state">Error loading publications</td></tr>';
        showToast('Error loading publications', 'error');
    }
}

document.getElementById('add-publication-btn').addEventListener('click', () => {
    openModal('publication-modal', 'Add Publication');
});

document.getElementById('publication-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const publicationId = document.getElementById('publication-id').value;
    const isEdit = !!publicationId;

    try {
        const data = {
            title_geo: document.getElementById('publication-title-geo').value,
            title_eng: document.getElementById('publication-title-eng').value,
            link: document.getElementById('publication-link').value,
            order_index: parseInt(document.getElementById('publication-order').value) || 0
        };

        if (isEdit) {
            await apiCall(`/publications/${publicationId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            showToast('Publication updated successfully');
        } else {
            await apiCall('/publications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            showToast('Publication added successfully');
        }
        closeModal('publication-modal');
        loadPublications();
        loadDashboardStats();
    } catch (err) {
        showToast(err.message || 'Error saving publication', 'error');
    }
});

window.editPublication = async (id) => {
    try {
        const publications = await apiCall('/publications/all');
        const publication = publications.find(p => p.id === id);
        if (publication) {
            document.getElementById('publication-id').value = publication.id;
            document.getElementById('publication-title-geo').value = publication.title_geo || '';
            document.getElementById('publication-title-eng').value = publication.title_eng || '';
            document.getElementById('publication-link').value = publication.link || '';
            document.getElementById('publication-order').value = publication.order_index || 0;
            openModal('publication-modal', 'Edit Publication');
        }
    } catch (err) {
        showToast('Error loading publication', 'error');
    }
};

window.deletePublication = async (id) => {
    if (!confirm('Are you sure you want to delete this publication?')) return;

    try {
        await apiCall(`/publications/${id}`, { method: 'DELETE' });
        showToast('Publication deleted successfully');
        loadPublications();
        loadDashboardStats();
    } catch (err) {
        showToast('Error deleting publication', 'error');
    }
};

document.getElementById('publications-search').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const rows = document.querySelectorAll('#publications-tbody tr');
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
});

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

// Employees Management
async function loadEmployees() {
    const tbody = document.getElementById('employees-tbody');
    tbody.innerHTML = '<tr><td colspan="5" class="loading">Loading employees...</td></tr>';

    try {
        const employees = await apiCall('/employees');
        if (employees && employees.length > 0) {
            tbody.innerHTML = employees.map(employee => `
                <tr>
                    <td>${employee.image_url ? `<img src="${employee.image_url.startsWith('http') || employee.image_url.startsWith('/') ? employee.image_url : '/' + employee.image_url}" alt="Employee">` : 'No image'}</td>
                    <td>${employee.name_eng || 'N/A'}</td>
                    <td>${employee.name_geo || 'N/A'}</td>
                    <td>${employee.order_index || 0}</td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn btn-sm btn-primary" onclick="editEmployee(${employee.id})">Edit</button>
                            <button class="btn btn-sm btn-danger" onclick="deleteEmployee(${employee.id})">Delete</button>
                        </div>
                    </td>
                </tr>
            `).join('');
        } else {
            tbody.innerHTML = '<tr><td colspan="5" class="empty-state">No employees found</td></tr>';
        }
    } catch (err) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-state">Error loading employees</td></tr>';
        showToast('Error loading employees', 'error');
    }
}

document.getElementById('add-employee-btn').addEventListener('click', () => {
    openModal('employee-modal', 'Add Employee');
});

document.getElementById('employee-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name_geo', document.getElementById('employee-name-geo').value);
    formData.append('name_eng', document.getElementById('employee-name-eng').value);
    formData.append('details_geo', document.getElementById('employee-details-geo').value);
    formData.append('details_eng', document.getElementById('employee-details-eng').value);
    formData.append('order_index', document.getElementById('employee-order').value);

    const imageFile = document.getElementById('employee-image').files[0];
    if (imageFile) {
        formData.append('image', imageFile);
    }

    const employeeId = document.getElementById('employee-id').value;
    const isEdit = !!employeeId;

    try {
        if (isEdit) {
            await apiCall(`/employees/${employeeId}`, {
                method: 'PUT',
                body: formData
            });
            showToast('Employee updated successfully');
        } else {
            await apiCall('/employees', {
                method: 'POST',
                body: formData
            });
            showToast('Employee added successfully');
        }
        closeModal('employee-modal');
        loadEmployees();
        loadDashboardStats();
    } catch (err) {
        showToast(err.message || 'Error saving employee', 'error');
    }
});

window.editEmployee = async (id) => {
    try {
        const employees = await apiCall('/employees');
        const employee = employees.find(e => e.id === id);
        if (employee) {
            document.getElementById('employee-id').value = employee.id;
            document.getElementById('employee-name-geo').value = employee.name_geo || '';
            document.getElementById('employee-name-eng').value = employee.name_eng || '';
            document.getElementById('employee-details-geo').value = employee.details_geo || '';
            document.getElementById('employee-details-eng').value = employee.details_eng || '';
            document.getElementById('employee-order').value = employee.order_index || 0;

            const preview = document.getElementById('employee-image-preview');
            if (employee.image_url) {
                preview.innerHTML = `<img src="${employee.image_url.startsWith('http') || employee.image_url.startsWith('/') ? employee.image_url : '/' + employee.image_url}" alt="Preview">`;
            }

            openModal('employee-modal', 'Edit Employee');
        }
    } catch (err) {
        showToast('Error loading employee', 'error');
    }
};

window.deleteEmployee = async (id) => {
    if (!confirm('Are you sure you want to delete this employee?')) return;

    try {
        await apiCall(`/employees/${id}`, { method: 'DELETE' });
        showToast('Employee deleted successfully');
        loadEmployees();
        loadDashboardStats();
    } catch (err) {
        showToast('Error deleting employee', 'error');
    }
};

document.getElementById('employee-image').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById('employee-image-preview').innerHTML = `<img src="${e.target.result}" alt="Preview">`;
        };
        reader.readAsDataURL(file);
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
                <textarea id="${type}-${id}-geo" class="tinymce-editor"></textarea>
            </div>
            <div class="form-group">
                <label>Content (English)</label>
                <textarea id="${type}-${id}-eng" class="tinymce-editor"></textarea>
            </div>
        </div>
    `;

    container.insertAdjacentHTML('beforeend', fieldHtml);

    // Initialize TinyMCE
    setTimeout(() => {
        tinymce.init({
            selector: `#${type}-${id}-geo`,
            plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
            toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
            height: 300,
            images_upload_url: '/api/upload-image',
            automatic_uploads: true,
            images_reuse_filename: false,
            images_upload_handler: function (blobInfo, progress) {
                return new Promise((resolve, reject) => {
                    const formData = new FormData();
                    formData.append('file', blobInfo.blob(), blobInfo.filename());
                    
                    fetch('/api/upload-image', {
                        method: 'POST',
                        headers: {
                            'Authorization': token
                        },
                        body: formData
                    })
                    .then(response => response.json())
                    .then(result => {
                        if (result.location) {
                            resolve(result.location);
                        } else {
                            reject('Upload failed');
                        }
                    })
                    .catch(err => reject(err));
                });
            },
            setup: function(editor) {
                editor.on('init', function() {
                    if (data && data.content_geo) {
                        editor.setContent(data.content_geo);
                    }
                    editorInstances[`${type}-${id}-geo`] = editor;
                });
            }
        });

        tinymce.init({
            selector: `#${type}-${id}-eng`,
            plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
            toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
            height: 300,
            images_upload_url: '/api/upload-image',
            automatic_uploads: true,
            images_reuse_filename: false,
            images_upload_handler: function (blobInfo, progress) {
                return new Promise((resolve, reject) => {
                    const formData = new FormData();
                    formData.append('file', blobInfo.blob(), blobInfo.filename());
                    
                    fetch('/api/upload-image', {
                        method: 'POST',
                        headers: {
                            'Authorization': token
                        },
                        body: formData
                    })
                    .then(response => response.json())
                    .then(result => {
                        if (result.location) {
                            resolve(result.location);
                        } else {
                            reject('Upload failed');
                        }
                    })
                    .catch(err => reject(err));
                });
            },
            setup: function(editor) {
                editor.on('init', function() {
                    if (data && data.content_eng) {
                        editor.setContent(data.content_eng);
                    }
                    editorInstances[`${type}-${id}-eng`] = editor;
                });
            }
        });
    }, 0);
};

window.removeCustomField = (btn) => {
    if (confirm('Are you sure you want to remove this field?')) {
        const item = btn.closest('.custom-field-item');
        const id = item.dataset.id;
        
        // Remove TinyMCE instances for this field
        const geoId = item.querySelector('.tinymce-editor')?.id;
        const engId = item.querySelectorAll('.tinymce-editor')[1]?.id;
        
        if (geoId && tinymce.get(geoId)) {
            tinymce.get(geoId).remove();
            delete editorInstances[geoId];
        }
        if (engId && tinymce.get(engId)) {
            tinymce.get(engId).remove();
            delete editorInstances[engId];
        }
        
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
