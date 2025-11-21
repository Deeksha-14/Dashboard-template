# Admin Dashboard - Visual Architecture & Overview

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      ADMIN DASHBOARD                             │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  FRONTEND (React)                                        │   │
│  │  AdminDashboard.jsx (688 lines)                          │   │
│  │                                                           │   │
│  │  ┌─ Overview Tab ─────────────────────────────────────┐ │   │
│  │  │ • Statistics (4 cards)                             │ │   │
│  │  │ • Quick Actions (3 buttons)                        │ │   │
│  │  └────────────────────────────────────────────────────┘ │   │
│  │  ┌─ Workshops Tab ────────────────────────────────────┐ │   │
│  │  │ • Search (real-time filter)                        │ │   │
│  │  │ • Table (Title, Instructor, Date, Capacity)       │ │   │
│  │  │ • Create, Edit, Delete buttons                     │ │   │
│  │  │ • Modal form for CRUD                              │ │   │
│  │  └────────────────────────────────────────────────────┘ │   │
│  │  ┌─ Participants Tab ─────────────────────────────────┐ │   │
│  │  │ • Search (real-time filter)                        │ │   │
│  │  │ • Table (Name, Email, Role)                        │ │   │
│  │  │ • Create, Edit, Delete buttons                     │ │   │
│  │  │ • Modal form for CRUD                              │ │   │
│  │  └────────────────────────────────────────────────────┘ │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              ↓                                    │
│                    axiosInstance                                 │
│                  (Bearer Token)                                  │
│                              ↓                                    │
└─────────────────────────────────────────────────────────────────┘
                              ↓
        ┌─────────────────────────────────────────┐
        │  BACKEND API (Spring Boot)              │
        │  8 REST Endpoints                       │
        │                                         │
        │  Workshops:                             │
        │  • GET    /api/workshops                │
        │  • POST   /api/workshops                │
        │  • PUT    /api/workshops/{id}           │
        │  • DELETE /api/workshops/{id}           │
        │                                         │
        │  Users:                                 │
        │  • GET    /api/users                    │
        │  • POST   /api/users                    │
        │  • PUT    /api/users/{id}               │
        │  • DELETE /api/users/{id}               │
        │                                         │
        │  All with: @PreAuthorize ADMIN          │
        └─────────────────────────────────────────┘
                              ↓
        ┌─────────────────────────────────────────┐
        │  DATABASE (MySQL)                       │
        │                                         │
        │  • workshops table                      │
        │  • users table                          │
        │  • (relationships)                      │
        └─────────────────────────────────────────┘
```

---

## 📊 Data Model

### Workshops
```
Workshop {
  id: Integer (Primary Key)
  title: String (required)
  description: String
  startDate: Date
  startTime: Time
  endTime: Time
  capacity: Integer
  instructor: String
  createdAt: DateTime
  updatedAt: DateTime
}
```

### Users
```
User {
  id: Integer (Primary Key)
  firstName: String (required)
  lastName: String (required)
  email: String (required, unique)
  role: Enum (PARTICIPANT, ADMIN, INSTRUCTOR)
  password: String
  createdAt: DateTime
  updatedAt: DateTime
}
```

---

## 🔄 API Call Flow

### Create Workshop Example
```
┌─────────────────────┐
│   Admin clicks      │
│  "New Workshop"     │
└──────────┬──────────┘
           │
           ↓
┌─────────────────────┐
│  Modal opens with   │
│   empty form        │
└──────────┬──────────┘
           │
           ↓
┌─────────────────────┐
│ Admin fills form:   │
│  • Title: Python101 │
│  • Date: 2025-12-15 │
│  • Capacity: 50     │
│  • Instructor: John │
└──────────┬──────────┘
           │
           ↓
┌─────────────────────┐
│  Admin clicks       │
│   "Create" button   │
└──────────┬──────────┘
           │
           ↓
┌─────────────────────────────────────────┐
│ Frontend validates (required fields)    │
└──────────┬──────────────────────────────┘
           │
           ↓
┌─────────────────────────────────────────┐
│ Frontend sends:                         │
│ POST /api/workshops                     │
│ Headers: Authorization: Bearer TOKEN    │
│ Body: {title, description, date, ...}   │
└──────────┬──────────────────────────────┘
           │
           ↓ (HTTP)
┌─────────────────────────────────────────┐
│ Backend receives request                │
│ • Validates token (401 if invalid)      │
│ • Checks @PreAuthorize ADMIN (403)      │
│ • Validates input data (400)            │
│ • Saves to database                     │
└──────────┬──────────────────────────────┘
           │
           ↓
┌─────────────────────────────────────────┐
│ Backend returns:                        │
│ Status: 201 Created                     │
│ Body: {id: 5, title, date, ...}        │
└──────────┬──────────────────────────────┘
           │
           ↓
┌─────────────────────────────────────────┐
│ Frontend:                               │
│ • Adds to workshops list                │
│ • Closes modal                          │
│ • Shows success message                 │
└──────────┬──────────────────────────────┘
           │
           ↓
┌─────────────────────┐
│  User sees new      │
│ workshop in table   │
└─────────────────────┘
```

---

## 🎯 Component Hierarchy

```
App
├─ BrowserRouter
│  └─ Routes
│     └─ DashboardLayout
│        └─ ProtectedRoute
│           └─ RoleGate (requires ADMIN)
│              └─ ErrorBoundary
│                 └─ AdminDashboard
│                    ├─ Tab Navigation
│                    ├─ Overview Tab
│                    │  ├─ Stats Cards
│                    │  └─ Quick Actions
│                    ├─ Workshops Tab
│                    │  ├─ Search Input
│                    │  ├─ Create Button
│                    │  └─ Workshop Table
│                    ├─ Participants Tab
│                    │  ├─ Search Input
│                    │  ├─ Create Button
│                    │  └─ Participants Table
│                    ├─ Workshop Modal
│                    │  └─ Form Fields
│                    └─ Participant Modal
│                       └─ Form Fields
```

---

## 📱 UI States

### Loading State
```
┌─────────────────────────────────────┐
│      Loading Workshops...            │
│                                      │
│              [Spinner]               │
│                                      │
│  If spinner doesn't disappear,      │
│  check browser console              │
└─────────────────────────────────────┘
```

### Empty State
```
┌─────────────────────────────────────┐
│  📚 No workshops yet                │
│                                      │
│  Browse upcoming workshops and       │
│  register to get started             │
└─────────────────────────────────────┘
```

### Error State
```
┌─────────────────────────────────────┐
│ ⚠️  Error loading workshops          │
│ Failed to fetch: 500 error           │
│ Check your backend server logs       │
│                                      │
│ [X] Dismiss                          │
└─────────────────────────────────────┘
```

### Normal State (with Data)
```
┌─────────────────────────────────────┐
│ Search: [____________________]       │
│                         [New Workshop]
├─────────────────────────────────────┤
│ Title      │ Instructor │ Date │ Cap│
├─────────────────────────────────────┤
│ Python 101 │ John Doe   │ ... │ 50 │[✏️][🗑️]
│ Advanced.. │ Jane Smith │ ... │ 40 │[✏️][🗑️]
└─────────────────────────────────────┘
```

---

## 🔐 Security Flow

```
Admin logs in
      ↓
Auth service issues JWT token
      ↓
Token stored in localStorage
      ↓
Admin navigates to /dashboard/admin
      ↓
RoleGate checks:
• Is user authenticated? (token exists)
• Does user have ADMIN role?
↓ Both yes ↓
AdminDashboard renders
      ↓
Admin makes API calls
      ↓
axiosInstance intercepts:
• Adds "Authorization: Bearer TOKEN" header
      ↓
Backend validates:
• Is token valid & not expired?
• Does user have ADMIN role?
• All input data valid?
↓ All yes ↓
Execute operation
      ↓
Return success (200/201) or error (4xx)
```

---

## 📋 CRUD Matrix

| Operation | Workshop | Participant | Endpoint | Method |
|-----------|----------|-------------|----------|--------|
| Create | ✅ Modal form | ✅ Modal form | POST /api/{resource} | POST |
| Read | ✅ Table view | ✅ Table view | GET /api/{resource} | GET |
| Update | ✅ Edit modal | ✅ Edit modal | PUT /api/{resource}/{id} | PUT |
| Delete | ✅ Confirm & delete | ✅ Confirm & delete | DELETE /api/{resource}/{id} | DELETE |
| Search | ✅ Real-time | ✅ Real-time | Frontend filter | - |

---

## 🎨 UI Components Breakdown

### Modal Form Components
```
Modal Header
├─ Title: "Create/Edit [Resource]"
└─ Close button (X)

Modal Body
├─ For Workshop:
│  ├─ Input: Title
│  ├─ Textarea: Description
│  ├─ Input: Start Date
│  ├─ Input: Start Time
│  ├─ Input: End Time
│  ├─ Input: Capacity
│  └─ Input: Instructor
│
└─ For Participant:
   ├─ Input: First Name
   ├─ Input: Last Name
   ├─ Input: Email
   └─ Select: Role

Modal Footer
├─ Cancel button
└─ Save/Update button
```

### Table Structure
```
Table Header
├─ Column 1: Title/Name
├─ Column 2: Instructor/Email
├─ Column 3: Date/Role
├─ Column N: ...
└─ Actions: Edit, Delete

Table Row (repeats)
├─ Data cells
└─ Action buttons
   ├─ ✏️  Edit (pencil icon)
   └─ 🗑️  Delete (trash icon)
```

---

## 📊 State Management

### AdminDashboard State
```javascript
{
  // Tab control
  activeTab: "overview" | "workshops" | "participants"
  
  // Global
  loading: boolean
  error: string | null
  
  // Workshops
  workshops: Workshop[]
  showWorkshopModal: boolean
  workshopFormData: {
    id, title, description, startDate,
    startTime, endTime, capacity, instructor
  }
  editingWorkshopId: number | null
  searchWorkshop: string
  
  // Participants
  participants: User[]
  showParticipantModal: boolean
  participantFormData: {
    id, firstName, lastName, email, role
  }
  editingParticipantId: number | null
  searchParticipant: string
}
```

---

## 🔄 Event Handlers

```
User Interactions
    ↓
├─ handleCreateWorkshop()      → showWorkshopModal = true
├─ handleEditWorkshop(item)    → populate form + show modal
├─ handleDeleteWorkshop(id)    → confirm → API call
├─ handleSaveWorkshop()        → validate → API call
├─ fetchWorkshops()            → API call → setWorkshops()
│
├─ handleCreateParticipant()   → showParticipantModal = true
├─ handleEditParticipant(item) → populate form + show modal
├─ handleDeleteParticipant(id) → confirm → API call
├─ handleSaveParticipant()     → validate → API call
└─ fetchParticipants()         → API call → setParticipants()
```

---

## 🚀 Deployment Architecture

```
Development
├─ Frontend: http://localhost:5173
├─ Backend: http://localhost:8080
└─ Database: localhost:3306

Staging
├─ Frontend: staging.app.com
├─ Backend: staging-api.app.com
└─ Database: staging-db.app.com

Production
├─ Frontend: app.com
├─ Backend: api.app.com
└─ Database: prod-db.app.com
```

---

## 📈 Request/Response Timeline

```
Admin Action → Frontend (ms) → Backend (ms) → Database (ms) → Response
    0              50           200           100             300
    ├──────────────┼────────────────────────┤
         Latency: Frontend         Backend Processing
```

**Typical Response Times:**
- Frontend validation: 5-10ms
- Network call: 50-100ms
- Backend processing: 50-200ms
- Database query: 20-100ms
- **Total:** 150-400ms

---

## 🎯 Success Metrics

### Frontend Ready When:
- ✅ Component compiles without errors
- ✅ All tabs render correctly
- ✅ Modals open/close properly
- ✅ Search filters work
- ✅ No console errors

### Backend Ready When:
- ✅ All 8 endpoints implemented
- ✅ All endpoints tested with Postman
- ✅ Authorization working (ADMIN check)
- ✅ Validation working (bad data rejected)
- ✅ Error messages properly formatted

### Integration Ready When:
- ✅ Frontend can create workshops
- ✅ Frontend can list workshops
- ✅ Frontend can edit workshops
- ✅ Frontend can delete workshops
- ✅ Same for participants
- ✅ Search works end-to-end
- ✅ Error handling works properly

---

## 🎓 Quick Reference

| Need | File |
|------|------|
| Want overview? | ADMIN_READY.md |
| Building backend? | ADMIN_BACKEND_REQUIREMENTS.md |
| Need quick lookup? | ADMIN_QUICK_REFERENCE.md |
| Planning Phase 2? | ADMIN_ADDITIONAL_FEATURES.md |
| Getting started? | ADMIN_DOCUMENTATION_INDEX.md |

---

This visual guide shows the complete architecture, data flow, and component structure of the Admin Dashboard system. Use it as a reference while implementing the backend.
