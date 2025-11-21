# Quick Reference Guide - QACC Frontend

## Quick Start

### 1. Run Development Server
```bash
npm run dev
```

### 2. Build for Production
```bash
npm run build
```

### 3. Preview Production Build
```bash
npm preview
```

## Routes Quick Reference

### Public Routes
```
/               → Home page
/home           → Home page (same)
/login          → Login form
/auth/sign-in   → Login form (same)
/register       → Registration form
/auth/sign-up   → Registration form (same)
```

### Protected Routes (Require Authentication)
```
/dashboard                  → Redirects to role dashboard
/dashboard/admin            → Admin dashboard (ADMIN only)
/dashboard/participant      → Participant dashboard (PARTICIPANT only)
```

### Redirect on Unknown Route
```
/<anything-else> → /home
```

## Component Import Quick Reference

### Use Auth Context
```jsx
import { useAuth } from "./components/context/AuthContext";

function MyComponent() {
  const { user, login, logout, isAdmin } = useAuth();
  // user: { id, email, firstName, lastName, role }
  // isAdmin: boolean
}
```

### Use Axios (with JWT)
```jsx
import axiosInstance from "./components/services/axiosConfig";

// GET request
const response = await axiosInstance.get("/endpoint");

// POST request
const response = await axiosInstance.post("/endpoint", data);

// JWT is automatically attached!
```

### Protect Routes with RoleGate
```jsx
import RoleGate from "./RoleGate";

<RoleGate roles={["ADMIN"]}>
  <AdminComponent />
</RoleGate>
```

## Authentication Flow

### Login
1. User enters email + password
2. Axios POSTs to `/auth/login`
3. Backend returns JWT + user info
4. AuthContext stores in localStorage
5. Redirect to `/dashboard/{role}`

### Logout
1. Click logout button
2. AuthContext clears localStorage
3. Redirect to `/home`

### Session Persistence
1. Page refresh → AuthContext reads localStorage
2. JWT attached to next request automatically
3. No re-login needed

## Adding New Dashboard Routes

### Step 1: Update routes.config.jsx
```jsx
export const dashboardRoutes = [
  {
    name: "Participants",
    path: "participants",
    element: <ParticipantsPage />,
    roles: ["ADMIN"],
    icon: UserGroupIcon
  },
  {
    name: "Settings",
    path: "settings",
    element: <SettingsPage />,
    roles: ["ADMIN", "PARTICIPANT"],
    icon: Cog6ToothIcon
  }
];
```

### Step 2: Create Component
```jsx
// src/components/layout/dashboard/participants/ParticipantsPage.jsx
export default function ParticipantsPage() {
  const { user } = useAuth();
  
  return (
    <div className="w-full">
      <h1>Participants</h1>
      {/* Content */}
    </div>
  );
}
```

### Step 3: Route Auto-Generated
- Path: `/dashboard/participants`
- Sidebar: Shows for ADMIN role
- Permission: ADMIN only
- Layout: DashboardLayout + Sidebar + Navbar

## API Endpoints (Backend)

| Method | Endpoint | Request | Response |
|--------|----------|---------|----------|
| POST | /auth/login | LoginRequestDTO | AuthResponseDTO |
| POST | /auth/register | RegisterRequestDTO | {success: boolean} |
| GET | /auth/me | (Bearer token) | AuthResponseDTO |
| POST | /auth/logout | (Bearer token) | {success: boolean} |

## Common Tasks

### Display User Name
```jsx
const { user } = useAuth();
<p>{user?.firstName} {user?.lastName}</p>
```

### Check if Admin
```jsx
const { isAdmin } = useAuth();
if (isAdmin) { /* Show admin content */ }
```

### Make API Call
```jsx
const axiosInstance = require("./components/services/axiosConfig").default;

async function fetchData() {
  try {
    const response = await axiosInstance.get("/api/data");
    console.log(response.data);
  } catch (error) {
    console.error(error.response?.data?.message);
  }
}
```

### Logout
```jsx
const { logout } = useAuth();
const handleLogout = () => {
  logout();
  navigate("/home");
};
```

### Conditionally Render by Role
```jsx
const { user } = useAuth();

return (
  <>
    {user?.role === "ADMIN" && <AdminPanel />}
    {user?.role === "PARTICIPANT" && <ParticipantPanel />}
  </>
);
```

## Environment Variables

Create `.env` file:
```
VITE_API_URL=http://localhost:8080/api
```

Use in code:
```jsx
const baseURL = import.meta.env.VITE_API_URL;
```

## File Structure Summary

```
src/
├── App.jsx                          # Main router
├── RoleGate.jsx                     # Authorization wrapper
├── main.jsx                         # Entry point (context setup)
├── index.css                        # Tailwind
├── components/
│   ├── auth/                        # Login, Register
│   ├── context/                     # Auth state, Material UI provider
│   ├── layout/
│   │   ├── DashboardLayout.jsx      # Sidebar + Navbar + Outlet
│   │   ├── Home.jsx                 # Public home page
│   │   └── dashboard/
│   │       ├── adminDashboard/      # Admin dashboard page
│   │       └── participantsDashboard/ # Participant dashboard page
│   └── services/
│       └── axiosConfig.js           # Axios with JWT interceptor
└── routes.config.jsx                # Route definitions
```

## Styling

### Tailwind Classes Used
- `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3` - Responsive grid
- `shadow-md hover:shadow-lg` - Card shadows
- `rounded-lg p-6` - Card styling
- `flex items-center justify-between` - Layout
- `text-blue-600 font-bold` - Typography
- `bg-gradient-to-r from-blue-600 to-purple-600` - Gradients

### Material-Tailwind Components Used
- `Card` - Container
- `Typography` - Text
- `Button` - Clickable
- `Input` - Form input
- `Grid` - Layout
- `Progress` - Progress bar
- `Checkbox` - Checkbox
- `Table` - Data table

### Heroicons Used
- `UserGroupIcon` - Users
- `BookOpenIcon` - Courses
- `CalendarIcon` - Calendar
- `CodeBracketSquareIcon` - Code
- `ArrowRightOnRectangleIcon` - Logout
- `Cog6ToothIcon` - Settings

## Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| "useAuth must be used within AuthProvider" | Context not wrapped | Check main.jsx |
| "Cannot read property 'role' of null" | User not authenticated | Check login state |
| "Network error" | Backend unreachable | Check baseURL in axiosConfig.js |
| "Invalid credentials" | Wrong email/password | Try correct credentials |
| "Unauthorized" (401) | Token expired or invalid | Logout and login again |

## Development Tips

### Debug Authentication
```jsx
// Add to any component to see auth state
const { user } = useAuth();
console.log("Current user:", user);
console.log("Token:", localStorage.getItem("token"));
```

### Test Role-Based Access
1. Login as ADMIN: `/dashboard/admin` works
2. Try to access: `/dashboard/participant` → redirects to admin
3. Login as PARTICIPANT: `/dashboard/participant` works
4. Try to access: `/dashboard/admin` → redirects to participant

### Test Session Persistence
1. Login successfully
2. Open DevTools → Applications → LocalStorage
3. Verify `token` and `user` keys exist
4. Refresh page
5. Should still be logged in

### Test Logout
1. Click logout button
2. Verify localStorage is cleared
3. Try accessing /dashboard → redirects to /login

## Production Checklist

- [ ] Environment variables set correctly
- [ ] Backend API URL verified
- [ ] CORS enabled on backend
- [ ] JWT expiration configured
- [ ] Error handling comprehensive
- [ ] Loading states visible to users
- [ ] Responsive design tested on mobile
- [ ] Session timeout policy implemented
- [ ] Analytics/monitoring setup
- [ ] Security review completed

## Getting Help

1. Check AUTHENTICATION_GUIDE.md for detailed docs
2. Review inline comments in component files
3. Check browser console for error messages
4. Verify backend is running and accessible
5. Check localStorage for token/user data
6. Review Network tab in DevTools for API calls

## Useful Links

- React Router Docs: https://reactrouter.com/
- Tailwind CSS: https://tailwindcss.com/
- Material-Tailwind: https://www.material-tailwind.com/
- Axios: https://axios-http.com/
- JWT: https://jwt.io/

---

**Last Updated**: November 2025
**Version**: 1.0
