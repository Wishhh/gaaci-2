// News Form JavaScript
const API_URL = '/api';
const token = localStorage.getItem('token');

if (!token) {
    window.location.href = 'index.html';
}

let editorInstances = {};

// Toast notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// API call helper
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

// Initialize TinyMCE editors
document.addEventListener('DOMContentLoaded', () => {
    tinymce.init({
        selector: '#news-content-geo',
        plugins: 'anchor autolink charmap codesample emoticons link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange formatpainter pageembed a11ychecker tinymcespellchecker permanentpen powerpaste advtable advcode advtemplate ai mentions tinycomments tableofcontents footnotes mergetags autocorrect typography inlinecss markdown importword exportword exportpdf image',
        toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
        height: 400,
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
        selector: '#news-content-eng',
        plugins: 'anchor autolink charmap codesample emoticons link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange formatpainter pageembed a11ychecker tinymcespellchecker permanentpen powerpaste advtable advcode advtemplate ai mentions tinycomments tableofcontents footnotes mergetags autocorrect typography inlinecss markdown importword exportword exportpdf image',
        toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
        height: 400,
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
                // Load data after both editors are ready
                loadNewsData();
            });
        }
    });
});

// Load news data if editing
async function loadNewsData() {
    const urlParams = new URLSearchParams(window.location.search);
    const newsId = urlParams.get('id');

    if (newsId) {
        document.getElementById('page-title').textContent = 'Edit News';
        try {
            const newsList = await apiCall('/news/all');
            const item = newsList.find(n => n.id == newsId);

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
            }
        } catch (err) {
            showToast('Error loading news item', 'error');
        }
    }
}

// Image preview
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

// Form submission
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
        
        // Redirect back to dashboard after a short delay
        setTimeout(() => {
            window.location.href = 'dashboard.html#news';
        }, 1500);
    } catch (err) {
        showToast(err.message || 'Error saving news', 'error');
    }
});
