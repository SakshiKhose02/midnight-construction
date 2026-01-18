# 🚀 Quick Start Guide

## Get Started in 5 Minutes!

### 1. Start Your Server

**Using XAMPP/WAMP:**
- Start Apache and MySQL services
- Place project in `htdocs` folder

**Using PHP Built-in Server:**
```bash
cd d:\projectsFX\midnight\midnight-construction
php -S localhost:8000
```

### 2. Run Setup Wizard

Open your browser and go to:
```
http://localhost/midnight-construction/php/setup.php
```
OR
```
http://localhost:8000/php/setup.php
```

Follow the 4-step wizard:
1. ✅ Check prerequisites
2. ✅ Configure database (enter MySQL credentials)
3. ✅ Create directories
4. ✅ Complete!

### 3. Access the System

**Customer Quotation Form:**
```
http://localhost/midnight-construction/html/get-quotation.html
```

**Admin Dashboard:**
```
http://localhost/midnight-construction/html/admin-dashboard.html
```

**Login with:**
- Username: `admin`
- Password: `admin123`

### 4. Test the System

1. Fill out a quotation form
2. Login to admin dashboard
3. View the submitted quotation
4. Update its status
5. Add notes

### 5. Secure Your Installation

⚠️ **Important:**
- Change admin password
- Delete `php/setup.php`
- Update database credentials
- Enable HTTPS in production

## 📞 Need Help?

Check the full documentation:
- [DATABASE_SETUP.md](DATABASE_SETUP.md) - Complete setup guide
- [GET_QUOTATION_SETUP.md](GET_QUOTATION_SETUP.md) - Original form docs

## 🎯 Key Features

### Customer Side
- Multi-step form (5 steps)
- File upload for plans/drawings
- Budget slider (₹50L - ₹2Cr)
- Real-time validation
- Mobile responsive

### Admin Side
- Dashboard with statistics
- Search & filter quotations
- Status management
- Notes system
- File downloads
- Export ready

## 📊 Status Workflow

```
Pending → Contacted → Quoted → Completed
                              ↓
                          Cancelled
```

## 🔧 Common Tasks

### Add New Admin User
```sql
INSERT INTO admin_users (username, password, full_name, email) 
VALUES ('newadmin', '$2y$10$...', 'Admin Name', 'admin@email.com');
```

### Reset Admin Password
```php
<?php
// Create hash for new password
echo password_hash('new_password', PASSWORD_DEFAULT);
?>
```

### Backup Database
```bash
mysqldump -u root -p midnight_construction > backup.sql
```

### View Error Logs
Check: `php/logs/error.log`

## 🎨 Customization

### Change Theme Colors
Edit `css/admin-dashboard.css`:
```css
:root {
  --primary: #3d4a7d;    /* Your brand color */
  --secondary: #8bb58f;  /* Accent color */
  --accent: #ff6b35;     /* Highlights */
}
```

### Modify Form Fields
1. Update `html/get-quotation.html`
2. Update `database/setup.sql`
3. Update `php/submit-quotation.php`
4. Update `js/get-quotation.js`

## 📱 Mobile Support

Both customer form and admin dashboard are fully responsive and work on:
- ✅ Desktop (1920x1080+)
- ✅ Laptop (1366x768+)
- ✅ Tablet (768x1024)
- ✅ Mobile (375x667+)

## 🔒 Security Checklist

- [x] SQL injection prevention (PDO prepared statements)
- [x] XSS protection (input sanitization)
- [x] Password hashing (bcrypt)
- [x] Session management
- [x] File upload validation
- [ ] CSRF tokens (add for production)
- [ ] Rate limiting (add for production)
- [ ] CAPTCHA (add for production)

## 🚀 Production Deployment

Before going live:
1. ✅ Change all default passwords
2. ✅ Delete setup.php
3. ✅ Disable error display
4. ✅ Enable HTTPS
5. ✅ Configure backups
6. ✅ Set up monitoring
7. ✅ Add CAPTCHA
8. ✅ Configure email notifications
9. ✅ Test thoroughly

## 📈 What's Included

```
✅ MySQL database integration
✅ PHP backend (submit-quotation.php, admin-api.php)
✅ Admin dashboard (HTML/CSS/JS)
✅ Authentication system
✅ File upload handling
✅ Search & filter
✅ Pagination
✅ Status management
✅ Notes system
✅ Statistics dashboard
✅ Responsive design
✅ Error handling
✅ Security features
```

## ⚡ Performance Tips

- Enable MySQL query caching
- Use PHP OPcache
- Optimize images
- Enable gzip compression
- Add CDN for static assets
- Implement pagination (already included)

## 🎓 Learning Resources

- PHP: https://www.php.net/manual/
- MySQL: https://dev.mysql.com/doc/
- Security: https://owasp.org/

---

**Ready to start?** Run the setup wizard now!

```
http://localhost/midnight-construction/php/setup.php
```
