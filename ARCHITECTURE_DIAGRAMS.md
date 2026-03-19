# Online Classes Feature - Architecture & Flow Diagrams

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (React)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Admin Dashboard ────────────────────────────────────────────── │
│  ├─ Create Classes                                             │
│  ├─ Edit Classes                                               │
│  ├─ Assign Users                                               │
│  ├─ Change Status                                              │
│  ├─ Delete Classes                                             │
│  └─ Copy Meeting Links                                         │
│                                                                 │
│  User Dashboard                                                 │
│  ├─ View Assigned Classes                                      │
│  ├─ Filter by Status                                           │
│  ├─ Join Classes                                               │
│  ├─ View Details                                               │
│  └─ Record Attendance                                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ API Calls
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Backend (Express.js)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Routes: /api/online-classes/*                                 │
│  ├─ POST   / (Create)                                          │
│  ├─ GET    / (Get All/Assigned)                                │
│  ├─ GET    /:id (Get One)                                      │
│  ├─ PATCH  /:id (Update)                                       │
│  ├─ PATCH  /:id/assign-users (Assign)                          │
│  ├─ PATCH  /:id/join (Attend)                                  │
│  └─ DELETE /:id (Delete)                                       │
│                                                                 │
│  Middleware:                                                    │
│  ├─ requireAuth (Check JWT)                                    │
│  └─ requireRole (Check Admin/Customer)                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Database
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    MongoDB Database                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Collection: onlineclasses                                     │
│  ├─ Documents with:                                            │
│  │  ├─ Class Metadata (title, description, topic)             │
│  │  ├─ Scheduling (date, time, duration)                      │
│  │  ├─ Meeting Info (Google Meet link)                        │
│  │  ├─ Participants (assigned users, attendees)               │
│  │  ├─ Status (draft, scheduled, ongoing, etc.)               │
│  │  └─ Timestamps (created, updated)                          │
│  └─ Indexes for performance                                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## User Journey - Admin

```
┌─────────────────────────────────┐
│  Admin Login                    │
│  /admin/auth                    │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  Admin Dashboard                │
│  /admin                         │
│  (View appointments, etc.)      │
└────────────┬────────────────────┘
             │
   ┌─────────┴─────────┐
   │                   │
   ▼                   ▼
┌──────────────────────┐  ┌─────────────────────────────────┐
│  Click "Online       │  │  Select from navbar             │
│  Classes"            │  │  "Online Classes" link          │
└──────────┬───────────┘  └──────────────┬──────────────────┘
           │                             │
           └──────────────┬──────────────┘
                          │
                          ▼
           ┌──────────────────────────────┐
           │  Admin Online Classes Page   │
           │  /admin/online-classes       │
           └──────────────┬───────────────┘
                          │
    ┌─────────┬───────────┼───────────┬──────────────┐
    │         │           │           │              │
    ▼         ▼           ▼           ▼              ▼
┌──────┐ ┌──────┐ ┌─────────┐ ┌──────────┐ ┌───────────┐
│Filter│ │Create│ │Edit     │ │Change    │ │Delete     │
│Class │ │Class │ │Class    │ │Status    │ │Class      │
└──────┘ └──┬───┘ └────┬────┘ └───┬──────┘ └─────┬─────┘
            │          │          │              │
            ▼          ▼          ▼              ▼
       ┌────────────────────────────────────────────┐
       │  API Call to /api/online-classes           │
       │  ├─ POST (create)                          │
       │  ├─ PATCH (update/status)                  │
       │  ├─ PATCH /assign-users (assign)           │
       │  └─ DELETE (delete)                        │
       └───────────────────┬────────────────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │ MongoDB     │
                    │ Updated ✓   │
                    └─────────────┘
```

## User Journey - Customer

```
┌─────────────────────────┐
│  Customer Login         │
│  /customer-auth         │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  Home Page                      │
│  /                              │
└────────────┬────────────────────┘
             │
   ┌─────────┴─────────────────────┐
   │  Click "Online Classes"         │
   │  (from navbar)                  │
   │  /online-classes                │
   │                                 │
   └────────────┬────────────────────┘
                │
                ▼
    ┌──────────────────────────────────┐
    │  My Online Classes Page          │
    │  (Shows assigned classes)        │
    │  /online-classes                 │
    └────────────┬─────────────────────┘
                 │
    ┌────────────┼────────────┬──────────────┐
    │            │            │              │
    ▼            ▼            ▼              ▼
┌────────┐  ┌─────────┐  ┌──────────┐  ┌─────────┐
│Filter  │  │View     │  │Join      │  │View     │
│Classes │  │Details  │  │Class     │  │Details  │
└────────┘  └────┬────┘  └────┬─────┘  │Modal    │
                 │            │        └─────┬───┘
                 │            │              │
                 ▼            ▼              ▼
            ┌───────────────────────────────────┐
            │  Get Class Details                │
            │  GET /api/online-classes/:id      │
            │  or                               │
            │  POST /api/online-classes/:id/join│
            └───────────────────────────────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │ Browser         │
                 │ Opens Meeting   │
                 │ Link (Google    │
                 │ Meet)           │
                 └────────┬────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │ Attendance      │
                 │ Recorded ✓      │
                 │ in MongoDB      │
                 └─────────────────┘
```

## Admin Class Lifecycle

```
                    ┌──────────────────┐
                    │  Create Class    │
                    │  POST /          │
                    │  Status: draft   │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │  Edit Class      │
                    │  PATCH /:id      │
                    │  Status: draft   │
                    └────────┬─────────┘
                             │
                             ▼
            ┌────────────────────────────────┐
            │  Assign Users                  │
            │  PATCH /:id/assign-users       │
            │  Users added to assignedUsers  │
            └────────────┬───────────────────┘
                         │
                         ▼
            ┌────────────────────────────────┐
            │  Change to Scheduled           │
            │  PATCH /:id {status: "schedu- │
            │  led"}                         │
            │  Class now visible to users    │
            └────────────┬───────────────────┘
                         │
                         ▼
            ┌────────────────────────────────┐
            │  Class Time Arrives            │
            │  Change to Ongoing             │
            │  PATCH /:id {status: "ongoing"}│
            │  Users see "Join Class" button │
            └────────────┬───────────────────┘
                         │
                         ▼
            ┌────────────────────────────────┐
            │  Class Ends                    │
            │  Change to Completed           │
            │  PATCH /:id {status: "complet-│
            │  ed"}                          │
            │  Attendance locked             │
            └────────────┬───────────────────┘
                         │
                         ▼
            ┌────────────────────────────────┐
            │  Final State                   │
            │  Status: completed             │
            │  Can archive or delete         │
            └────────────────────────────────┘

Optional Path: CANCEL
            ┌────────────────────────────────┐
            │  Cancel Class                  │
            │  PATCH /:id {status: "cancel-  │
            │  led"}                         │
            │  Users cannot join             │
            └────────────────────────────────┘
```

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Create Class                             │
│                                                             │
│  Admin Form Data                                            │
│  {                                                          │
│    title: "Advanced HR",                                    │
│    topic: "HR Consulting",                                  │
│    date: "2024-03-25",                                      │
│    time: "14:00",                                           │
│    duration: 90,                                            │
│    maxParticipants: 50                                      │
│  }                                                          │
│                                                             │
│  ─────────────────────────────────────────────▶             │
│                                                             │
│  Backend Validation & Processing                           │
│  ├─ Validate required fields                               │
│  ├─ Generate Google Meet link                              │
│  ├─ Set status: "scheduled"                                │
│  ├─ Set createdBy: admin._id                               │
│  └─ Save to MongoDB                                        │
│                                                             │
│  ─────────────────────────────────────────────▶             │
│                                                             │
│  MongoDB Document Created                                   │
│  {                                                          │
│    _id: ObjectId,                                           │
│    title: "Advanced HR",                                    │
│    topic: "HR Consulting",                                  │
│    date: "2024-03-25",                                      │
│    time: "14:00",                                           │
│    duration: 90,                                            │
│    maxParticipants: 50,                                     │
│    meetingLink: "https://meet.google.com/...",             │
│    status: "scheduled",                                     │
│    createdBy: admin._id,                                    │
│    assignedUsers: [],                                       │
│    attendees: [],                                           │
│    createdAt: Timestamp,                                    │
│    updatedAt: Timestamp                                     │
│  }                                                          │
│                                                             │
│  ─────────────────────────────────────────────▶             │
│                                                             │
│  Response to Admin                                          │
│  {                                                          │
│    success: true,                                           │
│    message: "Online class created successfully!",           │
│    data: { ... entire document ... }                        │
│  }                                                          │
│                                                             │
│  ─────────────────────────────────────────────▶             │
│                                                             │
│  Admin UI Updated                                           │
│  ├─ Class appears in list                                  │
│  ├─ Form cleared                                           │
│  └─ Success message shown                                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Component Structure

```
App.jsx
├── Routes
│   ├── /online-classes
│   │   └── UserOnlineClassPage.jsx
│   │       ├─ Class List (Grid)
│   │       ├─ Filter Controls
│   │       ├─ Class Card Component
│   │       │   ├─ Status Badge
│   │       │   ├─ Join Button
│   │       │   └─ Details Button
│   │       └─ Details Modal
│   │           ├─ Class Info
│   │           ├─ Meeting Link
│   │           └─ Join/Close Buttons
│   │
│   └── /admin/online-classes
│       └── AdminOnlineClassPage.jsx
│           ├─ Filter Dropdown
│           ├─ Create Class Button
│           ├─ Create Form (collapsed/expanded)
│           │   ├─ Title Input
│           │   ├─ Topic Input
│           │   ├─ Date Picker
│           │   ├─ Time Selector
│           │   ├─ Duration Input
│           │   ├─ Participants Input
│           │   └─ Submit Button
│           └─ Class List (Rows)
│               ├─ Class Details
│               ├─ Status Dropdown
│               ├─ Action Buttons
│               │   ├─ Edit
│               │   ├─ Delete
│               │   └─ Copy Link
│               └─ Attendee Info

Navbar.jsx
├─ Desktop Menu
│   ├─ Navigation Links
│   ├─ Bookings Link (users)
│   ├─ Online Classes Link (users & admins)
│   └─ Admin/Dashboard Link
│
└─ Mobile Menu
    ├─ Navigation Links
    ├─ Bookings Link (users)
    ├─ Online Classes Link (users & admins)
    └─ Admin/Dashboard Link
```

## State Management Flow

```
AdminOnlineClassPage State:
├─ classes: []              (fetched from API)
├─ filter: "scheduled"      (current filter)
├─ form: {}                 (create/edit form data)
├─ showForm: false          (form visibility)
├─ editingClass: null       (class being edited)
├─ statusDrafts: {}         (temp status changes)
├─ loading: false           (loading state)
├─ error: ""                (error message)
└─ busyId: ""               (which item is processing)

UserOnlineClassPage State:
├─ classes: []              (fetched from API)
├─ filter: "all"            (current filter)
├─ selectedClass: null      (modal class)
├─ loading: false           (loading state)
├─ error: ""                (error message)
└─ busyId: ""               (which item is processing)
```

## Error Handling Flow

```
User Action
    │
    ▼
API Call
    │
    ├─ Network Error?
    │  └─▶ Catch Error → Show "Unable to load..."
    │
    ├─ 401 Unauthorized?
    │  └─▶ Redirect to login
    │
    ├─ 403 Forbidden?
    │  └─▶ Show "Access denied"
    │
    ├─ 400 Bad Request?
    │  └─▶ Show validation error message
    │
    ├─ 404 Not Found?
    │  └─▶ Show "Item not found"
    │
    ├─ 500 Server Error?
    │  └─▶ Show "Server error. Please try again"
    │
    └─ Success?
       └─▶ Update state and UI
```

These diagrams illustrate the complete architecture, user journeys, data flow, and component structure of the Online Classes feature.
