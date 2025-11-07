# BGP Members Management - Testing Guide

## 🚀 Quick Start Testing

### 1. Start the Servers

**Terminal 1 - Backend:**
```bash
cd BGP_Members_Management/backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd BGP_Members_Management/frontend
npm start
```

The frontend should open automatically at `http://localhost:3002`

---

## 🧪 Test Scenarios

### Test 1: New Member Registration (Public Form)

**URL:** `http://localhost:3002/register`

**Test Steps:**

1. **Personal Information**
   - [ ] Fill in First Name: "John"
   - [ ] Fill in Last Name: "Smith"
   - [ ] Fill in Email: "john.smith@example.com"
   - [ ] Fill in Phone: "(919) 555-1234"
   - [ ] Select Birthdate
   - [ ] Select Gender: "Male"

2. **Address**
   - [ ] Street Address: "123 Main Street"
   - [ ] City: "Wendell"
   - [ ] State: "NC"
   - [ ] ZIP: "27591"
   - [ ] Country: "🇺🇸" (should be default)

3. **Church Information**
   - [ ] Select Baptism Status: "Baptized"
   - [ ] Select Baptism Date (optional)
   - [ ] Previous Church: "First Baptist Church" (optional)

4. **Marital Status**
   - [ ] Select "Married"
   - [ ] ✅ Verify spouse name field appears
   - [ ] Enter Spouse Name: "Jane Smith"

5. **Children Section**
   - [ ] Click "+ Add child"
   - [ ] Enter Child 1:
     - Name: "Tommy Smith"
     - Birthday: Select date
     - ✅ Verify Age auto-calculates
     - Gender: "Male"
   - [ ] Click "+ Add child" again
   - [ ] Enter Child 2:
     - Name: "Sarah Smith"
     - Birthday: Select date
     - Gender: "Female"
   - [ ] ✅ Test removing a child

6. **Household Members**
   - [ ] Click "+ Add adult"
   - [ ] Enter household member:
     - Name: "Mary Johnson"
     - Relationship: "Mother-in-law"
     - Email: "mary@example.com"
     - Phone: "(919) 555-5678"
   - [ ] ✅ Test removing household member

7. **Volunteer Interests**
   - [ ] Check "Youth Ministry"
   - [ ] Check "Prayer Ministry"
   - [ ] Check at least 2 options

8. **Skills & Talents**
   - [ ] Check "Music"
   - [ ] Check "Teaching"
   - [ ] Check at least 2 options

9. **Photo & Media Consent**
   - [ ] Select "Yes, I consent to the use of my image"
   - [ ] ✅ Verify children's consent options appear (because you added children)
   - [ ] Select "Children's Consent - Yes"
   - [ ] Check "Parental Consent" checkbox
   - [ ] Check "Email Communications"
   - [ ] Check "Social Media Consent"

10. **Submit Form**
    - [ ] Click "Submit" button
    - [ ] ✅ Should see success toast message
    - [ ] ✅ Should redirect to success page

**Expected Result:**
- Form submits successfully
- Data saved to database
- Success message displays
- Redirect to success page

---

### Test 2: Verify Data in Database

**Run in terminal:**
```bash
mysql -u root -h localhost bgp_members_db -e "
SELECT id, first_name, last_name, email, gender, country,
       baptism_status, marital_status, spouse_name
FROM members
ORDER BY id DESC LIMIT 1;
"
```

**Check children:**
```bash
mysql -u root -h localhost bgp_members_db -e "
SELECT name, date_of_birth, age, gender
FROM children
WHERE parent_id = (SELECT id FROM members ORDER BY id DESC LIMIT 1);
"
```

**Check household members:**
```bash
mysql -u root -h localhost bgp_members_db -e "
SELECT name, relationship, email, phone
FROM household_members
WHERE primary_member_id = (SELECT id FROM members ORDER BY id DESC LIMIT 1);
"
```

**Check volunteer interests & skills (JSON):**
```bash
mysql -u root -h localhost bgp_members_db -e "
SELECT volunteer_interests, skills_talents
FROM members
ORDER BY id DESC LIMIT 1;
"
```

**Expected Results:**
- ✅ Member record exists with all fields
- ✅ Children records created with correct ages
- ✅ Household member records created
- ✅ volunteer_interests stored as JSON array
- ✅ skills_talents stored as JSON array

---

### Test 3: Admin Dashboard Login

**URL:** `http://localhost:3002/login`

**Credentials:**
- **Email:** `admin@bgpnc.com`
- **Password:** `Admin123!`

**Test Steps:**
1. [ ] Navigate to login page
2. [ ] Enter admin email
3. [ ] Enter password
4. [ ] Click "Login"
5. [ ] ✅ Should redirect to admin dashboard

---

### Test 4: Admin Dashboard - View Members

**URL:** `http://localhost:3002/admin/members`

**Test Steps:**
1. [ ] Click "Members" in admin navigation
2. [ ] ✅ Should see list of all members
3. [ ] ✅ Should see the test member you just created
4. [ ] Click on the member's name
5. [ ] ✅ Should navigate to member detail page
6. [ ] ✅ Verify all data displays correctly:
   - Personal info
   - Address
   - Church info
   - Spouse name (if married)
   - Children list
   - Household members
   - Volunteer interests
   - Skills & talents
   - Consent preferences

---

### Test 5: Form Validation

**URL:** `http://localhost:3002/register`

**Test Invalid Submissions:**

1. **Empty Form**
   - [ ] Try submitting without filling any fields
   - [ ] ✅ Should show validation errors for required fields

2. **Invalid Email**
   - [ ] Enter "notanemail" in email field
   - [ ] ✅ Should show email format error

3. **Invalid Phone**
   - [ ] Enter "abc123" in phone field
   - [ ] ✅ Should show phone format error

4. **Invalid ZIP**
   - [ ] Enter "1234" (too short)
   - [ ] ✅ Should show ZIP code error

5. **Conditional Field Validation**
   - [ ] Select "Married" but leave spouse name empty
   - [ ] Try to submit
   - [ ] ✅ Should show spouse name required error

6. **Child Without Name**
   - [ ] Click "+ Add child"
   - [ ] Leave name empty but fill birthday
   - [ ] Submit form
   - [ ] ✅ Should show required field error OR filter out empty child

---

### Test 6: Dynamic Field Behavior

1. **Marital Status Changes**
   - [ ] Select "Single"
   - [ ] ✅ Spouse field should be hidden
   - [ ] Select "Married"
   - [ ] ✅ Spouse field should appear

2. **Children Photo Consent**
   - [ ] Submit form without adding children
   - [ ] ✅ Children's photo consent should not appear
   - [ ] Add at least one child
   - [ ] ✅ Children's photo consent options should appear

3. **Age Calculation**
   - [ ] Add a child
   - [ ] Select birthday: 10 years ago
   - [ ] ✅ Age field should auto-calculate to "10"
   - [ ] Change birthday to 5 years ago
   - [ ] ✅ Age should update to "5"

---

### Test 7: Multiple Children & Household Members

1. **Add 5 Children**
   - [ ] Click "+ Add child" 5 times
   - [ ] Fill in all 5 children with different data
   - [ ] Remove 2 children
   - [ ] ✅ Should have 3 children remaining
   - [ ] Submit form
   - [ ] ✅ All 3 children should save to database

2. **Add 3 Household Members**
   - [ ] Click "+ Add adult" 3 times
   - [ ] Fill in all 3 with different relationships
   - [ ] Remove 1 member
   - [ ] ✅ Should have 2 remaining
   - [ ] Submit form
   - [ ] ✅ Both should save to database

---

### Test 8: Brand Styling Verification

**Visual Checks:**

1. **Typography**
   - [ ] ✅ Headings use Montserrat font (lighter weight)
   - [ ] ✅ Body text uses Noto Serif font
   - [ ] ✅ Form labels use Montserrat (uppercase)

2. **Colors**
   - [ ] ✅ Primary buttons use teal (#009688)
   - [ ] ✅ Secondary buttons use gold (#9c8040)
   - [ ] ✅ Headers use BGP dark (#212121) or gold
   - [ ] ✅ Text uses proper hierarchy (dark, medium, light)

3. **Responsive Design**
   - [ ] Test on mobile size (< 640px)
   - [ ] Test on tablet size (640px - 1024px)
   - [ ] Test on desktop size (> 1024px)
   - [ ] ✅ Form should be readable at all sizes

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot connect to database"
**Solution:**
- Check MySQL is running: `mysql.server status`
- Verify credentials in `backend/.env`
- Run: `mysql -u root -p bgp_members_db` to test connection

### Issue: "Form doesn't submit"
**Solution:**
- Check browser console for errors (F12)
- Verify backend is running on port 5002
- Check network tab for API call errors

### Issue: "Login doesn't work"
**Solution:**
- Verify users table exists
- Check admin credentials: admin@bgpnc.com / Admin123!
- Look at backend logs for authentication errors

### Issue: "Fonts look wrong"
**Solution:**
- Hard refresh browser (Cmd+Shift+R)
- Check Google Fonts are loading in Network tab
- Verify index.css has font imports at top

### Issue: "Children/Household members not saving"
**Solution:**
- Check browser console for errors
- Verify household_members table exists in database
- Check backend logs for SQL errors

---

## 📊 Success Criteria

**✅ Form is successful if:**
- All fields render correctly
- Validation works on all required fields
- Conditional fields show/hide properly
- Dynamic sections (children, household) work
- Age auto-calculates from birthday
- Form submits without errors
- Data saves to database correctly
- Success page displays after submission

**✅ Admin dashboard is successful if:**
- Login works with admin credentials
- Dashboard displays stats
- Members list shows all registered members
- Member detail page shows complete information
- All new fields display correctly

---

## 🎯 Next Steps After Testing

1. [ ] Fix any bugs found during testing
2. [ ] Update default admin password
3. [ ] Set up email verification (Pabbly Connect)
4. [ ] Add reCAPTCHA for spam protection
5. [ ] Deploy to production (Render + Vercel)
6. [ ] Set up backup schedule for database
7. [ ] Configure production environment variables

---

## 📞 Need Help?

If you encounter issues:
1. Check browser console (F12)
2. Check backend logs: `tail -f backend/logs/app.log`
3. Check database: `mysql -u root -p bgp_members_db`
4. Review error messages carefully

---

**Happy Testing! 🚀**

*Last Updated: November 6, 2025*
