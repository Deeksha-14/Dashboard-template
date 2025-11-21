# Services Quick Setup Guide

## What Was Added

Three new service files have been created to handle all API communication:

### 1. **authService.js** - Authentication & Session
- `login(email, password)` - Authenticate user
- `register(userData)` - Create new account
- `logout()` - End session
- `getCurrentUser()` - Get stored user data
- `isAuthenticated()` - Check if logged in
- `hasRole(roles)` - Check user permissions
- `getToken()` - Get JWT token
- `isTokenValid()` - Verify token expiration

### 2. **workshopService.js** - Workshop Management
- `getAllWorkshops()` - Browse all workshops
- `getWorkshopsByParticipant(id)` - Get enrolled workshops
- `getUpcomingWorkshops()` - Get upcoming sessions
- `getCompletedWorkshops()` - Get finished workshops
- `searchByDateRange(start, end)` - Search by dates
- `addParticipant(workshopId, userId)` - Register for workshop
- `removeParticipant(workshopId, userId)` - Unenroll
- `createWorkshop()` / `updateWorkshop()` / `deleteWorkshop()` - Admin CRUD

### 3. **userService.js** - User Profile & Admin
- `getCurrentUserProfile()` - Get current user
- `updateProfile(data)` - Edit profile
- `updatePassword(current, new)` - Change password
- `getAllUsers()` - List all users (Admin)
- `searchUsers(query)` - Search users (Admin)
- `getAllParticipants()` - List participants (Admin)
- `deleteUser()` / `updateUser()` - Admin user management

---

## How to Use in Components

### Example 1: Fetch User's Workshops
```jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import workshopService from "../services/workshopService";

function MyWorkshops() {
  const { user } = useAuth();
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        const data = await workshopService.getWorkshopsByParticipant(user.id);
        setWorkshops(data);
      } catch (error) {
        console.error("Error:", error.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) fetchWorkshops();
  }, [user?.id]);

  if (loading) return <p>Loading...</p>;
  
  return (
    <div>
      {workshops.map(w => <div key={w.id}>{w.title}</div>)}
    </div>
  );
}
```

### Example 2: Register for Workshop
```jsx
import workshopService from "../services/workshopService";

async function handleRegister(workshopId) {
  try {
    await workshopService.addParticipant(workshopId, user.id);
    alert("Registered successfully!");
    // Refresh workshops list
  } catch (error) {
    alert(error.message);
  }
}
```

### Example 3: Login User
```jsx
import authService from "../services/authService";

async function handleLogin(email, password) {
  try {
    const userData = await authService.login(email, password);
    console.log(`Welcome ${userData.firstName}!`);
    // Redirect to dashboard
  } catch (error) {
    alert(error.message);
  }
}
```

---

## API Endpoints Summary

All endpoints require JWT token in Authorization header:
```
Authorization: Bearer {jwt_token}
```

### Auth Endpoints
- `POST /auth/login` - Login
- `POST /auth/register` - Register

### Workshop Endpoints
- `GET /workshops` - All workshops
- `GET /workshops/upcoming` - Upcoming only
- `GET /workshops/completed` - Completed only
- `GET /workshops/{id}` - Single workshop
- `GET /workshops/participant/{id}` - User's workshops
- `POST /workshops/{id}/participants` - Enroll
- `DELETE /workshops/{id}/participants/{id}` - Unenroll

### User Endpoints
- `GET /users/profile` - Current user profile
- `PUT /users/profile` - Update profile
- `GET /users/{id}` - User by ID
- `GET /users` - All users (paginated)
- `GET /users/role/PARTICIPANT` - All participants

---

## ParticipantDashboard Updates

The ParticipantDashboard now:
- ✅ Fetches real data from `workshopService`
- ✅ Gets enrolled workshops via `getWorkshopsByParticipant()`
- ✅ Gets upcoming workshops via `getUpcomingWorkshops()`
- ✅ Shows loading spinner while fetching
- ✅ Displays error alerts if API fails
- ✅ Allows registering for workshops with `addParticipant()`
- ✅ Shows empty states when no data available

---

## Environment Configuration

Update `src/components/services/axiosConfig.js` if backend URL changes:

```javascript
const API_BASE_URL = "http://localhost:8080/api"; // Change this if needed
```

---

## Error Handling Pattern

All services follow this pattern:

```javascript
try {
  // Call service method
  const data = await workshopService.getUpcomingWorkshops();
  // Use data
} catch (error) {
  // error.message is always a user-friendly string
  console.error(error.message);
  // Optionally check error.response for API details
  if (error.response?.status === 401) {
    // Unauthorized - redirect to login
  }
}
```

---

## What's Working Now

✅ JWT authentication & token management
✅ Login with credentials
✅ Register new account
✅ Protected routes by role
✅ Dashboard layout & navigation
✅ Participant dashboard with real workshop data
✅ Workshop enrollment/unenrollment
✅ Error handling & validation
✅ Automatic JWT attachment to all API calls

---

## Next Steps

1. **Admin Dashboard**: Integrate `userService.getAllUsers()` and `userService.getUserStatistics()`
2. **Workshop Detail Page**: Create component that uses `workshopService.getWorkshopById()`
3. **User Profile Page**: Build form that calls `userService.updateProfile()`
4. **Admin Participants Page**: List all with `userService.getAllParticipants()`
5. **Admin Workshops Page**: CRUD operations with `workshopService.createWorkshop()`, etc.
6. **Search Features**: Use `workshopService.searchByTitle()` and `userService.searchUsers()`

---

## Testing the Services

### Test Login
```javascript
import authService from "./components/services/authService";

// In browser console:
const user = await authService.login("test@example.com", "password123");
console.log(user);
```

### Test Workshop Fetch
```javascript
import workshopService from "./components/services/workshopService";

const workshops = await workshopService.getAllWorkshops();
console.log(workshops);
```

### Test Registration
```javascript
import authService from "./components/services/authService";

const newUser = await authService.register({
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  phoneNumber: "9876543210",
  password: "SecurePass123!"
});
console.log(newUser);
```

---

## File Locations

```
src/
├── components/
│   ├── services/
│   │   ├── axiosConfig.js          ← HTTP client
│   │   ├── authService.js          ← NEW: Authentication
│   │   ├── workshopService.js      ← NEW: Workshops
│   │   └── userService.js          ← NEW: Users
│   ├── auth/
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   └── layout/
│       ├── DashboardLayout.jsx
│       └── dashboard/
│           ├── adminDashboard/
│           │   └── AdminDashboard.jsx
│           └── participantsDashboard/
│               └── ParticipantDashboard.jsx
└── ...
```

---

## API Response DTO Types

### AuthResponseDTO
```javascript
{
  jwt: string,           // JWT token for authorization
  id: string,            // User ID
  email: string,         // User email
  firstName: string,     // First name
  lastName: string,      // Last name
  role: "ADMIN"|"PARTICIPANT"
}
```

### RegisterRequestDTO
```javascript
{
  firstName: string,     // Required
  middleName: string,    // Optional
  lastName: string,      // Required
  phoneNumber: string,   // 10-15 digits
  email: string,         // Unique, valid format
  password: string       // 8+ chars, special char required
}
```

### WorkshopDTO
```javascript
{
  id: number,
  title: string,
  description: string,
  startDate: string,     // ISO format
  endDate: string,       // ISO format
  startTime: string,     // HH:MM format
  endTime: string,
  location: string,
  instructor: string,
  capacity: number,
  enrolled: number,
  status: string         // "upcoming", "active", "completed"
}
```

---

## Troubleshooting

**Q: "Failed to fetch workshops" error?**
- Check if backend server is running on `http://localhost:8080`
- Verify JWT token is valid: `authService.isTokenValid()`
- Check browser console for network errors

**Q: 401 Unauthorized error?**
- Token may be expired
- Call `authService.logout()` and login again
- Check if token is being sent: Use browser DevTools Network tab

**Q: Components not updating after API call?**
- Ensure you're calling state setter: `setWorkshops(data)`
- Check if data is actually being returned
- Look for console errors

**Q: CORS errors?**
- Backend must allow requests from frontend origin
- Check backend CORS configuration

---

## Support

For issues with service integration, check:
1. Network tab in DevTools to see actual API responses
2. Console errors for detailed error messages
3. Backend logs for server-side issues
4. Verify JWT token hasn't expired
