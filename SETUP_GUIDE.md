# 🏗️ Midnight Construction - MySQL Integration Setup Guide

## What Was Added

This fork adds a complete **MySQL database integration** for the construction quotation system with an admin dashboard to manage customer quotes.

### ✨ New Features

1. **MySQL Database Storage**
   - All quotation requests are saved to a MySQL database
   - Customer information, project details, budget, and uploaded plans are stored securely
   - No more manual form handling - everything is automated!

2. **Admin Dashboard**
   - Modern, responsive admin panel to view all quotation requests
   - Filter and search quotations by status, date, or customer name
   - Update quotation status (Pending, Contacted, Quoted, Completed, Cancelled)
   - Add internal notes to each quotation
   - View detailed customer information and uploaded files
   - Real-time statistics dashboard

3. **Enhanced Quotation Form**
   - Multi-step form with progress indicator
   - File upload support (PDF, JPG, PNG) for architectural plans
   - Budget slider with Indian Rupee formatting
   - Email validation and phone number formatting
   - Success/error notifications

---

## 📂 New Files Added

```
database/
  └── setup.sql                    # MySQL database schema

php/
  ├── config.php                   # Database configuration
  ├── submit-quotation.php         # Form submission handler
  ├── admin-api.php                # Admin dashboard API
  └── setup.php                    # Interactive setup wizard

html/
  └── admin-dashboard.html         # Admin interface

css/
  ├── get-quotation.css            # Quotation form styling
  └── admin-dashboard.css          # Admin dashboard styling

js/
  ├── get-quotation.js             # Form logic (updated)
  └── admin-dashboard.js           # Dashboard logic

docs/
  ├── DATABASE_SETUP.md            # Detailed setup instructions
  ├── QUICKSTART.md                # Quick start guide
  ├── TESTING.md                   # Testing checklist
  ├── PROJECT_SUMMARY.md           # Complete project overview
  └── ARCHITECTURE.md              # System architecture

index.php                          # Landing page with navigation
```

---

## 🚀 Quick Setup (5 Minutes)

### Prerequisites
- **XAMPP** or any local server with PHP 7.4+ and MySQL 5.7+
- Web browser

### Step 1: Start Your Servers
```bash
# Start Apache and MySQL from XAMPP Control Panel
# OR use command line:
C:\xampp\mysql\bin\mysqld.exe        # Start MySQL
C:\xampp\php\php.exe -S localhost:8000   # Start PHP server
```

### Step 2: Run Setup Wizard
1. Open your browser and go to: `http://localhost:8000/php/setup.php`
2. Follow the 4-step wizard:
   - **Step 1:** Welcome screen
   - **Step 2:** Test database connection
   - **Step 3:** Create database and tables automatically
   - **Step 4:** Setup complete!

### Step 3: Access the System

**Quotation Form (Customer Side):**
- URL: `http://localhost:8000/html/get-quotation.html`
- Customers fill out multi-step form with project details
- Uploads saved to `php/uploads/` folder

**Admin Dashboard:**
- URL: `http://localhost:8000/html/admin-dashboard.html`
- **Username:** `admin`
- **Password:** `admin123`
- View, manage, and respond to all quotations

---

## 🎯 How It Works

### For Customers:
1. Visit the quotation form
2. Fill out 5 steps:
   - Project type (residential, commercial, interior, etc.)
   - Budget (₹50,000 - ₹2 Crores with slider)
   - Upload plans (optional PDF/images)
   - Start date
   - Contact information
3. Submit → Data saved to MySQL database
4. Receive confirmation message

### For Admins:
1. Login to admin dashboard
2. View all quotation requests in a table
3. See statistics (pending, contacted, quoted, completed)
4. Click any quotation to:
   - View full customer details
   - Download uploaded files
   - Update status
   - Add internal notes
5. Search/filter quotations by status or date

---

## 🗄️ Database Structure

**Database Name:** `midnight_construction`

**Tables:**
1. **quotations** - Stores all customer quotation requests
   - Customer details (name, email, phone, city)
   - Project info (type, budget, has plans, start date)
   - Status tracking (pending, contacted, quoted, completed, cancelled)
   - Uploaded file path
   - Timestamps

2. **admin_users** - Admin authentication
   - Username, password (bcrypt hashed)
   - Full name, email
   - Last login timestamp

3. **activity_log** - Admin action tracking
   - User ID, action performed
   - Timestamps for audit trail

---

## 🔒 Security Features

- ✅ SQL Injection prevention (PDO prepared statements)
- ✅ Password hashing (bcrypt)
- ✅ Session management for admin authentication
- ✅ Input sanitization
- ✅ File upload validation (type, size, extension)
- ✅ HTTPS ready (configure in production)

---

## 📝 Configuration

### Database Settings
Edit `php/config.php` if needed:
```php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'midnight_construction');
```

### File Upload Settings
- **Max file size:** 10MB
- **Allowed types:** PDF, JPG, PNG
- **Upload folder:** `php/uploads/`

### Admin Credentials
- Default: `admin` / `admin123`
- **⚠️ Change in production!**
- To change password: Login to dashboard → Settings (or update database directly)

---

## 🧪 Testing

### Test Quotation Submission:
1. Go to quotation form
2. Fill all required fields:
   - ✅ Project type
   - ✅ Budget (use slider)
   - ✅ Full name (min 3 chars)
   - ✅ Valid email
   - ✅ Phone number (10+ digits)
   - ✅ City
3. Optionally upload plans
4. Submit → Should see success message

### Test Admin Dashboard:
1. Login with `admin` / `admin123`
2. See submitted quotation in table
3. Click quotation → View details
4. Update status → Save
5. Add note → Save
6. Check database for changes

---

## 🐛 Troubleshooting

### "Database connection failed"
- ✅ MySQL server running?
- ✅ Check credentials in `php/config.php`
- ✅ Database `midnight_construction` created?

### "Invalid credentials" (Admin login)
- ✅ Username: `admin` (lowercase)
- ✅ Password: `admin123` (case-sensitive)
- ✅ Clear browser cache/cookies

### Form submission errors
- ✅ Fill ALL required fields
- ✅ Valid email format
- ✅ Phone number 10+ digits
- ✅ File under 10MB (if uploading)

### File upload fails
- ✅ Check `php/uploads/` folder exists
- ✅ Folder has write permissions
- ✅ File type is PDF, JPG, or PNG

---

## 🔄 Creating a Pull Request (For Forked Repo)

### Step 1: Commit Your Changes
```bash
cd d:\projectsFX\midnight\midnight-construction

# Check what changed
git status

# Add all new files
git add .

# Commit with descriptive message
git commit -m "Add MySQL database integration with admin dashboard

- Implemented MySQL backend for quotation storage
- Created admin dashboard with authentication
- Added multi-step quotation form with file upload
- Included setup wizard for easy installation
- Added comprehensive documentation"
```

### Step 2: Push to Your Fork
```bash
# Push to your GitHub fork
git push origin main
# (or 'master' depending on your branch name)
```

### Step 3: Create Pull Request on GitHub
1. Go to your forked repository on GitHub
2. You'll see a banner: **"This branch is X commits ahead of original:main"**
3. Click **"Contribute"** → **"Open pull request"**
4. Fill in the PR details:

**Title:**
```
Add MySQL Database Integration with Admin Dashboard
```

**Description:**
```markdown
## Summary
Adds complete MySQL backend integration for the construction quotation system with a modern admin dashboard.

## Features Added
- ✅ MySQL database storage for quotation requests
- ✅ Admin dashboard with authentication
- ✅ Multi-step quotation form with validation
- ✅ File upload support (plans/documents)
- ✅ Interactive setup wizard
- ✅ Comprehensive documentation

## New Components
- PHP backend (config, API, form handler)
- Admin dashboard (HTML/CSS/JS)
- Database schema with 3 tables
- Setup wizard for easy installation
- 5 documentation files

## Testing
- ✅ Tested on Windows with XAMPP
- ✅ PHP 8.2.12, MySQL 5.7+
- ✅ All features working correctly

## Screenshots
[Add screenshots of quotation form and admin dashboard]

## Documentation
Complete setup guide included in SETUP_GUIDE.md
```

5. Click **"Create pull request"**
6. Wait for original repo owner to review

### PR Best Practices
- ✅ Clear, descriptive title
- ✅ Explain what and why
- ✅ List all major changes
- ✅ Include screenshots/demos
- ✅ Mention any breaking changes
- ✅ Reference related issues (if any)

---

## 📚 Additional Documentation

- **DATABASE_SETUP.md** - Detailed database setup instructions
- **QUICKSTART.md** - Fast 3-minute setup guide
- **TESTING.md** - Complete testing checklist
- **ARCHITECTURE.md** - System architecture and design
- **PROJECT_SUMMARY.md** - Comprehensive project overview

---

## 🎨 Technology Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Backend:** PHP 7.4+ (PDO for database)
- **Database:** MySQL 5.7+
- **Server:** PHP built-in development server / Apache
- **Security:** bcrypt, PDO prepared statements, input sanitization

---

## 📧 Support

For issues or questions:
1. Check documentation in `docs/` folder
2. Review troubleshooting section above
3. Check PHP error log: `php/logs/error.log`
4. Verify database connection with setup wizard

---

## 🙏 Credits

**Original Project:** Midnight Construction Website
**MySQL Integration:** Added in this fork
**Author:** [Your Name]
**Date:** January 2026

---

## 📄 License

Same as original repository.

---

**Happy Building! 🏗️**
