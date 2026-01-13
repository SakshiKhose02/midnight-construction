# Midnight Construction & Interiors - Modern Website

A modern, responsive website for Midnight Construction & Interiors with an integrated quotation request system. Built with vanilla HTML, CSS, and JavaScript (no frameworks).

## 🎨 Features

### Modern UI Design
- ✨ 3D gradient effects and smooth animations
- 🎬 Page loader with animated worker SVG
- 📱 Fully responsive design (mobile, tablet, desktop)
- 🎯 Smooth scroll animations and lazy loading
- 🎨 Professional color scheme (Green, Orange, Navy)

### Get Quotation Feature
- 📋 **Multi-step form** (5 sections with progress indicator)
- 💰 **Budget slider** with live INR formatting (₹50L to ₹2Cr)
- 📄 **File upload** for architectural plans (PDF, JPG, PNG)
- 📅 **Date picker** with future date validation
- ✅ **Real-time validation** for all form fields
- 📞 **Contact collection** (name, email, phone, city)
- 📧 **Google Forms integration** for data submission
- 🎉 **Success/Error modals** with user feedback

### Technical Features
- ⚡ Vanilla JavaScript (ES6+, no jQuery/frameworks)
- 🔒 Client-side form validation
- 📤 Drag-and-drop file upload support
- 🎨 CSS3 animations and transitions
- 📊 Form state management
- 💾 LocalStorage fallback for submissions
- ♿ Semantic HTML for accessibility

## 📁 Project Structure

```
midnight-construction/
├── README.md                          # This file
├── docs/
│   ├── GET_QUOTATION_SETUP.md        # Google Forms setup guide
│   ├── projectinfo.txt               # Project information
│   └── banner.txt                    # Banner text
├── html/
│   ├── d1.html                       # Main landing page
│   ├── p1.html                       # Services page
│   ├── d1 - Copy.html               # Copy of d1.html
│   └── get-quotation.html           # Quotation request form
├── css/
│   ├── p1_style.css                 # Main styles & animations
│   └── get-quotation.css            # Quotation form styles
├── js/
│   ├── main.js                      # Main scripts & interactions
│   └── get-quotation.js             # Quotation form logic
├── images/                           # Project images
│   ├── arch1.jpg, arch2.jpg, etc   # Architecture samples
│   ├── logo*.jpg                    # Logo variants
│   └── (other project images)
├── banner.txt                        # Banner content
└── (root HTML files for backward compatibility)
```

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome 60+, Firefox 55+, Safari 12+, Edge 79+)
- A local web server (for proper CORS handling)
- Optional: Git for version control

### Installation & Running

1. **Clone the repository:**
   ```bash
   git clone https://github.com/SakshiKhose02/midnight-construction.git
   cd midnight-construction
   ```

2. **Start a local web server:**
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Python 2
   python -m SimpleHTTPServer 8000
   
   # Using Node.js (if installed)
   npx http-server -p 8000
   ```

3. **Open in browser:**
   - Main page: `http://localhost:8000/html/d1.html`
   - Get Quotation: `http://localhost:8000/html/get-quotation.html`

## 📋 Pages & Navigation

### 1. Main Landing Page (d1.html)
- Hero section with call-to-action
- About us section
- Services showcase
- Project gallery with lazy loading
- Contact information
- Navigation to other pages

### 2. Services Page (p1.html)
- Detailed service descriptions
- Service benefits
- Service pricing/categories
- Cross-links to other pages

### 3. Get Quotation Form (get-quotation.html)
- **Step 1**: Select project type (dropdown)
- **Step 2**: Set budget using slider
- **Step 3**: Upload architectural plans (conditional)
- **Step 4**: Set project start date
- **Step 5**: Enter contact details & consultation preference
- Progress indicator showing form completion
- Success modal after submission
- Error handling with retry option

## 🔧 Configuration

### Google Forms Integration (Get Quotation)

To enable quotation form submission, you need to:

1. **Create a Google Form** with fields:
   - Project Type
   - Estimated Budget
   - Architectural Plans
   - Project Start Date
   - Full Name
   - Email
   - Phone
   - City
   - Free Consultation

2. **Extract entry IDs** from your Google Form:
   - Right-click form → Inspect
   - Look for `name="entry.XXXXXXXXX"`
   - Copy the entry ID numbers

3. **Update `js/get-quotation.js`:**
   ```javascript
   const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse';
   
   const FORM_ENTRIES = {
     projectType: 'entry.YOUR_ENTRY_ID_1',
     budget: 'entry.YOUR_ENTRY_ID_2',
     hasPlans: 'entry.YOUR_ENTRY_ID_3',
     // ... etc
   };
   ```

4. **Publish your Google Form** to accept responses

See [GET_QUOTATION_SETUP.md](docs/GET_QUOTATION_SETUP.md) for detailed instructions.

## 🎨 Customization

### Colors
Edit CSS variables in `css/p1_style.css`:
```css
:root {
  --primary: #8bb58f;        /* Green */
  --accent: #ff6b35;         /* Orange */
  --secondary: #1a1a2e;      /* Dark Blue */
  --white: #ffffff;
  /* ... other variables ... */
}
```

### Fonts
- Headlines: Playfair Display (serif)
- Body text: Poppins (sans-serif)

### Responsive Breakpoints
- Desktop: 1024px+
- Tablet: 768px - 1024px
- Mobile: < 768px

## 📱 Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| Chrome  | 60+     | ✅ Full Support |
| Firefox | 55+     | ✅ Full Support |
| Safari  | 12+     | ✅ Full Support |
| Edge    | 79+     | ✅ Full Support |
| Mobile Chrome | Latest | ✅ Full Support |
| Mobile Safari | Latest | ✅ Full Support |

## 🔐 Security & Privacy

- ✅ No backend server (client-side only)
- ✅ No sensitive data stored locally
- ✅ Google Forms handles data securely
- ✅ Form validation prevents XSS
- ✅ No authentication required
- ⚠️ File uploads are not actually stored (only sent to Google Forms)

## 📊 Form Validation Rules

### Budget Slider
- Min: ₹50 Lakhs
- Max: ₹2 Crores
- Step: ₹50,000
- Display: Indian number format with commas

### File Upload (Conditional)
- Accepted formats: PDF, JPG, PNG
- Max size: 10MB
- Only required if "Yes, I have plans" is selected

### Contact Fields
- **Name**: Minimum 3 characters
- **Email**: Valid email format (regex validation)
- **Phone**: Minimum 10 digits
- **City**: Any non-empty text
- **Date**: Must be today or future (no past dates)

## 🎯 JavaScript Functions

### Form Management
- `init()` - Initialize form and event listeners
- `setupEventListeners()` - Attach all event handlers
- `goToStep(n)` - Navigate to form step n
- `updateProgress()` - Update progress bar

### Budget Slider
- `handleBudgetChange()` - Handle slider input
- `updateBudgetDisplay()` - Format and display value
- `formatINR()` - Format number as Indian currency

### File Upload
- `handleFileSelect()` - Process file selection
- `validateFile()` - Validate file type and size
- `setupFileDragDrop()` - Enable drag-and-drop

### Validation
- `validateField()` - Validate single field
- `validateCurrentStep()` - Validate all fields in step
- `validateAllFields()` - Full form validation

### Submission
- `handleSubmit()` - Process form submission
- `submitToGoogleForms()` - Send data to Google Forms
- `showSuccessModal()` - Display success message
- `showErrorModal()` - Display error message

## 🚀 Performance Features

- **Lazy Loading**: Images load on scroll
- **CSS Animations**: Hardware-accelerated transforms
- **Optimized Images**: Compressed JPEG/PNG files
- **Minimal Dependencies**: Only FontAwesome CDN
- **No Framework Overhead**: Vanilla JavaScript
- **Event Delegation**: Efficient event handling

## 🔄 Version History

### v1.0.0 (January 13, 2026)
- Initial release
- Modern UI with animations
- Get Quotation form with multi-step validation
- Google Forms integration
- Mobile responsive design
- Full documentation

## 📝 File Statistics

- **HTML Files**: 4 pages
- **CSS Files**: 2 stylesheets (1200+ lines)
- **JS Files**: 2 scripts (600+ lines)
- **Images**: 15+ project images
- **Total Size**: ~500KB (uncompressed)

## 🛠️ Tech Stack

- **HTML5**: Semantic markup
- **CSS3**: Animations, gradients, flexbox, grid
- **JavaScript (ES6+)**: Pure vanilla, no frameworks
- **Intl.NumberFormat**: For locale-aware currency formatting
- **Fetch API**: For Google Forms submission
- **File API**: For drag-drop file handling
- **IntersectionObserver**: For scroll animations
- **FontAwesome 5.15.1**: Icon library (CDN)
- **Bootstrap 4.5.3**: CSS grid utilities only

## 🎯 Use Cases

1. **Lead Generation**: Capture quotation requests from potential clients
2. **Project Showcase**: Display past projects and services
3. **Service Information**: Help clients understand offerings
4. **Professional Presence**: Modern web presence for construction business
5. **Mobile Support**: Reach clients on all devices

## 📧 Contact & Support

For issues or suggestions:
- GitHub: https://github.com/SakshiKhose02/midnight-construction
- Email: sakshi@midnight.com

## 📄 License

This project is private and proprietary to Midnight Construction & Interiors.

## 🙏 Acknowledgments

- FontAwesome for icons
- Google Forms for backend data collection
- Modern CSS techniques and best practices
- Web accessibility standards (WCAG)

---

**Built with ❤️ for Midnight Construction & Interiors**

Last Updated: January 13, 2026
