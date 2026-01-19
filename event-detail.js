document.addEventListener('DOMContentLoaded', function () {
    // --- Localization System ---
    let currentLanguage = 'geo';
    let translations = {};
    let currentEvent = null;
    let eventType = null;
    let eventId = null;
    const storedLanguage = localStorage.getItem('gaaci-language');
    if (storedLanguage === 'geo' || storedLanguage === 'eng') {
        currentLanguage = storedLanguage;
    }

    async function loadTranslations(lang) {
        try {
            const res = await fetch(`locales/${lang === 'geo' ? 'ka' : 'en'}.json`);
            translations = await res.json();
            applyTranslations();
        } catch (err) {
            console.error('Failed to load translations:', err);
        }
    }

    function applyTranslations() {
        // Update HTML lang attribute
        document.documentElement.lang = currentLanguage === 'geo' ? 'ka' : 'en';

        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const keys = key.split('.');
            let value = translations;
            for (const k of keys) {
                value = value && value[k];
            }
            if (value) {
                element.textContent = value;
            }
        });

        // Update language toggle button
        const toggleBtn = document.getElementById('language-toggle');
        if (toggleBtn && translations.header && translations.header.language_toggle) {
            toggleBtn.textContent = translations.header.language_toggle;
        }

        // Update page title
        if (translations.header && translations.header.title) {
            document.title = currentEvent ?
                `${currentLanguage === 'geo' ? currentEvent.title_geo : currentEvent.title_eng} - ${translations.header.title}` :
                `Event Details - ${translations.header.title}`;
        }

        // Re-render event details if event is loaded
        if (currentEvent) {
            renderEventDetails();
        }
    }

    const languageToggle = document.getElementById('language-toggle');
    if (languageToggle) {
        languageToggle.addEventListener('click', () => {
            currentLanguage = currentLanguage === 'geo' ? 'eng' : 'geo';
            localStorage.setItem('gaaci-language', currentLanguage);
            loadTranslations(currentLanguage);
        });
    }

    // Theme Toggle Functionality
    let currentTheme = 'default';
    const themes = ['default', 'blue', 'green', 'red', 'purple'];
    let themeIndex = 0;

    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    function switchTheme() {
        themeIndex = (themeIndex + 1) % themes.length;
        currentTheme = themes[themeIndex];
        themes.forEach(theme => body.classList.remove(`theme-${theme}`));
        if (currentTheme !== 'default') body.setAttribute('data-theme', currentTheme);
        else body.removeAttribute('data-theme');

        const themeEmojis = { 'default': '🎨', 'blue': '🔵', 'green': '🟢', 'red': '🔴', 'purple': '🟣' };
        if (themeToggle) themeToggle.textContent = themeEmojis[currentTheme];
        localStorage.setItem('gaaci-theme', currentTheme);
    }

    const savedTheme = localStorage.getItem('gaaci-theme');
    if (savedTheme && themes.includes(savedTheme)) {
        currentTheme = savedTheme;
        themeIndex = themes.indexOf(savedTheme);
        if (currentTheme !== 'default') body.setAttribute('data-theme', currentTheme);
        const themeEmojis = { 'default': '🎨', 'blue': '🔵', 'green': '🟢', 'red': '🔴', 'purple': '🟣' };
        if (themeToggle) themeToggle.textContent = themeEmojis[currentTheme];
    }
    if (themeToggle) themeToggle.addEventListener('click', switchTheme);

    // --- Parse URL Parameters ---
    function getUrlParams() {
        const params = new URLSearchParams(window.location.search);
        eventId = params.get('id');
        eventType = params.get('type');
        return { id: eventId, type: eventType };
    }

    // --- Fetch Event Data ---
    async function fetchEventData(id, type) {
        let endpoint = '';
        switch (type) {
            case 'event':
                endpoint = `/api/events/${id}`;
                break;
            case 'upcoming':
                endpoint = `/api/upcoming-events/${id}`;
                break;
            case 'activity':
                endpoint = `/api/activities/${id}`;
                break;
            default:
                throw new Error('Invalid event type');
        }

        try {
            const res = await fetch(endpoint);
            if (!res.ok) {
                if (res.status === 404) {
                    throw new Error('Event not found');
                }
                throw new Error('Failed to fetch event');
            }
            return await res.json();
        } catch (err) {
            console.error('Error fetching event:', err);
            throw err;
        }
    }

    // --- Render Event Details ---
    function renderEventDetails() {
        if (!currentEvent) return;

        const container = document.getElementById('event-detail-container');
        const loadingMsg = document.getElementById('loading-message');
        const errorMsg = document.getElementById('error-message');
        const titleEl = document.getElementById('detail-title');
        const dateEl = document.getElementById('detail-date');
        const locationEl = document.getElementById('detail-location');
        const descriptionEl = document.getElementById('detail-description');

        // Hide loading and error messages
        if (loadingMsg) loadingMsg.style.display = 'none';
        if (errorMsg) errorMsg.style.display = 'none';
        if (container) container.style.display = 'block';

        // Set title
        if (titleEl) {
            titleEl.textContent = currentLanguage === 'geo' ? currentEvent.title_geo : currentEvent.title_eng;
        }

        // Set date
        if (dateEl) {
            let dateText = '';
            if (eventType === 'upcoming') {
                if (currentEvent.start_date && currentEvent.end_date) {
                    const startDate = new Date(currentEvent.start_date);
                    const endDate = new Date(currentEvent.end_date);
                    dateText = `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
                } else if (currentEvent.start_date) {
                    dateText = new Date(currentEvent.start_date).toLocaleDateString();
                }
            } else {
                if (currentEvent.event_date) {
                    dateText = new Date(currentEvent.event_date).toLocaleDateString();
                } else if (currentEvent.activity_date) {
                    dateText = new Date(currentEvent.activity_date).toLocaleDateString();
                }
            }
            dateEl.textContent = dateText || '';
        }

        // Set location (for upcoming events)
        if (locationEl && eventType === 'upcoming') {
            if (currentEvent.location_geo || currentEvent.location_eng) {
                locationEl.textContent = currentLanguage === 'geo' ?
                    (currentEvent.location_geo || currentEvent.location_eng) :
                    (currentEvent.location_eng || currentEvent.location_geo);
                locationEl.style.display = 'block';
            } else {
                locationEl.style.display = 'none';
            }
        }

        // Parse Custom Fields
        let fields = [];
        if (currentEvent.custom_fields) {
            if (typeof currentEvent.custom_fields === 'string') {
                try {
                    fields = JSON.parse(currentEvent.custom_fields);
                } catch (e) {
                    fields = [];
                }
            } else if (Array.isArray(currentEvent.custom_fields)) {
                fields = currentEvent.custom_fields;
            }
        }

        // Set Main Description (First Custom Field by default)
        if (descriptionEl) {
            if (fields.length > 0) {
                const mainField = fields[0];
                const mainContent = currentLanguage === 'geo' ? mainField.content_geo : mainField.content_eng;
                descriptionEl.innerHTML = mainContent || '';
                descriptionEl.setAttribute('data-current-field', '0');
            } else {
                descriptionEl.innerHTML = '';
            }
        }

        // Render ALL Custom Fields in Sidebar
        const customFieldsContainer = document.getElementById('custom-fields-container');
        const sidebar = document.getElementById('event-sidebar');
        const sidebarNav = document.getElementById('event-sidebar-nav');

        if (customFieldsContainer) customFieldsContainer.innerHTML = '';
        if (sidebarNav) sidebarNav.innerHTML = '';
        if (sidebar) sidebar.style.display = 'none';

        if (fields.length > 0) {
            if (sidebar) sidebar.style.display = 'block';

            // Loop through ALL fields (including the first one)
            for (let i = 0; i < fields.length; i++) {
                const field = fields[i];
                const title = currentLanguage === 'geo' ? field.title_geo : field.title_eng;
                const content = currentLanguage === 'geo' ? field.content_geo : field.content_eng;

                if (title && content) {
                    // Create Sidebar Link
                    const linkHtml = `<a href="#" class="event-sidebar-link ${i === 0 ? 'active' : ''}" data-field-index="${i}">${title}</a>`;
                    sidebarNav.insertAdjacentHTML('beforeend', linkHtml);
                }
            }

            // Add click event listeners to sidebar links
            sidebarNav.querySelectorAll('.event-sidebar-link').forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const fieldIndex = parseInt(link.getAttribute('data-field-index'));
                    const field = fields[fieldIndex];

                    if (field && descriptionEl) {
                        const content = currentLanguage === 'geo' ? field.content_geo : field.content_eng;
                        descriptionEl.innerHTML = content || '';
                        descriptionEl.setAttribute('data-current-field', fieldIndex.toString());

                        // Update active state
                        sidebarNav.querySelectorAll('.event-sidebar-link').forEach(l => l.classList.remove('active'));
                        link.classList.add('active');

                        // Scroll to top of description
                        descriptionEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                });
            });
        }


        // Update page title
        if (translations.header && translations.header.title) {
            document.title = `${currentLanguage === 'geo' ? currentEvent.title_geo : currentEvent.title_eng} - ${translations.header.title}`;
        }
    }

    // --- Show Error ---
    function showError(message) {
        const loadingMsg = document.getElementById('loading-message');
        const errorMsg = document.getElementById('error-message');
        const container = document.getElementById('event-detail-container');

        if (loadingMsg) loadingMsg.style.display = 'none';
        if (container) container.style.display = 'none';
        if (errorMsg) {
            errorMsg.textContent = message;
            errorMsg.style.display = 'block';
        }
    }

    // --- Initialize ---
    async function initialize() {
        // Load translations
        await loadTranslations(currentLanguage);

        // Parse URL parameters
        const params = getUrlParams();

        if (!params.id || !params.type) {
            showError('Invalid event parameters. Please provide both id and type.');
            return;
        }

        // Validate event type
        if (!['event', 'upcoming', 'activity'].includes(params.type)) {
            showError('Invalid event type. Must be "event", "upcoming", or "activity".');
            return;
        }

        // Fetch event data
        try {
            currentEvent = await fetchEventData(params.id, params.type);
            renderEventDetails();
        } catch (err) {
            console.error('Error loading event:', err);
            showError(err.message || 'Failed to load event details. Please try again later.');
        }
    }

    // Start initialization
    initialize();
});
