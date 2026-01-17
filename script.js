document.addEventListener('DOMContentLoaded', function () {
    // --- Localization System ---
    let currentLanguage = 'geo';
    let translations = {};

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
        if (translations.header && translations.header.language_toggle) {
            toggleBtn.textContent = translations.header.language_toggle;
        }

        // Update page title
        if (translations.header && translations.header.title) {
            document.title = translations.header.title;
        }

        // Re-render dynamic content that depends on language
        fetchAndRenderEvents();
        fetchAboutInfo();
        fetchSections();
        fetchContactInfo();
        fetchUpcomingEvent();
        fetchPublications();

        // Update events content if they exist (re-fetch to update language)
        const archiveEventsContent = document.querySelector('.sidebar-item[data-event-type="archive"] .sidebar-events-content');
        const upcomingEventsContent = document.querySelector('.sidebar-item[data-event-type="upcoming"] .sidebar-events-content');
        const activitiesEventsContent = document.querySelector('.sidebar-item[data-event-type="activities"] .sidebar-events-content');

        if (archiveEventsContent && archiveEventsContent.hasChildNodes() && !archiveEventsContent.querySelector('.sidebar-events-empty')) {
            fetchArchiveEvents();
        }
        if (upcomingEventsContent && upcomingEventsContent.hasChildNodes() && !upcomingEventsContent.querySelector('.sidebar-events-empty')) {
            fetchUpcomingEvents();
        }
        if (activitiesEventsContent && activitiesEventsContent.hasChildNodes() && !activitiesEventsContent.querySelector('.sidebar-events-empty')) {
            fetchActivities();
        }

        // Fetch Employees if on about page
        const employeesGrid = document.getElementById('employees-grid');
        if (employeesGrid) {
            fetchEmployees();
        }

        // Fetch second upcoming event for top sidebar
        fetchSecondUpcomingEvent();
    }

    const languageToggle = document.getElementById('language-toggle');
    if (languageToggle) {
        languageToggle.addEventListener('click', () => {
            currentLanguage = currentLanguage === 'geo' ? 'eng' : 'geo';
            loadTranslations(currentLanguage);
        });
    }

    // --- Dynamic Content Fetching ---

    // Fetch Events Dynamically
    function truncateText(text, maxLength) {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substr(0, maxLength) + '...';
    }

    async function fetchAndRenderEvents() {
        const container = document.getElementById('events-container');
        if (!container) return;

        try {
            const res = await fetch('http://localhost:5000/api/events');
            const events = await res.json();

            container.innerHTML = '';
            events.forEach(event => {
                const navDiv = document.createElement('div');
                navDiv.className = 'event-item';
                navDiv.style.cursor = 'pointer';
                const imageUrl = event.image_url || 'images/logo.png';

                navDiv.innerHTML = `
                    <div class="event-image">
                        <img src="${imageUrl}" alt="${event.title_geo}">
                    </div>
                    <div class="event-content">
                        <h3 class="event-title">${currentLanguage === 'geo' ? event.title_geo : event.title_eng}</h3>
                        <p class="event-details">${truncateText(currentLanguage === 'geo' ? event.details_geo : event.details_eng, 150)}</p>
                    </div>
                `;

                navDiv.addEventListener('mouseenter', function () { this.style.transform = 'translateY(-5px)'; });
                navDiv.addEventListener('mouseleave', function () { this.style.transform = 'translateY(0)'; });
                navDiv.addEventListener('click', function () {
                    window.location.href = `event-detail.html?id=${event.id}&type=event`;
                });
                container.appendChild(navDiv);
            });
        } catch (err) {
            console.error('Failed to fetch events:', err);
        }
    }

    // Fetch About Info
    async function fetchAboutInfo() {
        try {
            const res = await fetch('http://localhost:5000/api/about');
            const data = await res.json();

            const titleEl = document.getElementById('about-title');
            const textEl = document.getElementById('about-text');

            if (data.title_geo && titleEl && textEl) {
                titleEl.textContent = currentLanguage === 'geo' ? data.title_geo : data.title_eng;
                textEl.textContent = currentLanguage === 'geo' ? data.content_geo : data.content_eng;
            }
        } catch (err) {
            console.error('Failed to fetch about info', err);
        }
    }

    // Fetch Sections
    async function fetchSections() {
        const grid = document.getElementById('sections-grid');
        if (!grid) return;
        try {
            const res = await fetch('http://localhost:5000/api/sections');
            const sections = await res.json();

            grid.innerHTML = '';
            sections.forEach(sec => {
                const div = document.createElement('div');
                div.className = 'section-item';
                div.textContent = currentLanguage === 'geo' ? sec.title_geo : sec.title_eng;
                grid.appendChild(div);
            });
        } catch (err) {
            console.error('Failed to fetch sections', err);
        }
    }

    // Fetch Contact Info
    async function fetchContactInfo() {
        try {
            const res = await fetch('http://localhost:5000/api/contact');
            const data = await res.json();

            if (data.phone) {
                const phoneEl = document.getElementById('contact-phone');
                const emailEl = document.getElementById('contact-email');
                const addressEl = document.getElementById('contact-address');

                if (phoneEl) phoneEl.textContent = data.phone;
                if (emailEl) emailEl.textContent = data.email;
                if (addressEl) addressEl.textContent = currentLanguage === 'geo' ? data.address_geo : data.address_eng;
            }
        } catch (err) {
            console.error('Failed to fetch contact info', err);
        }
    }

    // Fetch Upcoming Event
    let countdownInterval;
    async function fetchUpcomingEvent() {
        try {
            const res = await fetch('http://localhost:5000/api/upcoming-event');
            const event = await res.json();

            if (event.title_geo) {
                const titleEl = document.getElementById('upcoming-title');
                const detailsEl = document.getElementById('upcoming-details');

                if (titleEl) {
                    titleEl.textContent = currentLanguage === 'geo' ? event.title_geo : event.title_eng;
                }
                if (detailsEl) {
                    detailsEl.textContent = currentLanguage === 'geo' ? event.location_geo : event.location_eng;
                }

                const img = document.getElementById('upcoming-image');
                if (img && event.image_url) img.src = event.image_url;

                // Make the upcoming event block clickable
                const eventBlock = document.querySelector('.congress-block');
                if (eventBlock && event.id) {
                    eventBlock.style.cursor = 'pointer';
                    eventBlock.addEventListener('click', function () {
                        window.location.href = `event-detail.html?id=${event.id}&type=upcoming`;
                    });
                }

                // Initialize Countdown
                if (event.start_date) {
                    startCountdown(new Date(event.start_date).getTime());
                }
            }
        } catch (err) {
            console.error('Failed to fetch upcoming event', err);
        }
    }

    // Countdown Logic
    function startCountdown(targetDate) {
        if (countdownInterval) clearInterval(countdownInterval);

        const countdownNumbers = document.querySelectorAll('.countdown-number');
        if (countdownNumbers.length === 0) return;

        function updateCountdown() {
            const now = new Date().getTime();
            const timeLeft = targetDate - now;

            if (timeLeft > 0) {
                const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
                const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

                countdownNumbers[0].textContent = days.toString().padStart(2, '0');
                countdownNumbers[1].textContent = hours.toString().padStart(2, '0');
                countdownNumbers[2].textContent = minutes.toString().padStart(2, '0');
                countdownNumbers[3].textContent = seconds.toString().padStart(2, '0');
            } else {
                countdownNumbers.forEach(el => el.textContent = '00');
            }

            // Labels are handled by applyTranslations usually, but if countdown re-renders they might persist? 
            // In this HTML structure, labels are static divs with data-i18n, so we don't need to re-render them here.
        }

        updateCountdown();
        countdownInterval = setInterval(updateCountdown, 1000);
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
        themeToggle.textContent = themeEmojis[currentTheme];
        localStorage.setItem('gaaci-theme', currentTheme);
    }

    const savedTheme = localStorage.getItem('gaaci-theme');
    if (savedTheme && themes.includes(savedTheme)) {
        currentTheme = savedTheme;
        themeIndex = themes.indexOf(savedTheme);
        if (currentTheme !== 'default') body.setAttribute('data-theme', currentTheme);
        const themeEmojis = { 'default': '🎨', 'blue': '🔵', 'green': '🟢', 'red': '🔴', 'purple': '🟣' };
        themeToggle.textContent = themeEmojis[currentTheme];
    }
    if (themeToggle) themeToggle.addEventListener('click', switchTheme);

    // Smooth scroll for navigation links
    const navLinks = document.querySelectorAll('.sidebar-item[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });

    // Footer links smooth scroll
    const footerLinks = document.querySelectorAll('.footer-links a[href^="#"]');
    footerLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });

    // Handle clicks on sidebar event items (hover dropdown items)
    // This is a fallback for hash links - individual items handle their own clicks
    document.addEventListener('click', function (e) {
        const eventItem = e.target.closest('.sidebar-event-item');
        if (eventItem) {
            const href = eventItem.getAttribute('href');
            // Only handle hash links (internal navigation) if not already handled
            if (href && href.startsWith('#') && !e.defaultPrevented) {
                e.preventDefault();
                e.stopPropagation();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
            // For external links (like event-detail.html), do nothing - let browser handle it
        }
    });

    // Sidebar content replacement functionality
    function initializeSidebarDropdowns() {
        const aboutItem = document.querySelector('.sidebar-item[data-event-type="about"]');
        const archiveItem = document.querySelector('.sidebar-item[data-event-type="archive"]');
        const upcomingItem = document.querySelector('.sidebar-item[data-event-type="upcoming"]');
        const activitiesItem = document.querySelector('.sidebar-item[data-event-type="activities"]');

        // Function to sync heights of both items
        function syncHeights(forceRestore = false) {
            if (archiveItem && upcomingItem) {
                const archiveHeight = archiveItem.offsetHeight;
                const upcomingHeight = upcomingItem.offsetHeight;
                const archiveOriginal = parseInt(archiveItem.dataset.originalHeight) || archiveHeight;
                const upcomingOriginal = parseInt(upcomingItem.dataset.originalHeight) || upcomingHeight;

                if (forceRestore) {
                    // Restore both to original heights
                    archiveItem.style.height = archiveOriginal + 'px';
                    upcomingItem.style.height = upcomingOriginal + 'px';
                } else {
                    // Only sync if one is expanded (height > original)
                    const maxHeight = Math.max(archiveHeight, upcomingHeight);

                    if (archiveHeight > archiveOriginal || upcomingHeight > upcomingOriginal) {
                        // Both should be at max height
                        archiveItem.style.height = maxHeight + 'px';
                        upcomingItem.style.height = maxHeight + 'px';
                    }
                }
            }
        }

        // About (static list)
        if (aboutItem && !aboutItem.dataset.initialized) {
            aboutItem.dataset.initialized = 'true';
            let eventsContent = aboutItem.querySelector('.sidebar-events-content');
            if (!eventsContent) {
                eventsContent = document.createElement('div');
                eventsContent.className = 'sidebar-events-content';
                aboutItem.appendChild(eventsContent);
            }

            const originalHeight = aboutItem.offsetHeight;
            aboutItem.dataset.originalHeight = originalHeight;

            aboutItem.addEventListener('mouseenter', () => {
                const itemsGeo = [
                    'საკია-ს შესახებ',
                    'კონტაქტი',
                    'წევრობა',
                ];

                const itemsEng = [
                    'about GAACI',
                    'Contact',
                    'Membership',
                ];

                const list = document.createElement('div');
                list.className = 'sidebar-events-list';

                const items = currentLanguage === 'geo' ? itemsGeo : itemsEng;
                const links = currentLanguage === 'geo' ?
                    ['about.html', 'contact.html', 'membership.html', 'membership.html'] :
                    ['about.html', 'contact.html', 'membership.html', 'membership.html'];

                items.forEach((text, index) => {
                    const item = document.createElement('a');
                    item.href = links[index] || '#about-section';
                    item.className = 'sidebar-event-item';
                    item.innerHTML = `<div class="sidebar-event-item-title">${text}</div>`;
                    list.appendChild(item);
                });

                eventsContent.innerHTML = '';
                eventsContent.appendChild(list);

                setTimeout(() => {
                    aboutItem.style.height = 'auto';
                }, 50);
            });

            aboutItem.addEventListener('mouseleave', () => {
                const original = parseInt(aboutItem.dataset.originalHeight) || aboutItem.offsetHeight;
                aboutItem.style.height = original + 'px';
            });
        }

        // Archive events
        if (archiveItem && !archiveItem.dataset.initialized) {
            archiveItem.dataset.initialized = 'true';
            // Ensure events container exists
            let eventsContent = archiveItem.querySelector('.sidebar-events-content');
            if (!eventsContent) {
                eventsContent = document.createElement('div');
                eventsContent.className = 'sidebar-events-content';
                archiveItem.appendChild(eventsContent);
            }

            // Store original height
            const originalHeight = archiveItem.offsetHeight;
            archiveItem.dataset.originalHeight = originalHeight;

            archiveItem.addEventListener('mouseenter', () => {
                const eventsContentEl = archiveItem.querySelector('.sidebar-events-content');
                if (!eventsContentEl.hasChildNodes() || eventsContentEl.querySelector('.sidebar-events-empty')) {
                    fetchArchiveEvents();
                }
                // Expand height after a small delay to allow content to render
                setTimeout(() => {
                    archiveItem.style.height = 'auto';
                    syncHeights();
                }, 50);
            });

            archiveItem.addEventListener('mouseleave', () => {
                // Check if upcoming item is also not hovered
                const upcomingHovered = upcomingItem && upcomingItem.matches(':hover');
                if (!upcomingHovered) {
                    // Both should restore to original
                    syncHeights(true);
                } else {
                    // Only restore archive, keep upcoming expanded
                    const original = parseInt(archiveItem.dataset.originalHeight) || archiveItem.offsetHeight;
                    archiveItem.style.height = original + 'px';
                }
            });
        }

        // Upcoming events
        if (upcomingItem && !upcomingItem.dataset.initialized) {
            upcomingItem.dataset.initialized = 'true';
            // Ensure events container exists
            let eventsContent = upcomingItem.querySelector('.sidebar-events-content');
            if (!eventsContent) {
                eventsContent = document.createElement('div');
                eventsContent.className = 'sidebar-events-content';
                upcomingItem.appendChild(eventsContent);
            }

            // Store original height
            const originalHeight = upcomingItem.offsetHeight;
            upcomingItem.dataset.originalHeight = originalHeight;

            upcomingItem.addEventListener('mouseenter', () => {
                const eventsContentEl = upcomingItem.querySelector('.sidebar-events-content');
                if (!eventsContentEl.hasChildNodes() || eventsContentEl.querySelector('.sidebar-events-empty')) {
                    fetchUpcomingEvents();
                }
                // Expand height after a small delay to allow content to render
                setTimeout(() => {
                    upcomingItem.style.height = 'auto';
                    syncHeights();
                }, 50);
            });

            upcomingItem.addEventListener('mouseleave', () => {
                // Check if archive item is also not hovered
                const archiveHovered = archiveItem && archiveItem.matches(':hover');
                if (!archiveHovered) {
                    // Both should restore to original
                    syncHeights(true);
                } else {
                    // Only restore upcoming, keep archive expanded
                    const original = parseInt(upcomingItem.dataset.originalHeight) || upcomingItem.offsetHeight;
                    upcomingItem.style.height = original + 'px';
                }
            });
        }

        // Activities
        if (activitiesItem && !activitiesItem.dataset.initialized) {
            activitiesItem.dataset.initialized = 'true';
            // Ensure events container exists
            let eventsContent = activitiesItem.querySelector('.sidebar-events-content');
            if (!eventsContent) {
                eventsContent = document.createElement('div');
                eventsContent.className = 'sidebar-events-content';
                activitiesItem.appendChild(eventsContent);
            }

            // Store original height
            const originalHeight = activitiesItem.offsetHeight;
            activitiesItem.dataset.originalHeight = originalHeight;

            activitiesItem.addEventListener('mouseenter', () => {
                const eventsContentEl = activitiesItem.querySelector('.sidebar-events-content');
                if (!eventsContentEl.hasChildNodes() || eventsContentEl.querySelector('.sidebar-events-empty')) {
                    fetchActivities();
                }
                // Expand height after a small delay to allow content to render
                setTimeout(() => {
                    activitiesItem.style.height = 'auto';
                    if (window.syncSidebarHeights) {
                        window.syncSidebarHeights();
                    }
                }, 50);
            });

            activitiesItem.addEventListener('mouseleave', () => {
                // Restore original height
                const original = parseInt(activitiesItem.dataset.originalHeight) || activitiesItem.offsetHeight;
                activitiesItem.style.height = original + 'px';
            });
        }

        // Store sync function globally so fetch functions can call it
        window.syncSidebarHeights = syncHeights;
    }

    // Fetch Archive Events
    async function fetchArchiveEvents() {
        const archiveItem = document.querySelector('.sidebar-item[data-event-type="archive"]');
        const eventsContent = archiveItem?.querySelector('.sidebar-events-content');
        if (!eventsContent) return;

        try {
            const res = await fetch('http://localhost:5000/api/events/archive');
            const events = await res.json();

            eventsContent.innerHTML = '';
            if (events.length === 0) {
                const emptyMsg = translations.dropdown?.no_archive_events || 'არქივში ღონისძიებები არ არის';
                eventsContent.innerHTML = `<div class="sidebar-events-empty">${emptyMsg}</div>`;
                return;
            }

            const eventsList = document.createElement('div');
            eventsList.className = 'sidebar-events-list';

            events.forEach(event => {
                const item = document.createElement('a');
                item.href = `event-detail.html?id=${event.id}&type=event`;
                item.className = 'sidebar-event-item';
                const title = currentLanguage === 'geo' ? event.title_geo : event.title_eng;

                item.innerHTML = `
                    <div class="sidebar-event-item-title">${title}</div>
                `;
                // Ensure clicks work properly
                item.addEventListener('click', function (e) {
                    e.stopPropagation(); // Prevent bubbling to parent
                    // Allow default navigation
                });
                eventsList.appendChild(item);
            });

            eventsContent.appendChild(eventsList);
        } catch (err) {
            console.error('Failed to fetch archive events:', err);
            const errorMsg = translations.dropdown?.error_loading || 'შეცდომა მონაცემების ჩატვირთვისას';
            eventsContent.innerHTML = `<div class="sidebar-events-empty">${errorMsg}</div>`;
        }
    }

    // Fetch Upcoming Events
    async function fetchUpcomingEvents() {
        const upcomingItem = document.querySelector('.sidebar-item[data-event-type="upcoming"]');
        const eventsContent = upcomingItem?.querySelector('.sidebar-events-content');
        if (!eventsContent) return;

        try {
            const res = await fetch('http://localhost:5000/api/events/upcoming');
            const events = await res.json();

            eventsContent.innerHTML = '';
            if (events.length === 0) {
                const emptyMsg = translations.dropdown?.no_upcoming_events || 'მომავალი ღონისძიებები არ არის';
                eventsContent.innerHTML = `<div class="sidebar-events-empty">${emptyMsg}</div>`;
                return;
            }

            const eventsList = document.createElement('div');
            eventsList.className = 'sidebar-events-list';

            events.forEach(event => {
                const item = document.createElement('a');
                item.href = `event-detail.html?id=${event.id}&type=upcoming`;
                item.className = 'sidebar-event-item';
                const title = currentLanguage === 'geo' ? event.title_geo : event.title_eng;

                item.innerHTML = `
                    <div class="sidebar-event-item-title">${title}</div>
                `;
                // Ensure clicks work properly
                item.addEventListener('click', function (e) {
                    e.stopPropagation(); // Prevent bubbling to parent
                    // Allow default navigation
                });
                eventsList.appendChild(item);
            });

            eventsContent.appendChild(eventsList);

            // Sync heights after content is loaded
            if (window.syncSidebarHeights) {
                setTimeout(() => {
                    window.syncSidebarHeights();
                }, 100);
            }
        } catch (err) {
            console.error('Failed to fetch upcoming events:', err);
            const errorMsg = translations.dropdown?.error_loading || 'შეცდომა მონაცემების ჩატვირთვისას';
            eventsContent.innerHTML = `<div class="sidebar-events-empty">${errorMsg}</div>`;
        }
    }

    // Fetch Activities
    async function fetchActivities() {
        const activitiesItem = document.querySelector('.sidebar-item[data-event-type="activities"]');
        const eventsContent = activitiesItem?.querySelector('.sidebar-events-content');
        if (!eventsContent) return;

        try {
            const res = await fetch('http://localhost:5000/api/activities');
            const activities = await res.json();

            eventsContent.innerHTML = '';
            if (activities.length === 0) {
                const emptyMsg = translations.dropdown?.no_activities || 'აქტივობები არ არის';
                eventsContent.innerHTML = `<div class="sidebar-events-empty">${emptyMsg}</div>`;
                return;
            }

            const eventsList = document.createElement('div');
            eventsList.className = 'sidebar-events-list';

            activities.forEach(activity => {
                const item = document.createElement('a');
                item.href = `event-detail.html?id=${activity.id}&type=activity`;
                item.className = 'sidebar-event-item';
                const title = currentLanguage === 'geo' ? activity.title_geo : activity.title_eng;

                item.innerHTML = `
                    <div class="sidebar-event-item-title">${title}</div>
                `;
                // Ensure clicks work properly
                item.addEventListener('click', function (e) {
                    e.stopPropagation(); // Prevent bubbling to parent
                    // Allow default navigation
                });
                eventsList.appendChild(item);
            });

            eventsContent.appendChild(eventsList);

            // Sync heights after content is loaded
            if (window.syncSidebarHeights) {
                setTimeout(() => {
                    window.syncSidebarHeights();
                }, 100);
            }
        } catch (err) {
            console.error('Failed to fetch activities:', err);
            const errorMsg = translations.dropdown?.error_loading || 'შეცდომა მონაცემების ჩატვირთვისას';
            eventsContent.innerHTML = `<div class="sidebar-events-empty">${errorMsg}</div>`;
        }
    }

    // Fetch Employees (Organizational Structure)
    async function fetchEmployees() {
        const grid = document.getElementById('employees-grid');
        if (!grid) return;

        try {
            const res = await fetch('http://localhost:5000/api/employees');
            const employees = await res.json();

            grid.innerHTML = '';
            if (employees.length === 0) {
                grid.innerHTML = '<p>No employees found.</p>';
                return;
            }

            employees.forEach(emp => {
                const card = document.createElement('div');
                card.className = 'employee-card';
                card.style.cssText = 'background: var(--card-bg); border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: transform 0.3s ease;';
                card.onmouseover = function () { this.style.transform = 'translateY(-5px)'; };
                card.onmouseout = function () { this.style.transform = 'translateY(0)'; };

                const name = currentLanguage === 'geo' ? emp.name_geo : emp.name_eng;
                const details = currentLanguage === 'geo' ? emp.details_geo : emp.details_eng;
                const imageUrl = emp.image_url || 'images/logo.png';

                card.innerHTML = `
                    <div style="height: 200px; overflow: hidden;">
                        <img src="${imageUrl}" alt="${name}" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                    <div style="padding: 15px;">
                        <h3 style="font-size: 18px; margin-bottom: 10px; color: var(--accent-yellow);">${name}</h3>
                        <p style="font-size: 14px; color: var(--text-primary); line-height: 1.4;">${details || ''}</p>
                    </div>
                `;
                grid.appendChild(card);
            });
        } catch (err) {
            console.error('Failed to fetch employees:', err);
        }
    }

    // Fetch Second Upcoming Event for Top Sidebar
    async function fetchSecondUpcomingEvent() {
        const container = document.getElementById('second-event-container');
        if (!container) return;

        try {
            const res = await fetch('http://localhost:5000/api/events/upcoming');
            const events = await res.json();

            container.innerHTML = '';

            // We need the second event (index 1) - index 0 is in the main hero
            if (events.length < 2) {
                const noEventMsg = currentLanguage === 'geo' ? 'მომავალი ღონისძიება არ არის' : 'No upcoming event';
                container.innerHTML = `<p style="color:var(--text-secondary); text-align:center;">${noEventMsg}</p>`;
                return;
            }

            const nextEvent = events[1]; // Get the second one

            const item = document.createElement('a');
            item.href = 'event-detail.html?id=' + nextEvent.id + '&type=upcoming';
            item.className = 'activity-mini-card';

            const title = currentLanguage === 'geo' ? nextEvent.title_geo : nextEvent.title_eng;
            const imagePath = nextEvent.image_url || 'images/upcoming.png';

            item.innerHTML = `
                <div class="activity-image">
                    <img src="${imagePath}" alt="${title}">
                </div>
                <div class="activity-info">
                    <div class="activity-title">${title}</div>
                </div>
            `;
            container.appendChild(item);

        } catch (err) {
            console.error('Failed to fetch second upcoming event:', err);
        }
    }

    // Fetch Publications
    async function fetchPublications() {
        const container = document.getElementById('publications-container');
        if (!container) return;

        try {
            const res = await fetch('http://localhost:5000/api/publications');
            const publications = await res.json();

            container.innerHTML = '';

            if (publications && publications.length > 0) {
                publications.forEach(publication => {
                    const item = document.createElement('a');
                    item.href = publication.link;
                    item.target = '_blank';
                    item.rel = 'noopener noreferrer';
                    item.className = 'publication-item';

                    const title = currentLanguage === 'geo' ? publication.title_geo : publication.title_eng;

                    item.innerHTML = `
                        <h3 class="publication-title">${title}</h3>
                    `;
                    container.appendChild(item);
                });
            } else {
                const emptyMsg = currentLanguage === 'geo' ? 'პუბლიკაციები არ არის' : 'No publications available';
                container.innerHTML = `<div class="publications-empty">${emptyMsg}</div>`;
            }
        } catch (err) {
            console.error('Failed to fetch publications:', err);
            const errorMsg = currentLanguage === 'geo' ? 'შეცდომა მონაცემების ჩატვირთვისას' : 'Error loading publications';
            container.innerHTML = `<div class="publications-empty">${errorMsg}</div>`;
        }
    }

    // Initial Load
    loadTranslations(currentLanguage);

    // Initialize sidebar dropdowns after DOM is ready
    setTimeout(() => {
        initializeSidebarDropdowns();
        initMap();
        initContactForm();
    }, 100);

    // Initialize Map
    function initMap() {
        const mapElement = document.getElementById('map');
        if (!mapElement) return;

        // Coordinates for Tbilisi
        const lat = 41.7151;
        const lng = 44.8271;

        const map = L.map('map').setView([lat, lng], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        L.marker([lat, lng]).addTo(map)
            .bindPopup('GAACI<br> Tbilisi, Georgia')
            .openPopup();
    }

    // Initialize Contact Form
    function initContactForm() {
        const form = document.getElementById('contact-form-page');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Show success message
            const messageDiv = document.getElementById('form-message');
            messageDiv.style.display = 'block';
            messageDiv.style.color = 'green';
            messageDiv.textContent = 'Message sent successfully! We will get back to you soon.';

            form.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;

            // Hide message after 5 seconds
            setTimeout(() => {
                messageDiv.style.display = 'none';
            }, 5000);
        });
    }
});
