# Service Integration Guide

## Overview

This document details the service layer architecture and integration with the React frontend components. All services handle API communication with the backend server at `http://localhost:8080/api`.

---

## Service Files Structure

```
src/components/services/
├── axiosConfig.js          # Axios instance with JWT interceptors
├── authService.js          # Authentication operations
├── workshopService.js      # Workshop CRUD & participant management
└── userService.js          # User profile & admin operations
```

---

## 1. Authentication Service (`authService.js`)

Handles all authentication-related operations including login, registration, and session management.

### Methods

#### `login(email, password)`
- **Purpose**: Authenticate user with email and password
- **Parameters**:
  - `email` (string): User email
  - `password` (string): User password
- **Returns**: `Promise<AuthResponseDTO>`
- **API Endpoint**: `POST /auth/login`
- **Response Structure**:
  ```javascript
  {
    jwt: "eyJhbGc...", // JWT token
    id: "user-id",
    email: "user@example.com",
    firstName: "John",
    lastName: "Doe",
    role: "PARTICIPANT"
  }
  ```
- **Usage**:
  ```javascript
  const data = await authService.login("user@example.com", "password");
  ```

#### `register(userData)`
- **Purpose**: Register new user
- **Parameters**: `RegisterRequestDTO`
  ```javascript
  {
    firstName: "John",
    middleName: "Q",           // optional
    lastName: "Doe",
    phoneNumber: "9876543210", // 10-15 digits
    email: "john@example.com",
    password: "SecurePass123!" // 8+ chars, uppercase, lowercase, number, special char
  }
  ```
- **Returns**: `Promise<AuthResponseDTO>`
- **API Endpoint**: `POST /auth/register`
- **Auto-login**: Automatically stores JWT on successful registration
- **Usage**:
  ```javascript
  const user = await authService.register({
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phoneNumber: "9876543210",
    password: "SecurePass123!"
  });
  ```

#### `logout()`
- **Purpose**: Clear user session
- **Returns**: `void`
- **Clears**: localStorage token and user data
- **Usage**:
  ```javascript
  authService.logout();
  ```

#### `getCurrentUser()`
- **Purpose**: Retrieve stored user from localStorage
- **Returns**: `Object | null`
- **Usage**:
  ```javascript
  const user = authService.getCurrentUser();
  if (user?.id) {
    console.log(`Logged in as ${user.firstName}`);
  }
  ```

#### `isAuthenticated()`
- **Purpose**: Check if user has valid JWT
- **Returns**: `boolean`
- **Usage**:
  ```javascript
  if (authService.isAuthenticated()) {
    // User is logged in
  }
  ```

#### `hasRole(roles)`
- **Purpose**: Check if current user has specific role(s)
- **Parameters**: `string | string[]`
- **Returns**: `boolean`
- **Valid Roles**: `"ADMIN"`, `"PARTICIPANT"`
- **Usage**:
  ```javascript
  if (authService.hasRole("ADMIN")) {
    // Show admin panel
  }
  if (authService.hasRole(["ADMIN", "MODERATOR"])) {
    // User has one of the roles
  }
  ```

#### `getToken()`
- **Purpose**: Retrieve JWT token
- **Returns**: `string | null`
- **Usage**:
  ```javascript
  const token = authService.getToken();
  ```

#### `isTokenValid()`
- **Purpose**: Verify token expiration
- **Returns**: `boolean`
- **Usage**:
  ```javascript
  if (!authService.isTokenValid()) {
    authService.logout();
  }
  ```

---

## 2. Workshop Service (`workshopService.js`)

Handles all workshop-related operations including CRUD, search, and participant management.

### Methods

#### `getAllWorkshops()`
- **Purpose**: Fetch all available workshops
- **Returns**: `Promise<Array>`
- **API Endpoint**: `GET /workshops`
- **Response**: Array of workshop objects
- **Usage**:
  ```javascript
  const workshops = await workshopService.getAllWorkshops();
  ```

#### `getWorkshopsByParticipant(participantId)`
- **Purpose**: Get workshops enrolled by specific participant
- **Parameters**:
  - `participantId` (string|number): User ID
- **Returns**: `Promise<Array>`
- **API Endpoint**: `GET /workshops/participant/{participantId}`
- **Usage**:
  ```javascript
  const enrolled = await workshopService.getWorkshopsByParticipant(user.id);
  ```

#### `searchByDateRange(startDate, endDate)`
- **Purpose**: Find workshops within date range
- **Parameters**:
  - `startDate` (string): ISO format "YYYY-MM-DD"
  - `endDate` (string): ISO format "YYYY-MM-DD"
- **Returns**: `Promise<Array>`
- **API Endpoint**: `GET /workshops/search?startDate={startDate}&endDate={endDate}`
- **Usage**:
  ```javascript
  const workshops = await workshopService.searchByDateRange(
    "2026-01-01",
    "2026-12-31"
  );
  ```

#### `searchByTitle(title)`
- **Purpose**: Search workshops by partial title match
- **Parameters**:
  - `title` (string): Partial workshop title
- **Returns**: `Promise<Array>`
- **API Endpoint**: `GET /workshops/search/title?title={title}`
- **Usage**:
  ```javascript
  const results = await workshopService.searchByTitle("Quantum");
  ```

#### `getWorkshopById(workshopId)`
- **Purpose**: Get detailed workshop information
- **Parameters**:
  - `workshopId` (string|number): Workshop ID
- **Returns**: `Promise<Object>`
- **API Endpoint**: `GET /workshops/{workshopId}`
- **Usage**:
  ```javascript
  const details = await workshopService.getWorkshopById(123);
  ```

#### `addParticipant(workshopId, participantId)`
- **Purpose**: Enroll user in workshop
- **Parameters**:
  - `workshopId` (string|number): Workshop ID
  - `participantId` (string|number): User ID
- **Returns**: `Promise<Object>`
- **API Endpoint**: `POST /workshops/{workshopId}/participants`
- **Body**: `{ participantId }`
- **Usage**:
  ```javascript
  await workshopService.addParticipant(workshop.id, user.id);
  ```

#### `removeParticipant(workshopId, participantId)`
- **Purpose**: Unenroll user from workshop
- **Parameters**:
  - `workshopId` (string|number): Workshop ID
  - `participantId` (string|number): User ID
- **Returns**: `Promise<Object>`
- **API Endpoint**: `DELETE /workshops/{workshopId}/participants/{participantId}`
- **Usage**:
  ```javascript
  await workshopService.removeParticipant(workshop.id, user.id);
  ```

#### `getActiveWorkshops()`
- **Purpose**: Get currently ongoing workshops
- **Returns**: `Promise<Array>`
- **API Endpoint**: `GET /workshops/active`
- **Usage**:
  ```javascript
  const active = await workshopService.getActiveWorkshops();
  ```

#### `getUpcomingWorkshops()`
- **Purpose**: Get workshops not yet started
- **Returns**: `Promise<Array>`
- **API Endpoint**: `GET /workshops/upcoming`
- **Usage**:
  ```javascript
  const upcoming = await workshopService.getUpcomingWorkshops();
  ```

#### `getCompletedWorkshops()`
- **Purpose**: Get finished workshops
- **Returns**: `Promise<Array>`
- **API Endpoint**: `GET /workshops/completed`
- **Usage**:
  ```javascript
  const completed = await workshopService.getCompletedWorkshops();
  ```

#### `getWorkshopParticipants(workshopId)`
- **Purpose**: Get list of participants in a workshop (Admin)
- **Parameters**:
  - `workshopId` (string|number): Workshop ID
- **Returns**: `Promise<Array>`
- **API Endpoint**: `GET /workshops/{workshopId}/participants`
- **Usage**:
  ```javascript
  const participants = await workshopService.getWorkshopParticipants(123);
  ```

#### `createWorkshop(workshopData)` (Admin)
- **Purpose**: Create new workshop
- **Parameters**: Workshop data object
- **Returns**: `Promise<Object>`
- **API Endpoint**: `POST /workshops`
- **Usage**:
  ```javascript
  const newWorkshop = await workshopService.createWorkshop({
    title: "New Workshop",
    description: "...",
    startDate: "2026-01-15",
    endDate: "2026-01-17"
  });
  ```

#### `updateWorkshop(workshopId, updates)` (Admin)
- **Purpose**: Update workshop details
- **Parameters**:
  - `workshopId` (string|number): Workshop ID
  - `updates` (Object): Fields to update
- **Returns**: `Promise<Object>`
- **API Endpoint**: `PUT /workshops/{workshopId}`
- **Usage**:
  ```javascript
  const updated = await workshopService.updateWorkshop(123, {
    title: "Updated Title",
    description: "New description"
  });
  ```

#### `deleteWorkshop(workshopId)` (Admin)
- **Purpose**: Delete workshop
- **Parameters**:
  - `workshopId` (string|number): Workshop ID
- **Returns**: `Promise<Object>`
- **API Endpoint**: `DELETE /workshops/{workshopId}`
- **Usage**:
  ```javascript
  await workshopService.deleteWorkshop(123);
  ```

---

## 3. User Service (`userService.js`)

Handles user profile management and admin operations.

### Methods

#### `getCurrentUserProfile()`
- **Purpose**: Get current logged-in user's profile
- **Returns**: `Promise<Object>`
- **API Endpoint**: `GET /users/profile`
- **Usage**:
  ```javascript
  const profile = await userService.getCurrentUserProfile();
  ```

#### `getUserById(userId)`
- **Purpose**: Get specific user data
- **Parameters**:
  - `userId` (string|number): User ID
- **Returns**: `Promise<Object>`
- **API Endpoint**: `GET /users/{userId}`
- **Usage**:
  ```javascript
  const user = await userService.getUserById(456);
  ```

#### `updateProfile(userData)`
- **Purpose**: Update current user's profile
- **Parameters**: User data object
  ```javascript
  {
    firstName: "John",
    lastName: "Doe",
    phoneNumber: "9876543210",
    email: "john@example.com"
    // ... other fields
  }
  ```
- **Returns**: `Promise<Object>`
- **API Endpoint**: `PUT /users/profile`
- **Auto-updates**: localStorage with new user data
- **Usage**:
  ```javascript
  const updated = await userService.updateProfile({
    firstName: "Johnny",
    lastName: "Doe"
  });
  ```

#### `updatePassword(currentPassword, newPassword)`
- **Purpose**: Change user password
- **Parameters**:
  - `currentPassword` (string): Current password
  - `newPassword` (string): New password (must meet validation)
- **Returns**: `Promise<Object>`
- **API Endpoint**: `PUT /users/password`
- **Usage**:
  ```javascript
  await userService.updatePassword("oldPass123!", "newPass456!");
  ```

#### `getAllUsers(params)` (Admin)
- **Purpose**: Get paginated list of all users
- **Parameters** (optional):
  - `page` (number): Page number
  - `limit` (number): Items per page
  - `role` (string): Filter by role
  - `status` (string): Filter by status
- **Returns**: `Promise<Object>` with pagination info
- **API Endpoint**: `GET /users?page=1&limit=10`
- **Usage**:
  ```javascript
  const result = await userService.getAllUsers({
    page: 1,
    limit: 20,
    role: "PARTICIPANT"
  });
  ```

#### `searchUsers(query)` (Admin)
- **Purpose**: Search users by name or email
- **Parameters**:
  - `query` (string): Search term
- **Returns**: `Promise<Array>`
- **API Endpoint**: `GET /users/search?query={query}`
- **Usage**:
  ```javascript
  const results = await userService.searchUsers("john");
  ```

#### `getAllParticipants()` (Admin)
- **Purpose**: Get all participants
- **Returns**: `Promise<Array>`
- **API Endpoint**: `GET /users/role/PARTICIPANT`
- **Usage**:
  ```javascript
  const participants = await userService.getAllParticipants();
  ```

#### `getAllAdmins()` (Admin)
- **Purpose**: Get all admins
- **Returns**: `Promise<Array>`
- **API Endpoint**: `GET /users/role/ADMIN`
- **Usage**:
  ```javascript
  const admins = await userService.getAllAdmins();
  ```

#### `updateUser(userId, updates)` (Admin)
- **Purpose**: Update user data
- **Parameters**:
  - `userId` (string|number): User ID
  - `updates` (Object): Fields to update
- **Returns**: `Promise<Object>`
- **API Endpoint**: `PUT /users/{userId}`
- **Usage**:
  ```javascript
  await userService.updateUser(456, {
    firstName: "Updated",
    status: "inactive"
  });
  ```

#### `deleteUser(userId)` (Admin)
- **Purpose**: Delete user account
- **Parameters**:
  - `userId` (string|number): User ID
- **Returns**: `Promise<Object>`
- **API Endpoint**: `DELETE /users/{userId}`
- **Usage**:
  ```javascript
  await userService.deleteUser(456);
  ```

#### `getUserStatistics()` (Admin)
- **Purpose**: Get user analytics
- **Returns**: `Promise<Object>`
- **API Endpoint**: `GET /users/statistics`
- **Usage**:
  ```javascript
  const stats = await userService.getUserStatistics();
  ```

#### `getActiveUsers()` (Admin)
- **Purpose**: Get all active users
- **Returns**: `Promise<Array>`
- **API Endpoint**: `GET /users/status/active`
- **Usage**:
  ```javascript
  const active = await userService.getActiveUsers();
  ```

#### `getInactiveUsers()` (Admin)
- **Purpose**: Get all inactive users
- **Returns**: `Promise<Array>`
- **API Endpoint**: `GET /users/status/inactive`
- **Usage**:
  ```javascript
  const inactive = await userService.getInactiveUsers();
  ```

#### `getUserActivityLogs(userId)` (Admin)
- **Purpose**: Get user activity history
- **Parameters**:
  - `userId` (string|number): User ID
- **Returns**: `Promise<Array>`
- **API Endpoint**: `GET /users/{userId}/activity`
- **Usage**:
  ```javascript
  const logs = await userService.getUserActivityLogs(456);
  ```

#### `bulkUpdateUsers(userIds, updates)` (Admin)
- **Purpose**: Update multiple users
- **Parameters**:
  - `userIds` (Array): Array of user IDs
  - `updates` (Object): Fields to update
- **Returns**: `Promise<Object>`
- **API Endpoint**: `PUT /users/bulk`
- **Usage**:
  ```javascript
  await userService.bulkUpdateUsers([1, 2, 3], { status: "active" });
  ```

#### `bulkDeleteUsers(userIds)` (Admin)
- **Purpose**: Delete multiple users
- **Parameters**:
  - `userIds` (Array): Array of user IDs
- **Returns**: `Promise<Object>`
- **API Endpoint**: `DELETE /users/bulk`
- **Usage**:
  ```javascript
  await userService.bulkDeleteUsers([1, 2, 3]);
  ```

---

## 4. Axios Configuration (`axiosConfig.js`)

Central HTTP client with automatic JWT attachment and error handling.

### Features

**Request Interceptor**:
- Automatically attaches JWT token to all requests
- Header: `Authorization: Bearer {jwt}`

**Response Interceptor**:
- Extracts JWT from response headers or body
- Persists token to localStorage
- Handles 401 errors (unauthorized)
- Clears session on token expiration

### Usage

```javascript
import axiosInstance from "./axiosConfig";

// GET request
const data = await axiosInstance.get("/endpoint");

// POST request
const result = await axiosInstance.post("/endpoint", { data });

// PUT request
const updated = await axiosInstance.put("/endpoint/{id}", { data });

// DELETE request
await axiosInstance.delete("/endpoint/{id}");
```

---

## Error Handling

All service methods implement consistent error handling:

```javascript
try {
  const data = await workshopService.getAllWorkshops();
} catch (error) {
  console.error(error.message);
  // error.message is user-friendly
  // error.response contains API error details
}
```

### Common Error Messages

| Error | Cause |
|-------|-------|
| "Login failed. Please check your credentials." | Invalid email/password |
| "Registration failed. Please check your details." | Validation error or duplicate user |
| "Failed to fetch workshops" | Network or server error |
| "Failed to enroll in workshop" | Already enrolled or invalid ID |

---

## Integration Example

### Participant Dashboard with Real Data

```javascript
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import workshopService from "../services/workshopService";

export default function Dashboard() {
  const { user } = useAuth();
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        const data = await workshopService.getWorkshopsByParticipant(user.id);
        setWorkshops(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkshops();
  }, [user.id]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {workshops.map((workshop) => (
        <div key={workshop.id}>{workshop.title}</div>
      ))}
    </div>
  );
}
```

---

## Best Practices

1. **Always handle errors**: Wrap service calls in try-catch
2. **Check authentication**: Use `authService.isAuthenticated()` before API calls
3. **Store user data**: Use `authService.getCurrentUser()` instead of local state
4. **Use loading states**: Show spinners while fetching data
5. **Implement pagination**: Use `limit` and `page` parameters for large datasets
6. **Validate input**: Check data before sending to API
7. **Clear sensitive data**: Call `authService.logout()` when needed

---

## API Response Format

### Success Response
```javascript
{
  "success": true,
  "data": { /* actual data */ },
  "message": "Operation successful"
}
```

### Error Response
```javascript
{
  "success": false,
  "error": "Error code",
  "message": "Human-readable error message"
}
```

---

## Validation Rules

### Password Requirements
- Minimum 8 characters
- At least 1 uppercase letter (A-Z)
- At least 1 lowercase letter (a-z)
- At least 1 number (0-9)
- At least 1 special character (!@#$%^&*)

### Phone Number
- 10-15 digits
- Must be numeric only

### Email
- Valid email format (RFC 5322)
- Must be unique

---

## Next Steps

After service integration:

1. Create component pages for each dashboard section
2. Implement real data fetching in all dashboard components
3. Add loading and error states to components
4. Create detail/edit pages for workshops and user profiles
5. Implement search and filter functionality
6. Add pagination for large datasets
7. Create admin management interfaces
