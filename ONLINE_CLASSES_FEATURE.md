# Online Classes Feature Documentation

## Overview
The Online Classes feature enables admins to create and assign online consulting classes to users, and allows users to attend these classes. Admins can set specific dates and times, and users will see the assigned classes on their dashboard.

## Features

### Admin Features
- **Create Online Classes**: Admins can create new online classes with:
  - Class title and description
  - Topic and date/time scheduling
  - Duration and max participants
  - Meeting link (auto-generates Google Meet links)
  - Option to make classes public or private
  - User assignment

- **Manage Classes**:
  - View all classes with filtering by status
  - Update class details
  - Change class status (draft, scheduled, ongoing, completed, cancelled)
  - Assign/unassign users to classes
  - Delete classes
  - Copy meeting links to clipboard

### User Features
- **View Assigned Classes**: Users can see all classes assigned to them
- **Filter Classes**: Filter by status (all, scheduled, ongoing, completed)
- **Join Classes**: Attend classes with one-click join button (opens meeting link)
- **View Class Details**: 
  - Date, time, duration, and participant count
  - Class description and topic
  - Instructor information
  - Meeting link
  - Class resources (if any)
- **Attendance Tracking**: Automatic record when user joins a class

## Project Structure

### Backend Files

#### Models
- **[server/models/OnlineClass.js](server/models/OnlineClass.js)**
  - MongoDB schema for online classes
  - Fields: title, description, date, time, duration, meetingLink, maxParticipants, assignedUsers, status, attendees, etc.
  - Indexes for efficient querying

#### Routes
- **[server/routes/onlineClasses.js](server/routes/onlineClasses.js)**
  - `GET /api/online-classes` - Get all classes (filtered based on user role)
  - `GET /api/online-classes/assigned` - Get classes assigned to current user
  - `GET /api/online-classes/:id` - Get specific class
  - `POST /api/online-classes` - Create new class (admin only)
  - `PATCH /api/online-classes/:id` - Update class (admin only)
  - `PATCH /api/online-classes/:id/assign-users` - Assign users (admin only)
  - `PATCH /api/online-classes/:id/join` - Join class and record attendance
  - `DELETE /api/online-classes/:id` - Delete class (admin only)

### Frontend Files

#### Pages
- **[src/pages/AdminOnlineClassPage.jsx](src/pages/AdminOnlineClassPage.jsx)**
  - Admin dashboard for managing online classes
  - Create, edit, delete, and manage class status
  - Assign users to classes
  - Copy meeting links

- **[src/pages/UserOnlineClassPage.jsx](src/pages/UserOnlineClassPage.jsx)**
  - User dashboard showing assigned classes
  - Filter by status
  - Join classes with attendance tracking
  - View detailed class information

#### Services
- **[src/services/api.js](src/services/api.js)**
  - `onlineClassApi` object with methods:
    - `getAllClasses(token, status)`
    - `getAssignedClasses(token)`
    - `getClass(token, id)`
    - `createClass(token, payload)`
    - `updateClass(token, id, payload)`
    - `assignUsers(token, id, userIds)`
    - `joinClass(token, id)`
    - `deleteClass(token, id)`

#### Routing
- **[src/App.jsx](src/App.jsx)**
  - `/online-classes` - User online classes page (customer role only)
  - `/admin/online-classes` - Admin online classes page (admin role only)

#### Navigation
- **[src/components/Navbar.jsx](src/components/Navbar.jsx)**
  - Links to "Online Classes" for both admin and customer
  - Mobile-responsive navigation

## Usage Guide

### For Admins

1. **Navigate to Admin Dashboard**
   - Click "Admin" in navbar or go to `/admin`
   - Click "Online Classes" in admin menu

2. **Create a New Class**
   - Click "+ Create Class" button
   - Fill in the form:
     - Class Title: Name of your class
     - Topic: Subject area (e.g., "HR Consulting")
     - Date: Select date
     - Time: Choose from available slots
     - Duration: Class length in minutes (15-480)
     - Max Participants: Maximum attendees allowed
     - Description: Additional details (optional)
     - Public: Check to make visible to all users
   - Click "Create Class"

3. **Assign Users to Classes**
   - After creating a class, select users from the assignment list
   - Click "Save" to assign

4. **Manage Classes**
   - Filter by status to see specific classes
   - Edit classes by clicking "Edit" button
   - Change class status using dropdown and "Save Status"
   - Copy meeting links to share with participants
   - Delete classes with "Delete" button

### For Users

1. **Navigate to Online Classes**
   - Click "Online Classes" or "Classes" in navbar
   - Or go to `/online-classes`

2. **View Your Classes**
   - See all classes assigned to you
   - Filter by status if needed

3. **Join a Class**
   - Classes show "Join Class" button if upcoming or ongoing
   - Click to join - opens meeting link automatically
   - Attendance is recorded

4. **View Class Details**
   - Click "View Details" to see full information
   - See instructor, resources, and meeting link
   - Can join from detail view

## Data Model

### OnlineClass Schema
```javascript
{
  title: String (required),
  description: String,
  date: String (required), // YYYY-MM-DD format
  time: String (required), // HH:MM format
  duration: Number (required), // minutes, 15-480
  meetingLink: String (required), // Google Meet link
  maxParticipants: Number (default: 50),
  assignedUsers: [ObjectId], // Array of user IDs
  createdBy: ObjectId (required), // Admin who created
  status: String (enum: ['draft', 'scheduled', 'ongoing', 'completed', 'cancelled']),
  isPublic: Boolean (default: false),
  attendees: [
    {
      userId: ObjectId,
      joinedAt: Date,
      status: String (enum: ['assigned', 'attended', 'no-show', 'cancelled'])
    }
  ],
  topic: String,
  resources: [
    {
      name: String,
      url: String
    }
  ]
}
```

## API Endpoints Summary

### Public Endpoints (Authenticated Users)
- `GET /api/online-classes` - Get classes based on user role
- `GET /api/online-classes/:id` - Get class details
- `PATCH /api/online-classes/:id/join` - Join and attend class

### User/Customer Endpoints (Authenticated)
- `GET /api/online-classes/assigned` - Get assigned classes

### Admin Endpoints (Admin Role Only)
- `POST /api/online-classes` - Create class
- `PATCH /api/online-classes/:id` - Update class
- `PATCH /api/online-classes/:id/assign-users` - Assign users
- `DELETE /api/online-classes/:id` - Delete class

## Status Flow

1. **draft** - Class is being prepared
2. **scheduled** - Class is scheduled and ready
3. **ongoing** - Class is currently happening
4. **completed** - Class has finished
5. **cancelled** - Class is cancelled

## Meeting Links

- Google Meet links are automatically generated when a class is created
- Admin can copy and share meeting links
- Users can open meeting links directly from class details
- Attendance is recorded when user joins through the platform

## Key Features Implementation

### Automatic Meeting Link Generation
- Uses `generateGoogleMeetLink()` from meetService
- Links are stored and can be copied/shared

### Attendance Tracking
- Records when user joins a class
- Stores join time
- Marks as "attended"

### Role-Based Access Control
- Admins see all classes and can manage them
- Users see only assigned and public classes
- Middleware enforces authorization

### Responsive Design
- Desktop: Cards with full details
- Mobile: Compact cards with essential info
- Modal for detailed view on mobile

## Future Enhancements

1. Email notifications for class assignments
2. Calendar integration
3. Recording storage and playback
4. Real-time attendance dashboard
5. Q&A and chat during classes
6. Certificate generation for completed classes
7. Class templates for recurring sessions
8. Integration with video conferencing APIs

## Troubleshooting

### Users can't see assigned classes
- Check if user is properly assigned to class
- Verify user is logged in
- Check class status isn't "cancelled"

### Meeting link not opening
- Ensure valid Google Meet URL format
- Check browser permissions for pop-ups
- Try copying link manually from details

### Class not appearing in dropdown
- Verify class date/time is in future
- Check class status is "scheduled"
- Ensure you're looking for right status filter

## Notes

- All dates use YYYY-MM-DD format
- Times are in 24-hour format (HH:MM)
- Meeting links are auto-generated (Google Meet format)
- Classes can be made public for discovery
- Attendance is auto-recorded on join
- Admin can update class details anytime before class
