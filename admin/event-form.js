// Event Form JavaScript
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
    const container = document.getElementById('event-custom-fields-container');
    const id = data && data.id ? data.id : Date.now();

    const fieldHtml = `
        <div class="custom-field-item" data-id="${id}">
            <div class="custom-field-header">
                <h4>Custom Field</h4>
                <div class="field-controls">
                    <div class="reorder-buttons">
                        <button type="button" class="move-btn" onclick="moveCustomFieldUp(this)" title="Move Up">▲</button>
                        <button type="button" class="move-btn" onclick="moveCustomFieldDown(this)" title="Move Down">▼</button>
                    </div>
                    <button type="button" class="remove-field-btn" onclick="removeCustomField(this)">Remove</button>
                </div>
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
                <textarea id="event-${id}-geo" class="tinymce-editor"></textarea>
            </div>
            <div class="form-group">
                <label>Content (English)</label>
                <textarea id="event-${id}-eng" class="tinymce-editor"></textarea>
            </div>
        </div>
    `;

    container.insertAdjacentHTML('beforeend', fieldHtml);

    // Initialize TinyMCE
    setTimeout(() => {
        tinymce.init({
            selector: `#event-${id}-geo`,
            plugins: 'anchor autolink charmap codesample emoticons link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange formatpainter pageembed a11ychecker tinymcespellchecker permanentpen powerpaste advtable advcode advtemplate tableofcontents footnotes autocorrect typography inlinecss markdown importword exportword exportpdf image',
            toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
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
                    editorInstances[`event-${id}-geo`] = editor;
                });
            }
        });

        tinymce.init({
            selector: `#event-${id}-eng`,
            plugins: 'anchor autolink charmap codesample emoticons link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange formatpainter pageembed a11ychecker tinymcespellchecker permanentpen powerpaste advtable advcode advtemplate tableofcontents footnotes autocorrect typography inlinecss markdown importword exportword exportpdf image',
            toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
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
                    editorInstances[`event-${id}-eng`] = editor;
                    updateReorderButtons();
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
        updateReorderButtons();
    }
};

window.moveCustomFieldUp = function(btn) {
    const item = btn.closest('.custom-field-item');
    const prevItem = item.previousElementSibling;
    
    if (prevItem && prevItem.classList.contains('custom-field-item')) {
        item.parentNode.insertBefore(item, prevItem);
        updateReorderButtons();
    }
};

window.moveCustomFieldDown = function(btn) {
    const item = btn.closest('.custom-field-item');
    const nextItem = item.nextElementSibling;
    
    if (nextItem && nextItem.classList.contains('custom-field-item')) {
        item.parentNode.insertBefore(nextItem, item);
        updateReorderButtons();
    }
};

function updateReorderButtons() {
    const container = document.getElementById('event-custom-fields-container');
    const items = container.querySelectorAll('.custom-field-item');
    
    items.forEach((item, index) => {
        const upBtn = item.querySelector('.move-btn:first-child');
        const downBtn = item.querySelector('.move-btn:last-child');
        
        if (upBtn) upBtn.disabled = (index === 0);
        if (downBtn) downBtn.disabled = (index === items.length - 1);
    });
}

// Load event data if editing
async function loadEventData() {
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('id');

    if (eventId) {
        document.getElementById('page-title').textContent = 'Edit Event';
        try {
            const event = await apiCall(`/events/${eventId}`);
            document.getElementById('event-id').value = event.id;
            document.getElementById('event-title-geo').value = event.title_geo || '';
            document.getElementById('event-title-eng').value = event.title_eng || '';
            document.getElementById('event-date').value = formatDateInput(event.event_date);

            const preview = document.getElementById('event-image-preview');
            if (event.image_url) {
                preview.innerHTML = `<img src="${event.image_url.startsWith('http') || event.image_url.startsWith('/') ? event.image_url : '/' + event.image_url}" alt="Preview">`;
            }

            // Load Custom Fields
            if (event.custom_fields) {
                const fields = typeof event.custom_fields === 'string' ? JSON.parse(event.custom_fields) : event.custom_fields;
                fields.forEach(field => addCustomField(field));
            }
        } catch (err) {
            showToast('Error loading event', 'error');
        }
    }
}

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

// Form submission
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
        
        setTimeout(() => {
            window.location.href = 'dashboard.html#events';
        }, 1500);
    } catch (err) {
        showToast(err.message || 'Error saving event', 'error');
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadEventData();
});
