# GAACI - Georgian Association of Allergology and Clinical Immunology

![GAACI Logo](images/logo.png)

## 🌐 Live Website
**Visit the live website:** [https://wishhh.github.io/gaaci-2/](https://wishhh.github.io/gaaci-2/)

## 📋 About
This is the official website for the Georgian Association of Allergology and Clinical Immunology (GAACI) - საქართველოს ალერგოლოგიისა და კლინიკური იმუნოლოგიის ასოციაცია.

## ✨ Features

### 🌍 Bilingual Support
- **Georgian (ქართული)** - Default language
- **English** - Full translation support
- **Language Toggle** - Switch between languages instantly
- **Dynamic Content** - All text elements are translatable

### 🎨 Theme Changer
- **5 Beautiful Themes:**
  - 🎨 **Default** - Purple/Orange gradient
  - 🔵 **Blue** - Ocean blue with cyan accents
  - 🟢 **Green** - Nature green with bright highlights
  - 🔴 **Red** - Bold and energetic with warm tones
  - 🟣 **Purple** - Deep mystical colors with vibrant accents
- **Smooth Transitions** - All color changes are animated
- **Persistent Storage** - Your theme choice is remembered

### ⏰ Countdown Timer
- **Target Date:** May 7, 2026 (Congress 2026)
- **Georgian Labels:** დღე, საათი, წუთი, წამი
- **English Labels:** Day, Hour, Min, Sec
- **Real-time Updates** - Live countdown with smooth animations

### 📱 Responsive Design
- **Mobile Optimized** - Perfect on all screen sizes
- **Desktop Enhanced** - Full features on larger screens
- **Cross-browser Compatible** - Works on all modern browsers

## 🏗️ Technical Stack

### Frontend Technologies
- **HTML5** - Semantic markup structure
- **CSS3** - Advanced styling with CSS variables
- **JavaScript (ES6+)** - Modern interactive features
- **DejaVu Sans Fonts** - Professional typography

### Key Features
- **CSS Variables** - Dynamic theming system
- **Local Storage** - Theme and language persistence
- **Smooth Animations** - CSS transitions and transforms
- **Accessibility** - Proper semantic HTML and alt text

## 📁 Project Structure
```
gaaci-2/
├── index.html          # Main HTML file
├── style.css           # All CSS styles and themes
├── script.js           # JavaScript functionality
├── images/             # All project images
│   ├── logo.png        # GAACI logo
│   ├── logo_geo.png    # Georgian logo variant
│   ├── congress2026.jpg
│   ├── asthma.jpg
│   ├── confgress4.jpg
│   └── ...             # Other event images
└── README.md           # This file
```

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No server required - runs on any web server

### Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/Wishhh/gaaci-2.git
   ```

2. **Navigate to the project:**
   ```bash
   cd gaaci-2
   ```

3. **Open in browser:**
   - Simply open `index.html` in your web browser
   - Or serve with a local server for best experience

### Local Development Server
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (if you have http-server installed)
npx http-server

# Using PHP
php -S localhost:8000
```

## 🎯 Usage

### Language Switching
- Click the **"ENG"** button in the header to switch to English
- Click **"GEO"** to return to Georgian
- All content updates instantly

### Theme Changing
- Click the **🎨** button to cycle through themes
- Themes: 🎨 → 🔵 → 🟢 → 🔴 → 🟣 → 🎨
- Your choice is automatically saved

### Navigation
- **Header Menu:** About Us, Gallery, Publications, Contact
- **Sidebar:** Full navigation with active states
- **Footer:** Additional links and information

## 📄 Content Sections

### Main Events
- **Congress 2026** - Upcoming congress with countdown
- **Asthma World Day 2024** - Recent event information
- **Congress 2024** - Completed congress details
- **Congress Speakers** - Speaker and lecturer information

### Organization Information
- **About GAACI** - Complete organization description
- **Association Sections** - 8 medical specialties:
  - ალერგია და ასთმა (Allergy and Asthma)
  - ბაზისური იმუნოლოგია (Basic Immunology)
  - კლინიკური იმუნოლოგია (Clinical Immunology)
  - პედიატრია (Pediatrics)
  - პულმონოლოგიური დაავადებების იმუნოლოგია (Pulmonological Disease Immunology)
  - დერმატო-ვენეროლოგია (Dermato-venereology)
  - ინფექციური დაავადებების იმუნოლოგია (Infectious Disease Immunology)
  - ვაქცინაცია (Vaccination)

### Contact Information
- **Phone:** +995 551 11 19 89
- **Email:** gaaci2014@gmail.com
- **Address:** რუსთაველის გამზ. №104, 4600, ქუთაისი, საქართველო

## 🎨 Customization

### Adding New Themes
1. Add new CSS variables in `style.css`:
```css
[data-theme="your-theme"] {
    --bg-primary: #your-color;
    --accent-yellow: #your-accent;
    /* ... other variables */
}
```

2. Update the themes array in `script.js`:
```javascript
const themes = ['default', 'blue', 'green', 'red', 'purple', 'your-theme'];
```

### Adding New Languages
1. Add `data-[lang]` attributes to HTML elements
2. Update the language switching function in `script.js`
3. Add translation logic for new language

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

**Georgian Association of Allergology and Clinical Immunology (GAACI)**
- Website: [https://wishhh.github.io/gaaci-2/](https://wishhh.github.io/gaaci-2/)
- Email: gaaci2014@gmail.com
- Phone: +995 551 11 19 89
- Address: რუსთაველის გამზ. №104, 4600, ქუთაისი, საქართველო

## 🙏 Acknowledgments

- **Shota Rustaveli National Science Foundation of Georgia** - Support for Congress 2024
- **DejaVu Sans Font Family** - Professional typography
- **GitHub Pages** - Hosting platform
- **All contributors** - Thank you for your support

---

**© 2025 Georgian Association of Allergology and Clinical Immunology (GAACI)**
