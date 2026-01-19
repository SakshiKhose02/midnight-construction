# Midnight Construction - MySQL Database Integration

## 📋 Overview

Complete MySQL database integration for the Midnight Construction quotation system with a modern admin dashboard for managing quotation requests.

## 🚀 Features

### Frontend (Customer Side)
- ✅ Multi-step quotation form
- ✅ File upload support (plans/drawings)
- ✅ Real-time form validation
- ✅ Budget slider with INR formatting
- ✅ Mobile responsive design
- ✅ PHP backend submission

### Backend (Admin Dashboard)
- ✅ Secure login system
- ✅ Real-time statistics dashboard
- ✅ Quotation management (view, edit, delete)
- ✅ Status tracking (pending, contacted, quoted, completed, cancelled)
- ✅ Search and filter functionality
- ✅ Notes system for each quotation
- ✅ File download support
- ✅ Pagination for large datasets
- ✅ Modern, responsive UI

## 📁 Project Structure

```
midnight-construction/
├── database/
│   └── setup.sql                 # Database schema and tables
├── php/
│   ├── config.php                # Database configuration
│   ├── submit-quotation.php      # Form submission handler
│   ├── admin-api.php             # Admin dashboard API
│   ├── uploads/                  # Uploaded files directory
│   └── logs/                     # Error logs directory
├── html/
│   ├── get-quotation.html        # Customer quotation form
│   └── admin-dashboard.html      # Admin dashboard
├── css/
│   ├── get-quotation.css         # Quotation form styles
│   └── admin-dashboard.css       # Admin dashboard styles
└── js/
    ├── get-quotation.js          # Quotation form logic
    └── admin-dashboard.js        # Admin dashboard logic
```

## 🔧 Installation & Setup

### Prerequisites
- PHP 7.4 or higher
- MySQL 5.7 or higher
- Web server (Apache/Nginx) or XAMPP/WAMP
- Modern web browser

### Step 1: Database Setup

1. **Start MySQL server**

2. **Import the database schema**:
   ```bash
   mysql -u root -p < database/setup.sql
   ```
   
   Or using phpMyAdmin:
   - Open phpMyAdmin
   - Create new database: `midnight_construction`
   - Import `database/setup.sql`

3. **Verify tables created**:
   - `quotations` - Stores all quotation requests
   - `admin_users` - Admin login credentials
   - `activity_log` - Logs admin actions

### Step 2: Configure Database Connection

1. Open `php/config.php`

2. Update database credentials:
   ```php
   define('DB_HOST', 'localhost');
   define('DB_NAME', 'midnight_construction');
   define('DB_USER', 'root');        // Your MySQL username
   define('DB_PASS', '');            // Your MySQL password
   ```

3. Save the file

### Step 3: Set Up Web Server

#### Option A: Using XAMPP/WAMP
1. Copy entire project folder to `htdocs` (XAMPP) or `www` (WAMP)
2. Start Apache and MySQL services
3. Access via: `http://localhost/midnight-construction/`

#### Option B: Using PHP Built-in Server
```bash
cd d:\projectsFX\midnight\midnight-construction
php -S localhost:8000
```

### Step 4: Configure Permissions

Ensure these directories are writable:
```bash
chmod 755 php/uploads/
chmod 755 php/logs/
```

On Windows, ensure IIS/Apache user has write permissions to these folders.

## 🔐 Default Admin Credentials

- **Username**: `admin`
- **Password**: `admin123`

⚠️ **IMPORTANT**: Change these credentials immediately in production!

To create a new admin user:
```sql
INSERT INTO admin_users (username, password, full_name, email) 
VALUES ('your_username', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Your Name', 'your@email.com');
```

To hash a new password, use PHP:
```php
<?php
echo password_hash('your_password', PASSWORD_DEFAULT);
?>
```

## 📱 Usage

### Customer Quotation Form
1. Navigate to: `http://localhost/midnight-construction/html/get-quotation.html`
2. Fill out the 5-step form:
   - Project Type
   - Budget
   - Plans (with optional file upload)
   - Timeline
   - Personal Details
3. Submit the form
4. Confirmation message appears

### Admin Dashboard
1. Navigate to: `http://localhost/midnight-construction/html/admin-dashboard.html`
2. Login with admin credentials
3. Dashboard features:
   - **Overview**: Statistics and recent quotations
   - **Quotations**: Full list with search/filter
   - **View Details**: Click any quotation to see full details
   - **Update Status**: Change quotation status
   - **Add Notes**: Add internal notes to quotations
   - **Delete**: Remove quotations permanently

## 🔌 API Endpoints

### Public Endpoints

**Submit Quotation**
```
POST /php/submit-quotation.php
Content-Type: multipart/form-data

Fields:
- projectType (string)
- budget (number)
- hasPlans (yes/no)
- planFile (file, optional)
- startDate (date)
- fullName (string)
- email (string)
- phone (string)
- city (string)
- consultation (true/false)
```

### Admin Endpoints (Requires Authentication)

**Login**
```
POST /php/admin-api.php?action=login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**Get Quotations**
```
GET /php/admin-api.php?action=get-quotations&status=all&search=&page=1&limit=20
```

**Get Single Quotation**
```
GET /php/admin-api.php?action=get-quotation&id=1
```

**Update Status**
```
POST /php/admin-api.php?action=update-status
Content-Type: application/json

{
  "id": 1,
  "status": "contacted"
}
```

**Add Note**
```
POST /php/admin-api.php?action=add-note
Content-Type: application/json

{
  "id": 1,
  "note": "Customer called back, interested in premium package"
}
```

**Delete Quotation**
```
DELETE /php/admin-api.php?action=delete-quotation&id=1
```

**Get Statistics**
```
GET /php/admin-api.php?action=get-stats
```

## 🛡️ Security Features

- ✅ SQL injection prevention (prepared statements)
- ✅ XSS protection (input sanitization)
- ✅ Password hashing (bcrypt)
- ✅ Session management with timeout
- ✅ File upload validation
- ✅ CSRF protection ready (implement tokens)
- ✅ Error logging (not displayed to users)

## 🎨 Customization

### Change Colors
Edit CSS variables in `css/admin-dashboard.css`:
```css
:root {
  --primary: #3d4a7d;      /* Main brand color */
  --secondary: #8bb58f;    /* Secondary color */
  --accent: #ff6b35;       /* Accent color */
}
```

### Modify Form Fields
Edit `html/get-quotation.html` and update corresponding:
- Database schema in `database/setup.sql`
- PHP handler in `php/submit-quotation.php`
- JavaScript in `js/get-quotation.js`

### Email Notifications
Uncomment email function in `php/submit-quotation.php`:
```php
sendEmailNotification($email, $fullName, $quotationId);
```

Configure SMTP or use PHP `mail()` function.

## 🐛 Troubleshooting

### Database Connection Failed
- Verify MySQL is running
- Check credentials in `php/config.php`
- Ensure database exists

### File Upload Not Working
- Check `php/uploads/` directory exists and is writable
- Verify `upload_max_filesize` and `post_max_size` in `php.ini`
- Check file permissions

### Admin Login Not Working
- Verify admin user exists in database
- Check password hash
- Clear browser cookies/cache
- Check PHP session configuration

### Blank Admin Dashboard
- Check browser console for JavaScript errors
- Verify API endpoints are accessible
- Check PHP error logs in `php/logs/error.log`

## 📊 Database Tables

### quotations
| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key |
| project_type | VARCHAR(100) | Type of project |
| budget | DECIMAL(15,2) | Estimated budget |
| has_plans | ENUM | yes/no |
| plan_file | VARCHAR(255) | Filename if uploaded |
| start_date | DATE | Preferred start date |
| full_name | VARCHAR(255) | Customer name |
| email | VARCHAR(255) | Customer email |
| phone | VARCHAR(20) | Customer phone |
| city | VARCHAR(100) | Customer city |
| consultation | ENUM | yes/no |
| status | ENUM | pending/contacted/quoted/completed/cancelled |
| notes | TEXT | Admin notes |
| created_at | TIMESTAMP | Submission timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

### admin_users
| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key |
| username | VARCHAR(50) | Login username |
| password | VARCHAR(255) | Hashed password |
| full_name | VARCHAR(100) | Admin name |
| email | VARCHAR(255) | Admin email |
| created_at | TIMESTAMP | Account creation |
| last_login | TIMESTAMP | Last login time |

## 🚀 Production Deployment

### Before Going Live:

1. **Change default admin password**
2. **Disable error display**:
   ```php
   ini_set('display_errors', 0);
   ```
3. **Enable HTTPS**
4. **Set strong session security**
5. **Configure regular database backups**
6. **Set up error monitoring**
7. **Implement rate limiting**
8. **Add CAPTCHA to form**
9. **Configure email notifications**
10. **Test all functionality**

## 📝 License

This project is part of Midnight Construction website.

## 🤝 Support

For issues or questions, contact: admin@midnight.com

## 📚 Additional Resources

- [PHP Documentation](https://www.php.net/docs.php)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Web Security Best Practices](https://owasp.org/)

---

**Last Updated**: January 2026
