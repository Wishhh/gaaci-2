// Upcoming Event Form JavaScript
const API_URL = '/api';
const token = localStorage.getItem('token');

if (!token) {
    window.location.href = 'index.html';
}

let editorInstances = {};

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
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

// Add custom field
window.addCustomField = function(data = null) {
    const container = document.getElementById('upcoming-custom-fields-container');
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
                <textarea id="upcoming-${id}-geo" class="tinymce-editor"></textarea>
            </div>
            <div class="form-group">
                <label>Content (English)</label>
                <textarea id="upcoming-${id}-eng" class="tinymce-editor"></textarea>
            </div>
        </div>
    `;

    container.insertAdjacentHTML('beforeend', fieldHtml);

    // Initialize TinyMCE
    setTimeout(() => {
        tinymce.init({
            selector: `#upcoming-${id}-geo`,
            plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
            toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
            height: 300,
            setup: function(editor) {
                editor.on('init', function() {
                    if (data && data.content_geo) {
                        editor.setContent(data.content_geo);
                    }
                    editorInstances[`upcoming-${id}-geo`] = editor;
                });
            }
        });

        tinymce.init({
            selector: `#upcoming-${id}-eng`,
            plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
            toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
            height: 300,
            setup: function(editor) {
                editor.on('init', function() {
                    if (data && data.content_eng) {
                        editor.setContent(data.content_eng);
                    }
                    editorInstances[`upcoming-${id}-eng`] = editor;
                });
            }
        });
    }, 0);
};

window.removeCustomField = function(btn) {
    if (confirm('Are you sure you want to remove this field?')) {
        const item = btn.closest('.custom-field-item');
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

// Load upcoming event data if editing
async function loadUpcomingData() {
    const urlParams = new URLSearchParams(window.location.search);
    const upcomingId = urlParams.get('id');

    if (upcomingId) {
        document.getElementById('page-title').textContent = 'Edit Upcoming Event';
        try {
            const event = await apiCall(`/upcoming-events/${upcomingId}`);
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

            // Load Custom Fields
            if (event.custom_fields) {
                const fields = typeof event.custom_fields === 'string' ? JSON.parse(event.custom_fields) : event.custom_fields;
                fields.forEach(field => addCustomField(field));
            }
        } catch (err) {
            showToast('Error loading upcoming event', 'error');
        }
    }
}

// Image preview
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

// Form submission
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

    const upcomingId = document.getElementById('upcoming-id').value;
    const isEdit = !!upcomingId;

    try {
        if (isEdit) {
            await apiCall(`/upcoming-events/${upcomingId}`, {
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
        
        setTimeout(() => {
            window.location.href = 'dashboard.html#upcoming';
        }, 1500);
    } catch (err) {
        showToast(err.message || 'Error saving upcoming event', 'error');
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadUpcomingData();
});
