# Contributing to GAACI Website

Thank you for your interest in contributing to the Georgian Association of Allergology and Clinical Immunology (GAACI) website!

## 🤝 How to Contribute

### 1. Fork the Repository
- Click the "Fork" button on the GitHub repository page
- Clone your fork locally:
```bash
git clone https://github.com/YOUR_USERNAME/gaaci-2.git
cd gaaci-2
```

### 2. Create a Branch
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 3. Make Your Changes
- Follow the existing code style
- Test your changes thoroughly
- Ensure responsive design works on all devices
- Test both Georgian and English language modes
- Test all 5 theme variations

### 4. Commit Your Changes
```bash
git add .
git commit -m "Add: Brief description of your changes"
```

### 5. Push and Create Pull Request
```bash
git push origin feature/your-feature-name
```
Then create a Pull Request on GitHub.

## 📋 Development Guidelines

### Code Style
- Use consistent indentation (2 spaces)
- Follow existing naming conventions
- Comment complex JavaScript functions
- Use semantic HTML elements

### Testing Checklist
- [ ] Language toggle works correctly
- [ ] Theme changer cycles through all 5 themes
- [ ] Countdown timer displays correctly
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] All images load properly
- [ ] Navigation links work
- [ ] No console errors

### File Structure
```
gaaci-2/
├── index.html          # Main HTML file
├── style.css           # All CSS styles and themes
├── script.js           # JavaScript functionality
├── images/             # All project images
├── README.md           # Project documentation
├── CONTRIBUTING.md     # This file
├── LICENSE             # MIT License
├── package.json        # Project configuration
└── .gitignore          # Git ignore rules
```

## 🎨 Adding New Features

### New Theme
1. Add CSS variables in `style.css`:
```css
[data-theme="your-theme"] {
    --bg-primary: #your-color;
    --accent-yellow: #your-accent;
    /* ... other variables */
}
```

2. Update themes array in `script.js`:
```javascript
const themes = ['default', 'blue', 'green', 'red', 'purple', 'your-theme'];
```

3. Add theme emoji in `script.js`:
```javascript
const themeEmojis = {
    'default': '🎨',
    'blue': '🔵',
    'green': '🟢',
    'red': '🔴',
    'purple': '🟣',
    'your-theme': '🆕'
};
```

### New Language
1. Add `data-[lang]` attributes to HTML elements
2. Update language switching function in `script.js`
3. Add translation logic for new language

### New Content Section
1. Add HTML structure in `index.html`
2. Style with CSS in `style.css`
3. Add any interactive functionality in `script.js`
4. Ensure responsive design
5. Test with all themes and languages

## 🐛 Reporting Issues

When reporting issues, please include:
- **Browser and version**
- **Operating system**
- **Steps to reproduce**
- **Expected vs actual behavior**
- **Screenshots if applicable**

## 📝 Pull Request Guidelines

### Before Submitting
- [ ] Code follows existing style
- [ ] All tests pass
- [ ] Documentation updated if needed
- [ ] No merge conflicts
- [ ] Descriptive commit messages

### PR Description Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested on multiple browsers
- [ ] Tested responsive design
- [ ] Tested language toggle
- [ ] Tested theme changer

## Screenshots
(if applicable)
```

## 🚀 Development Setup

### Local Development
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npm install
npm run serve

# Using live-server for auto-reload
npm run dev
```

### Browser Testing
Test on:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## 📞 Contact

For questions about contributing:
- **Email:** gaaci2014@gmail.com
- **Website:** [https://wishhh.github.io/gaaci-2/](https://wishhh.github.io/gaaci-2/)

## 🙏 Thank You

Thank you for contributing to the GAACI website! Your contributions help improve the experience for medical professionals and the community.

---

**© 2025 Georgian Association of Allergology and Clinical Immunology (GAACI)**
