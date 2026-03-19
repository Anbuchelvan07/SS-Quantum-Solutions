# Online Classes Feature - Quick Start Guide

## What Was Added

A complete online classes management system for both admins and users:

### Admin Can:
1. Create online classes with specific dates/times
2. Set class topics, duration, participant limits
3. Assign specific users to classes
4. Manage class status (draft → scheduled → ongoing → completed/cancelled)
5. Access auto-generated Google Meet links
6. Edit or delete classes

### Users Can:
1. See all assigned online classes
2. Filter classes by status
3. Join classes with one click (opens meeting link)
4. View detailed class information
5. See instructor and class resources
6. Automatic attendance recording

## How to Use

### For Admins

1. **Login as Admin**
   - Go to `/admin/auth` or click Admin in navbar
   - Log in with admin credentials

2. **Create a Class**
   - Click "Online Classes" in admin navbar
   - Click "+ Create Class"
   - Fill form with:
     - Class Title
     - Topic (required)
     - Date and Time
     - Duration (minutes)
     - Max Participants
     - Description
   - Click "Create Class"

3. **Manage Classes**
   - View all classes with filter dropdown
   - Change status using dropdown + "Save Status"
   - Click "Edit" to modify class details
   - Click "Delete" to remove class
   - Copy meeting links to share

### For Users

1. **Login as User/Customer**
   - Go to `/customer-auth` or click "Login" in navbar
   - Log in with customer credentials

2. **View Your Classes**
   - Click "Online Classes" in navbar
   - See all classes assigned to you
   - Filter by status if needed

3. **Join a Class**
   - Click green "🎥 Join Class" button for upcoming/ongoing classes
   - Meeting link opens automatically
   - Attendance recorded

4. **View Details**
   - Click "View Details" for full class information
   - See instructor, time, resources in modal
   - Join from modal if preferred

## File Changes Summary

### New Files Created
```
server/models/OnlineClass.js          (MongoDB model)
server/routes/onlineClasses.js        (API endpoints)
src/pages/AdminOnlineClassPage.jsx    (Admin dashboard)
src/pages/UserOnlineClassPage.jsx     (User dashboard)
ONLINE_CLASSES_FEATURE.md             (Full documentation)
```

### Modified Files
```
server/index.js                       (Added route registration)
src/App.jsx                           (Added routes)
src/services/api.js                   (Added API methods)
src/components/Navbar.jsx             (Added navigation links)
```

## API Endpoints

### For Admins
```
POST   /api/online-classes              Create class
GET    /api/online-classes              Get all classes
GET    /api/online-classes/:id          Get class details
PATCH  /api/online-classes/:id          Update class
PATCH  /api/online-classes/:id/assign-users  Assign users
DELETE /api/online-classes/:id          Delete class
```

### For Users
```
GET    /api/online-classes              Get classes (assigned/public only)
GET    /api/online-classes/assigned     Get assigned classes
GET    /api/online-classes/:id          Get class details
PATCH  /api/online-classes/:id/join     Join and record attendance
```

## Key Features

✅ **Complete CRUD** - Create, Read, Update, Delete classes
✅ **Role-Based Access** - Separate features for admin and user
✅ **Auto Meeting Links** - Google Meet links generated automatically
✅ **Status Management** - Draft → Scheduled → Ongoing → Completed/Cancelled
✅ **User Assignment** - Admins assign specific users to classes
✅ **Attendance Tracking** - Automatic recording when users join
✅ **Responsive Design** - Works on desktop and mobile
✅ **Dark Mode Support** - Full dark mode styling
✅ **Error Handling** - Comprehensive error messages
✅ **Protected Routes** - Role-based access control

## Class Status Meanings

| Status | Meaning |
|--------|---------|
| draft | Class is being prepared |
| scheduled | Class is ready for attendees |
| ongoing | Class is currently happening |
| completed | Class has finished |
| cancelled | Class is cancelled |

## Important Notes

- Classes use YYYY-MM-DD date format
- Times use 24-hour format (HH:MM)
- Duration: 15-480 minutes
- Meeting links auto-generated (Google Meet format)
- Users see only assigned and public classes
- Admins see all classes
- Join button only shows for upcoming/ongoing classes
- Attendance automatically recorded when joining

## Navigation Paths

```
Admin:
  /admin                      - Admin Dashboard
  /admin/online-classes       - Manage Classes

User:
  /online-classes             - View Assigned Classes
  /book                       - Bookings
```

## Navbar Updates

Both desktop and mobile navigation now include links to "Online Classes":
- Admins see `/admin/online-classes` link
- Users see `/online-classes` link

## Database Schema

Online classes stored in MongoDB with:
- Title, description, topic
- Date and time with duration
- Meeting link (Google Meet)
- Assigned users list
- Status tracking
- Attendee details with join time
- Creator (admin) reference
- Timestamps (created/updated)

## Testing Checklist

- [ ] Admin can create a class
- [ ] Admin can assign users to class
- [ ] Admin can change class status
- [ ] Admin can edit class details
- [ ] Admin can delete class
- [ ] Users see assigned classes
- [ ] Users can filter classes by status
- [ ] Users can join upcoming/ongoing classes
- [ ] Meeting links open correctly
- [ ] Attendance is recorded
- [ ] Navbar shows correct links
- [ ] Mobile responsive
- [ ] Dark mode works

## Need to Add Users to Classes?

Since the form currently shows an empty user list, you should:

1. Create a `GET /api/users` endpoint in your auth routes to fetch all users
2. Modify the `loadAllUsers()` function in AdminOnlineClassPage.jsx to populate the list
3. Or manually assign user IDs when creating/editing classes

Example in AdminOnlineClassPage.jsx would need:
```javascript
const loadAllUsers = async () => {
  try {
    const response = await fetch('/api/users', {
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = await response.json()
    setAllUsers(data.data || [])
  } catch (err) {
    console.error('Failed to load users:', err)
  }
}
```

## Support

Refer to `ONLINE_CLASSES_FEATURE.md` for:
- Detailed API documentation
- Data model specifications
- Troubleshooting guide
- Future enhancement ideas
