# 🧪 Testing Guide

## Manual Testing Checklist

### Database Setup ✅

- [ ] MySQL server is running
- [ ] Database `midnight_construction` created
- [ ] All tables created (quotations, admin_users, activity_log)
- [ ] Default admin user exists
- [ ] Can connect via phpMyAdmin

### Customer Quotation Form ✅

**Basic Functionality:**
- [ ] Page loads without errors
- [ ] All 5 steps visible
- [ ] Progress bar works
- [ ] Navigation between steps works

**Step 1 - Project Type:**
- [ ] Dropdown shows all options
- [ ] Required field validation works
- [ ] Can proceed to next step

**Step 2 - Budget:**
- [ ] Slider moves smoothly
- [ ] Budget value updates in real-time
- [ ] INR formatting correct (₹5,00,000)
- [ ] Can proceed to next step

**Step 3 - Plans:**
- [ ] Radio buttons work
- [ ] File upload appears when "Yes" selected
- [ ] File validation works (PDF, JPG, PNG only)
- [ ] File size limit enforced (10MB)
- [ ] Can proceed without file

**Step 4 - Timeline:**
- [ ] Date picker works
- [ ] Minimum date set to today
- [ ] Can proceed to next step

**Step 5 - Details:**
- [ ] All fields accept input
- [ ] Email validation works
- [ ] Phone validation works
- [ ] Checkbox for consultation works
- [ ] Submit button enabled when valid

**Form Submission:**
- [ ] Submit shows loading state
- [ ] Success modal appears on success
- [ ] Data saved to database
- [ ] File uploaded to php/uploads/
- [ ] Error modal on failure

### Admin Dashboard ✅

**Login:**
- [ ] Login page displays
- [ ] Can login with admin/admin123
- [ ] Wrong credentials show error
- [ ] Session persists on refresh
- [ ] Logout works

**Overview Page:**
- [ ] Statistics cards show correct numbers
- [ ] Total quotations count correct
- [ ] Pending count correct
- [ ] Budget sum correct
- [ ] Recent quotations table populated
- [ ] Can click quotation to view details

**Quotations Page:**
- [ ] Full table displays all quotations
- [ ] Status filter works (all statuses)
- [ ] Search works (name, email, phone, city)
- [ ] Pagination works
- [ ] Refresh button works
- [ ] Can view quotation details
- [ ] Can delete quotation

**Quotation Details Modal:**
- [ ] Modal opens with correct data
- [ ] All fields displayed correctly
- [ ] Status dropdown works
- [ ] Can change status
- [ ] Can add/update notes
- [ ] File download link works (if file exists)
- [ ] Close button works

**Navigation:**
- [ ] Sidebar navigation works
- [ ] Active item highlighted
- [ ] Page titles update
- [ ] Badge shows pending count

### API Endpoints ✅

**Public Endpoints:**
```bash
# Test quotation submission
curl -X POST http://localhost/midnight-construction/php/submit-quotation.php \
  -F "projectType=Independent House" \
  -F "budget=7500000" \
  -F "hasPlans=no" \
  -F "startDate=2026-03-15" \
  -F "fullName=Test User" \
  -F "email=test@example.com" \
  -F "phone=9876543210" \
  -F "city=Bangalore" \
  -F "consultation=true"
```

**Admin Endpoints:**
- [ ] Login endpoint works
- [ ] Get quotations endpoint works
- [ ] Get single quotation works
- [ ] Update status works
- [ ] Add note works
- [ ] Delete works
- [ ] Get stats works

### Security Testing ✅

**Input Validation:**
- [ ] SQL injection prevented (try: `' OR '1'='1`)
- [ ] XSS prevented (try: `<script>alert('XSS')</script>`)
- [ ] File upload restricted to allowed types
- [ ] File size limit enforced
- [ ] Special characters handled correctly

**Authentication:**
- [ ] Cannot access admin API without login
- [ ] Session timeout works (after 1 hour)
- [ ] Password hashing works
- [ ] Login attempts logged

### Browser Compatibility ✅

Test in:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Edge (latest)
- [ ] Safari (if available)
- [ ] Mobile browsers

### Responsive Design ✅

Test on:
- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)

### File Operations ✅

- [ ] Files upload successfully
- [ ] Files stored in php/uploads/
- [ ] Unique filenames generated
- [ ] Files downloadable from admin
- [ ] Files deleted with quotation

### Error Handling ✅

**Customer Form:**
- [ ] Database connection error handled
- [ ] File upload error handled
- [ ] Validation errors displayed
- [ ] Network error handled

**Admin Dashboard:**
- [ ] Login error displayed
- [ ] API errors handled gracefully
- [ ] Loading states shown
- [ ] No console errors

### Performance Testing ✅

- [ ] Page loads < 2 seconds
- [ ] Form submission < 3 seconds
- [ ] Dashboard loads < 2 seconds
- [ ] File upload < 5 seconds (10MB)
- [ ] No memory leaks
- [ ] Database queries optimized

## Sample Test Data

### Test Quotation 1
```
Project Type: Independent House
Budget: ₹75,00,000
Has Plans: Yes
Start Date: 2026-03-15
Name: Rajesh Kumar
Email: rajesh.kumar@example.com
Phone: +91-9876543210
City: Bangalore
Consultation: Yes
```

### Test Quotation 2
```
Project Type: Villa
Budget: ₹1,20,00,000
Has Plans: No
Start Date: 2026-04-01
Name: Priya Sharma
Email: priya.sharma@example.com
Phone: +91-9876543211
City: Mumbai
Consultation: Yes
```

### Test Quotation 3
```
Project Type: Apartment
Budget: ₹45,00,000
Has Plans: Yes
Start Date: 2026-02-20
Name: Amit Patel
Email: amit.patel@example.com
Phone: +91-9876543212
City: Pune
Consultation: No
```

## SQL Test Queries

### Check Database
```sql
-- Verify tables exist
SHOW TABLES;

-- Count quotations
SELECT COUNT(*) FROM quotations;

-- Check admin users
SELECT * FROM admin_users;

-- View recent quotations
SELECT * FROM quotations ORDER BY created_at DESC LIMIT 5;

-- Statistics
SELECT status, COUNT(*) as count FROM quotations GROUP BY status;
```

### Insert Test Data
```sql
-- Add test quotation
INSERT INTO quotations (project_type, budget, has_plans, start_date, full_name, email, phone, city, consultation, status) 
VALUES ('Independent House', 7500000.00, 'yes', '2026-03-15', 'Test User', 'test@example.com', '+91-9876543210', 'Bangalore', 'yes', 'pending');
```

## Common Issues & Fixes

### Issue: Database connection failed
**Fix:** Check credentials in `php/config.php`

### Issue: File upload not working
**Fix:** Check `php/uploads/` directory exists and is writable

### Issue: Admin login not working
**Fix:** Clear browser cache, check session configuration

### Issue: Blank dashboard
**Fix:** Check browser console for errors, verify API endpoints

### Issue: Form submission fails
**Fix:** Check PHP error logs in `php/logs/error.log`

## Automated Testing (Future)

Consider adding:
- PHPUnit tests for backend
- Jest tests for JavaScript
- Selenium for E2E testing
- Load testing with JMeter

## Test Report Template

```
Date: _______________
Tester: _______________
Browser: _______________
Device: _______________

✅ = Pass
❌ = Fail
⚠️ = Partial

[ ] Database Setup
[ ] Customer Form
[ ] Admin Dashboard
[ ] API Endpoints
[ ] Security
[ ] Responsive Design
[ ] File Operations
[ ] Error Handling

Notes:
_________________________________
_________________________________
_________________________________
```

## Ready to Test?

1. Start your server
2. Run setup wizard
3. Test customer form
4. Test admin dashboard
5. Check database
6. Verify files uploaded
7. Test all features

**Happy Testing! 🎉**
