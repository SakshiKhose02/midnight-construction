# Get Quotation Feature - Setup & Integration Guide

## Overview
A complete quotation request system for your construction/interior design website with Google Forms integration.

## Features Implemented
✅ Multi-step form (5 sections)  
✅ Dynamic budget slider with INR formatting  
✅ Conditional file upload (PDF, JPG, PNG, max 10MB)  
✅ Real-time form validation  
✅ Progress indicator  
✅ Success/Error modals  
✅ Smooth animations & transitions  
✅ Mobile responsive design  
✅ Vanilla JS (no frameworks)  
✅ Google Forms submission  

---

## File Structure

```
html/
├── get-quotation.html          # Quotation form page
└── (other pages updated with nav links)

css/
├── get-quotation.css           # Quotation styles
└── p1_style.css                # Existing styles (reused)

js/
├── get-quotation.js            # Form logic & Google Forms submission
├── main.js                      # Existing scripts
└── (animation library)
```

---

## Setup Instructions

### 1. Google Forms Setup (IMPORTANT)

#### Step 1: Create a Google Form
1. Go to [Google Forms](https://docs.google.com/forms)
2. Create a new form
3. Add these fields in order:
   - **Project Type** (Multiple choice/Dropdown)
     - Options: Independent House, Villa, Apartment, Interior Renovation, Commercial Space
   - **Estimated Budget (INR)** (Short answer)
   - **Architectural Plans** (Multiple choice)
     - Options: Yes I have plans, No I need help
   - **Project Start Date** (Date)
   - **Full Name** (Short answer)
   - **Email** (Email)
   - **Phone** (Short answer)
   - **City** (Short answer)
   - **Free Consultation** (Checkbox)
     - Option: Yes I want a free consultation call

#### Step 2: Get Your Form ID
1. Copy your form's URL: `https://docs.google.com/forms/d/YOUR_FORM_ID/edit`
2. Extract the `YOUR_FORM_ID` part
3. Your form response endpoint will be: `https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse`

#### Step 3: Find Entry IDs (Using Developer Tools)

**Method 1: Browser DevTools (Easiest)**
1. Open your Google Form in a browser
2. Open DevTools (Press F12)
3. Go to Inspector/Elements tab
4. Use Ctrl+F (or Cmd+F) to search for `entry.`
5. You'll see inputs like: `<input name="entry.1234567890">`
6. Note down all entry IDs for each field

**Method 2: Form Preview Source**
1. Click "Preview" button on your form
2. Right-click → "View Page Source"
3. Search for `entry.` to find all entry IDs
4. Match them with field names

#### Step 4: Update JavaScript Configuration

Open `js/get-quotation.js` and update the configuration:

```javascript
// Line 15-26: Replace with your actual Form ID
const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/YOUR_FORM_ID_HERE/formResponse';

// Lines 28-38: Replace with your actual entry IDs from Step 3
const FORM_ENTRIES = {
  projectType: 'entry.YOUR_ENTRY_ID_1',      
  budget: 'entry.YOUR_ENTRY_ID_2',           
  hasPlans: 'entry.YOUR_ENTRY_ID_3',         
  planFile: 'entry.YOUR_ENTRY_ID_4',         
  startDate: 'entry.YOUR_ENTRY_ID_5',        
  fullName: 'entry.YOUR_ENTRY_ID_6',         
  email: 'entry.YOUR_ENTRY_ID_7',            
  phone: 'entry.YOUR_ENTRY_ID_8',            
  city: 'entry.YOUR_ENTRY_ID_9',             
  consultation: 'entry.YOUR_ENTRY_ID_10'     
};
```

**Example After Update:**
```javascript
const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSdzxxxxxxxxxxxxxxxxxxxxxxxx/formResponse';

const FORM_ENTRIES = {
  projectType: 'entry.1234567890',      
  budget: 'entry.0987654321',           
  hasPlans: 'entry.1111111111',         
  planFile: 'entry.2222222222',         
  startDate: 'entry.3333333333',        
  fullName: 'entry.4444444444',         
  email: 'entry.5555555555',            
  phone: 'entry.6666666666',            
  city: 'entry.7777777777',             
  consultation: 'entry.8888888888'     
};
```

#### Step 5: Test Submission
1. Fill out the form on `/html/get-quotation.html`
2. Click "Get My Quotation"
3. Check your Google Form → "Responses" tab
4. Your data should appear within seconds

---

## Form Fields Explained

### 1. Project Type (Step 1)
- **Type**: Dropdown select
- **Required**: Yes
- **Options**: Independent House, Villa, Apartment, Interior Renovation, Commercial Space
- **Validation**: Must select one option

### 2. Estimated Budget (Step 2)
- **Type**: Range slider
- **Range**: ₹50,00,000 to ₹2,00,00,000
- **Step**: ₹50,000
- **Display**: Live INR formatting with commas and currency symbol
- **Validation**: Always has a value (no validation needed)

### 3. Architectural Plans (Step 3)
- **Type**: Radio buttons (Yes/No)
- **If Yes**: Shows file upload input
  - Accepts: PDF, JPG, PNG
  - Max size: 10MB
  - File validation: Type and size checks
- **If No**: File upload hidden
- **Validation**: Required to select one option

### 4. Project Start Date (Step 4)
- **Type**: Date picker
- **Range**: Today onwards (minimum date = today)
- **Validation**: Must be today or future date

### 5. Contact Details (Step 5)
- **Full Name**: Required, min 3 characters
- **Email**: Required, must be valid email format
- **Phone**: Required, min 10 digits
- **City**: Required, any text
- **Free Consultation**: Optional checkbox

---

## JavaScript Features

### State Management
```javascript
formState = {
  currentStep: 1,           // Current form section
  totalSteps: 5,            // Total sections
  data: { ... },            // Form data object
  isSubmitting: false       // Submission status
}
```

### Key Functions

**Form Navigation**
```javascript
handleNext()     // Move to next step with validation
handlePrev()     // Go back to previous step
goToStep(n)      // Jump to specific step
updateProgress() // Update progress bar and indicators
```

**Validation**
```javascript
validateField()       // Validate single input field
validateCurrentStep() // Validate all fields in current step
validateAllFields()   // Validate entire form
```

**Budget Formatting**
```javascript
formatINR(number)     // Formats: 5000000 → ₹50,00,000
```

**File Upload**
```javascript
validateFile()        // Check size, type, extension
handleFileSelect()    // Handle file selection
setupFileDragDrop()   // Enable drag-and-drop
```

**Submission**
```javascript
handleSubmit()        // Main form submission handler
submitToGoogleForms() // Send data to Google Forms
showSuccessModal()    // Show success message
showErrorModal()      // Show error message
resetForm()           // Clear form and reset to step 1
```

---

## CSS Classes & Styling

### Key Classes
- `.quotation-form` - Main form container
- `.form-section` - Individual form section/step
- `.form-control` - Input styling
- `.budget-slider` - Range input styling
- `.radio-label`, `.checkbox-label` - Custom radio/checkbox styles
- `.file-upload-label` - File upload area styling
- `.success-modal`, `.error-modal` - Result modals
- `.progress-indicator` - Progress tracking UI

### Customization

**Change Primary Color:**
Open `css/p1_style.css` and modify:
```css
:root {
  --primary: #8bb58f;        /* Green */
  --accent: #ff6b35;         /* Orange */
  --secondary: #1a1a2e;      /* Dark Blue */
}
```

**Adjust Form Width:**
In `css/get-quotation.css`, modify:
```css
.quotation-container {
  max-width: 700px;  /* Change this value */
}
```

---

## Browser Compatibility

✅ Chrome 60+  
✅ Firefox 55+  
✅ Safari 12+  
✅ Edge 79+  
✅ Mobile browsers (iOS Safari, Chrome Mobile)

---

## Mobile Responsiveness

The form is fully responsive:
- **Desktop** (1024px+): Full-width layout with side-by-side buttons
- **Tablet** (768-1024px): Adjusted spacing and font sizes
- **Mobile** (< 768px): Single-column layout, stacked buttons, simplified progress indicator

---

## Important Notes

### Google Forms Limitations
1. **File Upload**: Google Forms doesn't accept file uploads via API. The form sends file metadata (name, size) instead. For actual file uploads, you'll need a backend service or use a different provider (Formspree, Basin, etc.).

2. **CORS**: Google Forms uses `no-cors` mode, so the submission appears to always succeed. Ensure your Google Form is publicly accepting responses.

3. **Data Privacy**: All submissions are stored in your Google Drive associated with the form.

### File Upload Alternatives (If Needed)
If you need actual file uploads, consider:
- **Formspree.io** - Free tier with file support
- **Basin** - Simple form backend
- **Firebase** - Cloud storage + Firestore
- **Your own backend** - PHP/Node.js endpoint

### Email Notifications
To get email notifications:
1. Open your Google Form
2. Click "Responses" tab
3. Click three dots → "Get email notifications"

---

## Testing Checklist

- [ ] Form loads without errors
- [ ] Budget slider updates display in real-time
- [ ] Selecting "Yes" for plans shows file upload
- [ ] Selecting "No" for plans hides file upload
- [ ] File upload rejects files > 10MB
- [ ] File upload rejects non-PDF/JPG/PNG files
- [ ] Date picker shows only future dates
- [ ] Form validation shows errors for empty required fields
- [ ] Form validation shows email format error
- [ ] Form validation shows phone number error
- [ ] Progress indicator updates as you navigate steps
- [ ] Back button preserves entered data
- [ ] Submit button only enables when all fields valid
- [ ] Success modal appears after submission
- [ ] Data appears in Google Form responses
- [ ] Form resets after successful submission
- [ ] Mobile layout displays correctly
- [ ] All animations are smooth

---

## Troubleshooting

### Form data not appearing in Google Forms responses?
1. Verify the form's `action` is set to accept responses
2. Check that entry IDs in JavaScript match your form
3. Ensure form is published (not in edit mode)
4. Check browser console for errors (F12 → Console)

### File upload showing wrong validation errors?
1. Verify file size limit (10MB default)
2. Check allowed file types (PDF, JPG, PNG)
3. Ensure files don't exceed limit

### Progress bar not updating?
1. Check that step numbers match in HTML attributes
2. Verify JavaScript event listeners are attached
3. Clear browser cache and reload

### Form not responding to clicks?
1. Check for JavaScript errors in console (F12)
2. Verify main.js and get-quotation.js are loaded
3. Ensure no other scripts are conflicting

---

## Future Enhancements

- [ ] Add backend service for actual file uploads
- [ ] Email confirmation to users
- [ ] SMS notifications
- [ ] Admin dashboard for quotation management
- [ ] Automated quotation PDF generation
- [ ] Payment gateway integration
- [ ] Multi-language support
- [ ] WhatsApp integration for notifications
- [ ] Analytics tracking

---

## Support & Customization

For customizations:
1. **Form fields**: Edit HTML in `get-quotation.html`
2. **Validation rules**: Modify `validateField()` in `get-quotation.js`
3. **Styling**: Update `css/get-quotation.css`
4. **Data submission**: Modify `submitToGoogleForms()` in `get-quotation.js`

---

## Files Modified
- `html/get-quotation.html` - NEW
- `html/d1.html` - Added quotation link to nav
- `html/p1.html` - Added quotation link to nav
- `html/d1 - Copy.html` - Added quotation link to nav
- `css/get-quotation.css` - NEW
- `js/get-quotation.js` - NEW

---

**Last Updated**: January 2026  
**Version**: 1.0  
**Status**: Production Ready
