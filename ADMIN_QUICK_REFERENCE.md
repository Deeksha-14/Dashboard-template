# Admin Dashboard - Quick Reference

## Frontend Implementation Complete ✅

### AdminDashboard Features

**Three Main Tabs:**

1. **Overview Tab**
   - Statistics cards (Total Participants, Active Workshops, Completed, Platform Activity)
   - Quick action buttons (Create Workshop, Add Participant, Manage All)

2. **Workshops Tab**
   - Search workshops by title, description, or instructor
   - Table view of all workshops with columns: Title, Instructor, Start Date, Capacity
   - Create button opens modal form
   - Edit button (pencil icon) opens modal with pre-filled data
   - Delete button (trash icon) with confirmation dialog

3. **Participants Tab**
   - Search participants by name or email
   - Table view of all participants with columns: Name, Email, Role
   - Create button opens modal form
   - Edit button (pencil icon) opens modal with pre-filled data
   - Delete button (trash icon) with confirmation dialog

### Modal Forms

**Workshop Modal:**
- Workshop Title (text input)
- Description (textarea)
- Start Date (date input)
- Start Time (time input)
- End Time (time input)
- Capacity (number input)
- Instructor (text input)

**Participant Modal:**
- First Name (text input)
- Last Name (text input)
- Email (email input)
- Role (dropdown: PARTICIPANT, ADMIN, INSTRUCTOR)

### API Calls (Frontend)

All calls use `axiosInstance` with automatic Bearer token authentication.

**Workshops:**
```javascript
GET     /api/workshops                 // Fetch all
POST    /api/workshops                 // Create
PUT     /api/workshops/{id}            // Update
DELETE  /api/workshops/{id}            // Delete
```

**Users/Participants:**
```javascript
GET     /api/users                     // Fetch all
POST    /api/users                     // Create
PUT     /api/users/{id}                // Update
DELETE  /api/users/{id}                // Delete
```

---

## Backend Requirements ✅

See `ADMIN_BACKEND_REQUIREMENTS.md` for complete specifications.

### Key Endpoints to Implement

**Workshops (4 endpoints):**
1. `GET /api/workshops` - Get all workshops
2. `POST /api/workshops` - Create workshop
3. `PUT /api/workshops/{workshopId}` - Update workshop
4. `DELETE /api/workshops/{workshopId}` - Delete workshop

**Users (4 endpoints):**
1. `GET /api/users` - Get all users
2. `POST /api/users` - Create user
3. `PUT /api/users/{userId}` - Update user
4. `DELETE /api/users/{userId}` - Delete user

### Important Backend Requirements

- All endpoints require `@PreAuthorize("hasRole('ADMIN')")`
- Bearer token authentication required
- Use DTOs (WorkshopRequestDTO, WorkshopResponseDTO, UserRequestDTO, UserResponseDTO)
- Return proper HTTP status codes (200, 201, 400, 401, 403, 404, 500)
- Validate input data
- Handle errors gracefully

### Response Format

Success response:
```json
{
  "status": 200,
  "data": { /* data object or array */ },
  "message": "Operation successful"
}
```

Error response:
```json
{
  "status": 400,
  "message": "Validation failed",
  "errors": { /* field errors */ }
}
```

---

## Additional Features Implemented

### Error Handling
- Error alert displayed at top of page
- Auto-dismiss button (X icon)
- Specific error messages from backend passed to user

### Loading State
- Spinner shows while data is fetching
- Disabled state for form submission

### Search/Filter
- Real-time filtering as user types
- Case-insensitive search
- Searches across multiple fields (title, description, instructor for workshops; firstName, lastName, email for participants)

### Validation
- Frontend validation before submit (required fields)
- Backend should validate all inputs
- Confirmation dialogs for delete operations

### User Experience
- Responsive design (mobile, tablet, desktop)
- Hover effects on rows
- Loading spinners during operations
- Success/error feedback
- Modal dialogs for forms
- Clean, professional UI with Tailwind CSS

---

## File Structure

```
AdminDashboard.jsx
├── State Management
│   ├── Tab control (activeTab)
│   ├── Loading/Error states
│   ├── Workshop data (workshops, showWorkshopModal, workshopFormData, etc.)
│   └── Participant data (participants, showParticipantModal, participantFormData, etc.)
├── API Functions
│   ├── fetchWorkshops()
│   ├── handleCreateWorkshop()
│   ├── handleEditWorkshop()
│   ├── handleSaveWorkshop()
│   ├── handleDeleteWorkshop()
│   ├── fetchParticipants()
│   ├── handleCreateParticipant()
│   ├── handleEditParticipant()
│   ├── handleSaveParticipant()
│   └── handleDeleteParticipant()
├── Filter Functions
│   ├── filteredWorkshops
│   └── filteredParticipants
└── Render
    ├── Header
    ├── Error Alert
    ├── Tab Navigation
    ├── Overview Tab Content
    ├── Workshops Tab Content
    ├── Participants Tab Content
    ├── Workshop Modal
    └── Participant Modal
```

---

## Testing Checklist

### Frontend Testing

- [ ] Admin can view Overview tab with statistics
- [ ] Admin can view Workshops tab with all workshops
- [ ] Search works for workshops (title, description, instructor)
- [ ] Create Workshop button opens modal with empty form
- [ ] Edit Workshop button opens modal with pre-filled data
- [ ] Delete Workshop shows confirmation dialog
- [ ] Update Workshop saves changes and refreshes list
- [ ] Admin can view Participants tab with all users
- [ ] Search works for participants (firstName, lastName, email)
- [ ] Create Participant button opens modal with empty form
- [ ] Edit Participant button opens modal with pre-filled data
- [ ] Delete Participant shows confirmation dialog
- [ ] Update Participant saves changes and refreshes list
- [ ] Error messages display when API fails
- [ ] Loading spinner shows during data fetch

### Backend Testing (with Postman)

- [ ] GET /api/workshops returns 200 with workshop array
- [ ] POST /api/workshops creates and returns 201 with new workshop
- [ ] PUT /api/workshops/{id} updates and returns 200 with updated workshop
- [ ] DELETE /api/workshops/{id} returns 200
- [ ] GET /api/users returns 200 with user array
- [ ] POST /api/users creates and returns 201 with new user
- [ ] PUT /api/users/{id} updates and returns 200 with updated user
- [ ] DELETE /api/users/{id} returns 200
- [ ] All endpoints require ADMIN role (403 if not admin)
- [ ] All endpoints require valid Bearer token (401 if missing/invalid)

---

## Next Steps

1. **Backend Development:**
   - Implement the 8 required endpoints in WorkshopController and UserController
   - Update UserService and WorkshopService with CRUD methods
   - Add proper validation and error handling
   - Test each endpoint with Postman

2. **Testing:**
   - Test all endpoints individually
   - Test with invalid data/authentication
   - Test role-based access control

3. **Integration:**
   - Test frontend-backend integration
   - Verify search and filtering works end-to-end
   - Test CRUD operations end-to-end

4. **Optional Enhancements:**
   - Add pagination for large datasets
   - Add bulk delete functionality
   - Add export to CSV
   - Add audit logging
   - Add sorting by column headers
   - Add role-based visibility

---

## Code Examples

### Using the Admin Dashboard

Admin navigates to: `http://localhost:5173/dashboard/admin`

RoleGate checks for ADMIN role and displays dashboard.

### Creating a Workshop

1. Admin clicks "New Workshop" button
2. Modal opens with empty form
3. Admin fills in form fields
4. Admin clicks "Create" button
5. Frontend validates required fields
6. Frontend makes POST /api/workshops request
7. Backend validates and creates workshop
8. Frontend refreshes workshops list
9. Modal closes
10. Success message shown

### Editing a Participant

1. Admin finds participant in Participants tab
2. Admin clicks edit (pencil) icon
3. Modal opens with pre-filled data
4. Admin modifies fields
5. Admin clicks "Update" button
6. Frontend validates fields
7. Frontend makes PUT /api/users/{id} request
8. Backend validates and updates user
9. Frontend refreshes participants list
10. Modal closes
11. Success message shown

---

## Important Notes

⚠️ **Backend Security:**
- ALWAYS use @PreAuthorize("hasRole('ADMIN')") for admin endpoints
- ALWAYS validate user input on backend
- NEVER trust frontend validation alone
- ALWAYS use proper HTTP status codes
- ALWAYS return consistent response format

✅ **Frontend Features:**
- ✓ Automatic Bearer token injection via axios interceptor
- ✓ Real-time search/filter
- ✓ Error handling and user feedback
- ✓ Loading states
- ✓ Form validation
- ✓ Confirmation dialogs
- ✓ Responsive design
- ✓ Modal dialogs for forms
- ✓ Professional UI styling

📚 **Documentation:**
- See ADMIN_BACKEND_REQUIREMENTS.md for complete API specification
- See AdminDashboard.jsx for frontend implementation
- Use POSTMAN for API testing
