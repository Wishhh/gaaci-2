// Countdown Timer Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Target date: May 7, 2026 (Congress 2026)
    const targetDate = new Date('2026-05-07T00:00:00').getTime();
    
    // Get countdown elements
    const countdownNumbers = document.querySelectorAll('.countdown-number');
    
    function updateCountdown() {
        const now = new Date().getTime();
        const timeLeft = targetDate - now;
        
        if (timeLeft > 0) {
            const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
            const milliseconds = Math.floor((timeLeft % 1000) / 10); // For the 5th display
            
            // Update countdown display
            if (countdownNumbers.length >= 4) {
                countdownNumbers[0].textContent = days.toString().padStart(2, '0');
                countdownNumbers[1].textContent = hours.toString().padStart(2, '0');
                countdownNumbers[2].textContent = minutes.toString().padStart(2, '0');
                countdownNumbers[3].textContent = seconds.toString().padStart(2, '0');
                
                // 5th display shows milliseconds/10 for extra precision
                if (countdownNumbers.length >= 5) {
                    countdownNumbers[4].textContent = milliseconds.toString().padStart(2, '0');
                }
            }
        } else {
            // Event has passed
            if (countdownNumbers.length >= 4) {
                countdownNumbers[0].textContent = '00';
                countdownNumbers[1].textContent = '00';
                countdownNumbers[2].textContent = '00';
                countdownNumbers[3].textContent = '00';
                if (countdownNumbers.length >= 5) {
                    countdownNumbers[4].textContent = '00';
                }
            }
        }
    }
    
    // Update countdown immediately and then every 100ms for smooth animation
    updateCountdown();
    setInterval(updateCountdown, 100);
    
    // Smooth scroll for navigation links
    const navLinks = document.querySelectorAll('.header-nav a, .sidebar-item');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Add smooth transition effect
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
    
    // Add hover effects for event blocks
    const eventBlocks = document.querySelectorAll('.event-block, .event-item');
    eventBlocks.forEach(block => {
        block.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        block.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Sidebar items now only have hover effects, no click functionality

    // Brand highlighting now done directly in HTML
    
    // Ensure all images are visible
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.style.opacity = '1';
        img.style.transition = 'transform 0.3s ease';
    });
    
    // Add parallax effect to background
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const container = document.querySelector('.container');
        if (container) {
            container.style.transform = `translateY(${scrolled * 0.1}px)`;
        }
    });
    
    // Add typing effect for organization title
    const title = document.querySelector('.organization-title');
    if (title) {
        const originalText = title.textContent;
        title.textContent = '';
        title.style.borderRight = '2px solid #FFFF00';
        
        let i = 0;
        const typeWriter = () => {
            if (i < originalText.length) {
                title.textContent += originalText.charAt(i);
                i++;
                setTimeout(typeWriter, 20);
            } else {
                title.style.borderRight = 'none';
            }
        };
        
        setTimeout(typeWriter, 500);
    }
    
    // Add countdown number animation
    const animateCountdownNumber = (element, newValue) => {
        element.style.transform = 'scale(1.1)';
        element.style.color = '#FFFF00';
        
        setTimeout(() => {
            element.style.transform = 'scale(1)';
            element.style.color = '#FFFFFF';
        }, 200);
    };
    
    // Enhanced countdown with animations
    let previousValues = [0, 0, 0, 0, 0];
    setInterval(() => {
        const now = new Date().getTime();
        const timeLeft = targetDate - now;
        
        if (timeLeft > 0) {
            const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
            const milliseconds = Math.floor((timeLeft % 1000) / 10);
            
            const currentValues = [days, hours, minutes, seconds, milliseconds];
            
            currentValues.forEach((value, index) => {
                if (countdownNumbers[index] && value !== previousValues[index]) {
                    animateCountdownNumber(countdownNumbers[index], value);
                }
            });
            
            previousValues = currentValues;
        }
    }, 100);

    // Language Toggle Functionality
    let currentLanguage = 'geo'; // Default to Georgian
    
    const languageToggle = document.getElementById('language-toggle');
    const elementsWithTranslation = document.querySelectorAll('[data-geo][data-eng]');
    
    function switchLanguage() {
        currentLanguage = currentLanguage === 'geo' ? 'eng' : 'geo';
        
        elementsWithTranslation.forEach(element => {
            const geoText = element.getAttribute('data-geo');
            const engText = element.getAttribute('data-eng');
            
            if (currentLanguage === 'eng') {
                element.textContent = engText;
            } else {
                element.textContent = geoText;
            }
        });
        
        // Update toggle button text
        languageToggle.textContent = currentLanguage === 'geo' ? 'ENG' : 'GEO';
        
        // Update page title
        if (currentLanguage === 'eng') {
            document.title = 'Georgian Association of Allergology and Clinical Immunology (GAACI)';
        } else {
            document.title = 'საქართველოს ალერგოლოგიისა და კლინიკური იმუნოლოგიის ასოციაცია (GAACI)';
        }
    }
    
    // Add click event to language toggle
    languageToggle.addEventListener('click', switchLanguage);

    // Theme Toggle Functionality
    let currentTheme = 'default'; // Default theme
    const themes = ['default', 'blue', 'green', 'red', 'purple'];
    let themeIndex = 0;
    
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    function switchTheme() {
        themeIndex = (themeIndex + 1) % themes.length;
        currentTheme = themes[themeIndex];
        
        // Remove all theme classes
        themes.forEach(theme => {
            body.classList.remove(`theme-${theme}`);
        });
        
        // Add current theme class
        if (currentTheme !== 'default') {
            body.setAttribute('data-theme', currentTheme);
        } else {
            body.removeAttribute('data-theme');
        }
        
        // Update theme button with theme emoji
        const themeEmojis = {
            'default': '🎨',
            'blue': '🔵',
            'green': '🟢',
            'red': '🔴',
            'purple': '🟣'
        };
        
        themeToggle.textContent = themeEmojis[currentTheme];
        
        // Store theme preference
        localStorage.setItem('gaaci-theme', currentTheme);
    }
    
    // Load saved theme on page load
    const savedTheme = localStorage.getItem('gaaci-theme');
    if (savedTheme && themes.includes(savedTheme)) {
        currentTheme = savedTheme;
        themeIndex = themes.indexOf(savedTheme);
        
        if (currentTheme !== 'default') {
            body.setAttribute('data-theme', currentTheme);
        }
        
        const themeEmojis = {
            'default': '🎨',
            'blue': '🔵',
            'green': '🟢',
            'red': '🔴',
            'purple': '🟣'
        };
        themeToggle.textContent = themeEmojis[currentTheme];
    }
    
    // Add click event to theme toggle
    themeToggle.addEventListener('click', switchTheme);
});
