# QACC Web Frontend - JWT Authentication & Protected Routes Implementation Guide

## Overview

This document provides a complete overview of the JWT-based authentication system and role-based protected routes implemented in the QACC Web Frontend.

## Architecture

### 1. Authentication Flow

#### Login/Register → JWT Token → Axios Interceptor → Protected Routes

```
User Input
    ↓
Login/Register Components (axios request)
    ↓
Backend returns AuthResponseDTO with JWT
    ↓
AuthContext.login() stores JWT + user info
    ↓
Axios interceptor attaches JWT to all requests
    ↓
Protected routes check authentication & authorization
```

### 2. Project Structure

```
src/
├── App.jsx                          # Main router configuration
├── RoleGate.jsx                     # Role-based access control component
├── main.jsx                         # Entry point with context providers
├── components/
│   ├── auth/
│   │   ├── Login.jsx               # Login form with validation
│   │   └── Register.jsx            # Registration form with validation
│   ├── context/
│   │   ├── AuthContext.jsx         # Authentication state management
│   │   └── index.jsx               # Material Tailwind controller
│   ├── layout/
│   │   ├── DashboardLayout.jsx     # Shared dashboard layout (sidebar + navbar)
│   │   ├── Home/                   # Public home page
│   │   ├── Home.jsx                # Main home component
│   │   └── dashboard/
│   │       ├── adminDashboard/
│   │       │   └── AdminDashboard.jsx
│   │       └── participantsDashboard/
│   │           └── ParticipantDashboard.jsx
│   └── services/
│       └── axiosConfig.js          # Axios instance with JWT interceptors
├── routes.config.jsx               # Route configuration with roles
└── index.css                        # Tailwind CSS
```

## Components Explained

### 1. AuthContext.jsx - Core Authentication State

**Purpose**: Centralized JWT token and user state management

**Key Features**:
- JWT decoding to extract role information
- Handles multiple JWT payload structures (role as string/object/array)
- Persists token and user to localStorage
- Provides login/logout functions
- Automatically hydrates from localStorage on app load

**Usage**:
```jsx
import { useAuth } from "./components/context/AuthContext";

function MyComponent() {
  const { user, login, logout, isAdmin } = useAuth();
  
  if (!user) return <Navigate to="/login" />;
  
  return (
    <div>
      <p>User: {user.firstName} {user.lastName}</p>
      <p>Role: {user.role}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### 2. axiosConfig.js - Interceptor Setup

**Request Interceptor**:
```javascript
// Attaches JWT to every request
Authorization: Bearer <token>
```

**Response Interceptor**:
- Handles 401 Unauthorized (clears token from storage)
- Extracts refreshed tokens from response headers or body
- Maintains JWT in localStorage automatically

**Usage**:
```jsx
import axiosInstance from "../services/axiosConfig";

// JWT is automatically attached
const response = await axiosInstance.post("/auth/login", credentials);
```

### 3. RoleGate.jsx - Role-Based Access Control

**Purpose**: Component wrapper that enforces role-based access

**Features**:
- Checks user role against required roles
- Handles multiple role formats (string/object/array)
- Falls back to JWT token in localStorage if user not in context
- Redirects to login if no authentication
- Redirects to appropriate dashboard if role unauthorized

**Usage**:
```jsx
<RoleGate roles={["ADMIN"]}>
  <AdminDashboard />
</RoleGate>

<RoleGate roles={["PARTICIPANT"]}>
  <ParticipantDashboard />
</RoleGate>

<RoleGate roles={["ADMIN", "PARTICIPANT"]}>
  <CommonDashboard />
</RoleGate>
```

### 4. DashboardLayout.jsx - Shared Dashboard Shell

**Purpose**: Provides consistent layout for all dashboard pages

**Components**:
- **Sidebar**: Navigation with role-specific items, logout button
- **Topbar**: User info, logout button, responsive design
- **Main Content**: Outlet for nested routes, scrollable area

**Features**:
- Role-aware navigation (only shows routes user can access)
- Responsive design (sidebar hidden on mobile)
- User display name and role badge
- One-click logout with redirect to home

### 5. Login.jsx & Register.jsx

**Login Component**:
- Email validation (regex)
- Password field with show/hide toggle
- "Remember me" checkbox
- Server error handling
- Links to registration and forgot password
- On success: stores JWT + user, redirects to dashboard

**Register Component**:
- Multi-step validation
- Phone number validation (+<code> with 10-15 digits)
- Password strength meter
- Regex validation: `^(?=.*[A-Za-z])(?=.*\d).{8,}$`
- On success: redirects to login

**Features**:
- Real-time field validation on blur
- Error messages displayed per field
- Loading states during submission
- Server error feedback
- Disabled submit until form is valid

### 6. App.jsx - Central Router

**Public Routes**:
```
/home                - Home page (no auth required)
/                    - Redirects to /home
/login, /auth/sign-in - Login page
/register, /auth/sign-up - Register page
```

**Protected Routes**:
```
/dashboard/*         - All routes under dashboard are protected
  /admin             - Only accessible to ADMIN role
  /participant       - Only accessible to PARTICIPANT role
  (root)             - Redirects to role-specific dashboard
```

**Route Hierarchy**:
1. Check if user is authenticated (ProtectedRoute)
2. Check if user has required role (RoleGate)
3. Render the component or redirect

## Backend DTOs Reference

### LoginRequestDTO
```json
{
  "email": "string",
  "password": "string"
}
```

### RegisterRequestDTO
```json
{
  "firstName": "string",
  "middleName": "string",
  "lastName": "string",
  "phoneNumber": "string",
  "email": "string",
  "password": "string"
}
```

### AuthResponseDTO
```json
{
  "jwt": "string",
  "id": 0,
  "email": "string",
  "firstName": "string",
  "lastName": "string",
  "role": "ADMIN | PARTICIPANT"
}
```

**Backend URL**: `http://localhost:8080/api` (configured in axiosConfig.js)

## JWT Token Handling

### Storage
- **Location**: localStorage
- **Keys**: `token`, `user`
- **Structure**:
  - `token`: JWT string (raw token)
  - `user`: JSON stringified user object

### Token Lifecycle
1. **Login**: Backend returns JWT in AuthResponseDTO
2. **Storage**: AuthContext saves to localStorage
3. **Attachment**: Axios interceptor adds to requests
4. **Expiration**: Backend responds with 401 (interceptor clears storage)
5. **Logout**: AuthContext clears both keys

### JWT Payload Decoding
The AuthContext handles multiple JWT payload formats:
```javascript
// Supported formats:
{
  "role": "ADMIN"                    // Direct string
}
{
  "role": { "name": "ADMIN" }       // Nested object
}
{
  "roles": ["ADMIN"]                // Array of strings
}
{
  "authorities": ["ADMIN"]          // Authorities array
}
{
  "roleName": "ADMIN"               // Alternative key
}
```

## Workflow Examples

### Example 1: User Login Flow

```jsx
// 1. User fills login form
<Login />

// 2. onSubmit calls axiosInstance.post("/auth/login", form)
// Backend returns: { jwt: "...", id: 1, email: "...", role: "PARTICIPANT", ... }

// 3. AuthContext.login() is called with response data
login({ jwt: "...", id: 1, email: "...", role: "PARTICIPANT" });

// 4. AuthContext stores:
// localStorage.setItem("token", "...")
// localStorage.setItem("user", JSON.stringify({ ... }))

// 5. useAuth() now returns { user: { ... }, isAdmin: false }

// 6. Navigate to "/dashboard/participant" → DashboardLayout renders

// 7. ParticipantDashboard renders inside Outlet
```

### Example 2: Protected Route Access

```jsx
// 1. User navigates to /dashboard/admin

// 2. ProtectedRoute checks if user exists
if (!user) return <Navigate to="/auth/sign-in" />

// 3. Renders DashboardLayout (with sidebar, navbar)

// 4. RoleGate checks user.role vs required ["ADMIN"]
if (user.role !== "ADMIN") return <Navigate to="/dashboard/participant" />

// 5. AdminDashboard renders
```

### Example 3: Session Persistence

```jsx
// User closes browser and reopens app

// 1. main.jsx renders App
// 2. AuthContext useEffect checks localStorage
const token = localStorage.getItem("token");
const userInfo = localStorage.getItem("user");

// 3. Decodes JWT to extract role
const payload = decodeJwt(token);
const role = extractRoleFromPayload(payload);

// 4. Sets user state: { ...userInfo, role }
setUser(normalizedUser);
setIsAdmin(role === "ADMIN");

// 5. User is already authenticated, no re-login needed
// 6. Navigate to any dashboard route → works seamlessly
```

## Error Handling

### Authentication Errors

| Scenario | Handler | Result |
|----------|---------|--------|
| 401 Unauthorized | Axios interceptor | Clears token, user must re-login |
| Invalid credentials | Login component | Displays "Invalid credentials" error |
| Registration exists | Register component | Backend returns 400, displays message |
| Network error | Try-catch in component | Displays "Please check connection" |
| Expired token | Axios interceptor (401) | Redirects to /auth/sign-in |

### Common Issues & Solutions

**Issue**: "useAuth must be used within an AuthProvider"
- **Solution**: Ensure AuthProvider wraps your component tree (see main.jsx)

**Issue**: JWT not attached to requests
- **Solution**: Check axiosConfig.js interceptor, ensure token is in localStorage

**Issue**: Role not recognized after login
- **Solution**: Check JWT payload format, may need to adjust extractRoleFromPayload()

**Issue**: Infinite redirect loop
- **Solution**: Check ProtectedRoute conditions, ensure /auth/sign-in is not protected

## Security Considerations

### Best Practices Implemented

1. **JWT in localStorage** (with considerations):
   - No XSS protection in browser storage
   - Consider moving to httpOnly cookies for production
   - Implement CSRF protection

2. **Bearer Token Pattern**:
   ```
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. **Automatic Token Refresh** (placeholder ready):
   - Current: Manual logout on 401
   - Future: Implement refresh token rotation

4. **Role-Based Access Control**:
   - Frontend checks are UI conveniences
   - **Always verify roles in backend**
   - Backend should not trust client roles

### Production Recommendations

```javascript
// Recommended migration to httpOnly cookies:
// Instead of localStorage, use:
// 1. Backend sets Set-Cookie: jwt=...; HttpOnly; Secure; SameSite=Strict
// 2. Axios automatically includes in requests (credentials: "include")
// 3. Remove manual Authorization header logic

// Implement refresh token flow:
// 1. Access token (short-lived, 15min)
// 2. Refresh token (long-lived, 7 days)
// 3. On 401: Use refresh token to get new access token
// 4. If refresh fails: Clear tokens and redirect to login
```

## Testing the Implementation

### Test Scenarios

#### 1. Login with Valid Credentials
```
1. Navigate to /login
2. Enter: email: "test@example.com", password: "Test123"
3. Expected: Redirects to /dashboard/participant (or /dashboard/admin)
```

#### 2. Logout
```
1. Logged in as participant
2. Click Logout button
3. Expected: Redirected to /home, token cleared from localStorage
```

#### 3. Unauthorized Access
```
1. Logged in as PARTICIPANT
2. Try to access /dashboard/admin
3. Expected: Redirected to /dashboard/participant
```

#### 4. Session Persistence
```
1. Log in successfully
2. Close browser completely
3. Reopen and navigate to /dashboard
4. Expected: Still logged in without re-entering credentials
```

#### 5. Token Expiration (401)
```
1. Manually delete localStorage token
2. Make API request
3. Expected: Axios interceptor catches 401, clears storage
4. Next route navigation: Redirects to /login
```

## Production Deployment Checklist

- [ ] Set backend API URL from environment variables
- [ ] Configure CORS settings in backend
- [ ] Implement refresh token rotation
- [ ] Move JWT to httpOnly cookies
- [ ] Add request/response logging for debugging
- [ ] Implement proper error boundaries
- [ ] Add analytics for authentication events
- [ ] Set up automated token cleanup on app idle
- [ ] Configure helmet.js security headers
- [ ] Test with production-like data volumes
- [ ] Add monitoring for auth failures
- [ ] Document API contracts with backend team

## File Reference

| File | Purpose | Key Exports |
|------|---------|-------------|
| AuthContext.jsx | State management | useAuth, AuthProvider |
| axiosConfig.js | HTTP client | default (axiosInstance) |
| RoleGate.jsx | Authorization | default (RoleGate component) |
| DashboardLayout.jsx | Layout shell | default (DashboardLayout) |
| App.jsx | Routes | default (App) |
| Login.jsx | Auth UI | default (Login) |
| Register.jsx | Registration UI | default (Register) |
| routes.config.jsx | Route definitions | dashboardRoutes |

## Next Steps

1. **Connect to Backend**: Update `baseURL` in axiosConfig.js
2. **Test Integration**: Run npm run dev and test login flow
3. **Customize Dashboards**: Add real data/features to Admin & Participant dashboards
4. **Add More Routes**: Use routes.config.jsx to add new dashboard pages
5. **Implement Features**: Add API calls, data fetching, real-time updates
6. **Polish UI**: Refine styling, add animations, improve responsive design
7. **Security Audit**: Review with security team before production

## Contact & Support

For questions or issues with the authentication system, refer to the inline comments in each file or consult the backend API documentation.
