# Admin Dashboard Backend API Requirements

This document specifies all backend endpoints needed to support the new Admin Dashboard with full CRUD operations for workshops and participants.

## Overview

The Admin Dashboard has three main sections:
1. **Overview** - Statistics and quick actions
2. **Workshops Management** - CRUD operations for workshops with search
3. **Participants Management** - CRUD operations for users with search

---

## Workshops CRUD Endpoints

### 1. Get All Workshops
**Endpoint:** `GET /api/workshops`

**Authentication:** Required (Bearer token)

**Authorization:** ADMIN role

**Description:** Retrieve all workshops in the system

**Response:**
```json
{
  "status": 200,
  "data": [
    {
      "id": 1,
      "title": "Python 101",
      "description": "Introduction to Python programming",
      "startDate": "2025-12-15",
      "startTime": "10:00",
      "endTime": "12:00",
      "capacity": 50,
      "instructor": "John Doe",
      "createdAt": "2025-11-20T10:30:00",
      "updatedAt": "2025-11-20T10:30:00"
    },
    ...
  ],
  "message": "Workshops retrieved successfully"
}
```

**Error Responses:**
- `401 Unauthorized` - Invalid or missing token
- `403 Forbidden` - User lacks ADMIN role
- `500 Internal Server Error` - Server error

---

### 2. Create New Workshop
**Endpoint:** `POST /api/workshops`

**Authentication:** Required (Bearer token)

**Authorization:** ADMIN role

**Description:** Create a new workshop

**Request Body:**
```json
{
  "title": "Python 101",
  "description": "Introduction to Python programming",
  "startDate": "2025-12-15",
  "startTime": "10:00",
  "endTime": "12:00",
  "capacity": 50,
  "instructor": "John Doe"
}
```

**Validation Rules:**
- `title`: Required, max 255 characters
- `description`: Optional, max 1000 characters
- `startDate`: Required, valid date format (YYYY-MM-DD)
- `startTime`: Optional, valid time format (HH:mm)
- `endTime`: Optional, valid time format (HH:mm)
- `capacity`: Optional, positive integer
- `instructor`: Optional, max 255 characters

**Response:**
```json
{
  "status": 201,
  "data": {
    "id": 5,
    "title": "Python 101",
    "description": "Introduction to Python programming",
    "startDate": "2025-12-15",
    "startTime": "10:00",
    "endTime": "12:00",
    "capacity": 50,
    "instructor": "John Doe",
    "createdAt": "2025-11-20T15:45:00",
    "updatedAt": "2025-11-20T15:45:00"
  },
  "message": "Workshop created successfully"
}
```

**Error Responses:**
- `400 Bad Request` - Validation failed
- `401 Unauthorized` - Invalid or missing token
- `403 Forbidden` - User lacks ADMIN role
- `500 Internal Server Error` - Server error

---

### 3. Update Workshop
**Endpoint:** `PUT /api/workshops/{workshopId}`

**Authentication:** Required (Bearer token)

**Authorization:** ADMIN role

**Description:** Update an existing workshop

**Path Parameters:**
- `workshopId`: Integer ID of workshop to update

**Request Body:** (Same as Create, all fields optional)
```json
{
  "title": "Python 101 Advanced",
  "description": "Updated description",
  "startDate": "2025-12-16",
  "startTime": "14:00",
  "endTime": "16:00",
  "capacity": 40,
  "instructor": "Jane Smith"
}
```

**Response:**
```json
{
  "status": 200,
  "data": {
    "id": 5,
    "title": "Python 101 Advanced",
    "description": "Updated description",
    "startDate": "2025-12-16",
    "startTime": "14:00",
    "endTime": "16:00",
    "capacity": 40,
    "instructor": "Jane Smith",
    "createdAt": "2025-11-20T15:45:00",
    "updatedAt": "2025-11-20T16:30:00"
  },
  "message": "Workshop updated successfully"
}
```

**Error Responses:**
- `400 Bad Request` - Validation failed
- `401 Unauthorized` - Invalid or missing token
- `403 Forbidden` - User lacks ADMIN role
- `404 Not Found` - Workshop not found
- `500 Internal Server Error` - Server error

---

### 4. Delete Workshop
**Endpoint:** `DELETE /api/workshops/{workshopId}`

**Authentication:** Required (Bearer token)

**Authorization:** ADMIN role

**Description:** Delete a workshop

**Path Parameters:**
- `workshopId`: Integer ID of workshop to delete

**Response:**
```json
{
  "status": 200,
  "message": "Workshop deleted successfully"
}
```

**Error Responses:**
- `401 Unauthorized` - Invalid or missing token
- `403 Forbidden` - User lacks ADMIN role
- `404 Not Found` - Workshop not found
- `500 Internal Server Error` - Server error

---

## Users/Participants CRUD Endpoints

### 5. Get All Users
**Endpoint:** `GET /api/users`

**Authentication:** Required (Bearer token)

**Authorization:** ADMIN role

**Description:** Retrieve all users (participants, admins, instructors)

**Query Parameters (Optional):**
- `role`: Filter by role (PARTICIPANT, ADMIN, INSTRUCTOR)
- `search`: Search by firstName, lastName, or email

**Response:**
```json
{
  "status": 200,
  "data": [
    {
      "id": 1,
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "role": "PARTICIPANT",
      "createdAt": "2025-11-15T10:00:00",
      "updatedAt": "2025-11-15T10:00:00"
    },
    {
      "id": 2,
      "firstName": "Jane",
      "lastName": "Smith",
      "email": "jane@example.com",
      "role": "ADMIN",
      "createdAt": "2025-11-14T10:00:00",
      "updatedAt": "2025-11-14T10:00:00"
    },
    ...
  ],
  "message": "Users retrieved successfully"
}
```

**Error Responses:**
- `401 Unauthorized` - Invalid or missing token
- `403 Forbidden` - User lacks ADMIN role
- `500 Internal Server Error` - Server error

---

### 6. Create New User
**Endpoint:** `POST /api/users`

**Authentication:** Required (Bearer token)

**Authorization:** ADMIN role

**Description:** Create a new user/participant

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "role": "PARTICIPANT",
  "password": "SecurePassword123"
}
```

**Validation Rules:**
- `firstName`: Required, max 100 characters
- `lastName`: Required, max 100 characters
- `email`: Required, valid email format, unique
- `role`: Required, one of: PARTICIPANT, ADMIN, INSTRUCTOR
- `password`: Optional for admin creation, if provided must be min 8 characters

**Response:**
```json
{
  "status": 201,
  "data": {
    "id": 15,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "PARTICIPANT",
    "createdAt": "2025-11-20T15:45:00",
    "updatedAt": "2025-11-20T15:45:00"
  },
  "message": "User created successfully"
}
```

**Error Responses:**
- `400 Bad Request` - Validation failed or email already exists
- `401 Unauthorized` - Invalid or missing token
- `403 Forbidden` - User lacks ADMIN role
- `500 Internal Server Error` - Server error

---

### 7. Update User
**Endpoint:** `PUT /api/users/{userId}`

**Authentication:** Required (Bearer token)

**Authorization:** ADMIN role

**Description:** Update an existing user

**Path Parameters:**
- `userId`: Integer ID of user to update

**Request Body:** (All fields optional)
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "email": "john.smith@example.com",
  "role": "INSTRUCTOR",
  "password": "NewPassword123"
}
```

**Validation Rules:** (Same as Create)

**Response:**
```json
{
  "status": 200,
  "data": {
    "id": 15,
    "firstName": "John",
    "lastName": "Smith",
    "email": "john.smith@example.com",
    "role": "INSTRUCTOR",
    "createdAt": "2025-11-20T15:45:00",
    "updatedAt": "2025-11-20T16:30:00"
  },
  "message": "User updated successfully"
}
```

**Error Responses:**
- `400 Bad Request` - Validation failed
- `401 Unauthorized` - Invalid or missing token
- `403 Forbidden` - User lacks ADMIN role
- `404 Not Found` - User not found
- `500 Internal Server Error` - Server error

---

### 8. Delete User
**Endpoint:** `DELETE /api/users/{userId}`

**Authentication:** Required (Bearer token)

**Authorization:** ADMIN role

**Description:** Delete a user

**Path Parameters:**
- `userId`: Integer ID of user to delete

**Response:**
```json
{
  "status": 200,
  "message": "User deleted successfully"
}
```

**Error Responses:**
- `401 Unauthorized` - Invalid or missing token
- `403 Forbidden` - User lacks ADMIN role
- `404 Not Found` - User not found
- `500 Internal Server Error` - Server error

---

## Backend Implementation Checklist

### Database Schema Requirements

**workshops Table:**
```sql
CREATE TABLE workshops (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  start_date DATE,
  start_time TIME,
  end_time TIME,
  capacity INT,
  instructor VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**users Table (update existing):**
```sql
-- Ensure these fields exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS first_name VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_name VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS role ENUM('PARTICIPANT', 'ADMIN', 'INSTRUCTOR') DEFAULT 'PARTICIPANT';
```

### Spring Boot Implementation

**1. Create DTOs:**
```java
// WorkshopRequestDTO
@Data
public class WorkshopRequestDTO {
    private String title;
    private String description;
    private LocalDate startDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private Integer capacity;
    private String instructor;
}

// WorkshopResponseDTO
@Data
public class WorkshopResponseDTO {
    private Integer id;
    private String title;
    private String description;
    private LocalDate startDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private Integer capacity;
    private String instructor;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

// UserRequestDTO
@Data
public class UserRequestDTO {
    private String firstName;
    private String lastName;
    private String email;
    private String role;
    private String password;
}

// UserResponseDTO
@Data
public class UserResponseDTO {
    private Integer id;
    private String firstName;
    private String lastName;
    private String email;
    private String role;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
```

**2. Update UserController:**
```java
@RestController
@RequestMapping("/api/users")
@PreAuthorize("hasRole('ADMIN')")
public class UserController {
    
    @GetMapping
    public ResponseEntity<?> getAllUsers() {
        // Return list of UserResponseDTO
    }
    
    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody UserRequestDTO request) {
        // Create and return UserResponseDTO
    }
    
    @PutMapping("/{userId}")
    public ResponseEntity<?> updateUser(@PathVariable Integer userId, @RequestBody UserRequestDTO request) {
        // Update and return UserResponseDTO
    }
    
    @DeleteMapping("/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable Integer userId) {
        // Delete user
    }
}
```

**3. Update WorkshopController:**
```java
@RestController
@RequestMapping("/api/workshops")
public class WorkshopController {
    
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllWorkshops() {
        // Return list of WorkshopResponseDTO
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createWorkshop(@RequestBody WorkshopRequestDTO request) {
        // Create and return WorkshopResponseDTO
    }
    
    @PutMapping("/{workshopId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateWorkshop(@PathVariable Integer workshopId, @RequestBody WorkshopRequestDTO request) {
        // Update and return WorkshopResponseDTO
    }
    
    @DeleteMapping("/{workshopId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteWorkshop(@PathVariable Integer workshopId) {
        // Delete workshop
    }
}
```

**4. Service Layer Implementation:**

**UserService Interface:**
```java
public interface UserService {
    List<UserResponseDTO> getAllUsers();
    UserResponseDTO createUser(UserRequestDTO request);
    UserResponseDTO updateUser(Integer userId, UserRequestDTO request);
    void deleteUser(Integer userId);
    UserResponseDTO getUserById(Integer userId);
}
```

**WorkshopService Interface:**
```java
public interface WorkshopService {
    List<WorkshopResponseDTO> getAllWorkshops();
    WorkshopResponseDTO createWorkshop(WorkshopRequestDTO request);
    WorkshopResponseDTO updateWorkshop(Integer workshopId, WorkshopRequestDTO request);
    void deleteWorkshop(Integer workshopId);
    WorkshopResponseDTO getWorkshopById(Integer workshopId);
}
```

---

## Frontend Features Implemented

The Admin Dashboard supports:

1. **Overview Tab:**
   - Display statistics cards
   - Quick action buttons for creating workshops and participants
   - Link to manage all items

2. **Workshops Tab:**
   - List all workshops in table format
   - Search workshops by title, description, or instructor
   - Edit existing workshops
   - Delete workshops with confirmation
   - Create new workshops via modal form

3. **Participants Tab:**
   - List all users/participants in table format
   - Search participants by name or email
   - Edit existing participants
   - Delete participants with confirmation
   - Add new participants via modal form

---

## API Request/Response Workflow

### Example: Create Workshop Flow

**Frontend:**
```javascript
const workshopData = {
  title: "Python 101",
  description: "Introduction to Python",
  startDate: "2025-12-15",
  startTime: "10:00",
  endTime: "12:00",
  capacity: 50,
  instructor: "John Doe"
};

await axiosInstance.post("/workshops", workshopData);
```

**Backend:**
1. Receive POST request at `POST /api/workshops`
2. Validate data with @Valid annotation
3. Check ADMIN role with @PreAuthorize
4. Save to database
5. Return 201 with created WorkshopResponseDTO

**Frontend:**
```javascript
// In handleSaveWorkshop()
await axiosInstance.post("/workshops", workshopFormData);
// On success: refresh workshops list, close modal, show success
// On error: display error message to admin
```

---

## Error Handling Standards

All endpoints should follow this error response format:

```json
{
  "status": 400,
  "message": "Validation failed",
  "errors": {
    "email": "Email already exists",
    "title": "Title is required"
  }
}
```

**Status Codes:**
- `200` - Success (GET, PUT, DELETE)
- `201` - Created (POST)
- `400` - Bad Request (Validation error)
- `401` - Unauthorized (Missing/invalid token)
- `403` - Forbidden (Insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

## Implementation Priority

1. **Phase 1 (Essential):**
   - [ ] GET /api/workshops
   - [ ] POST /api/workshops
   - [ ] PUT /api/workshops/{id}
   - [ ] DELETE /api/workshops/{id}
   - [ ] GET /api/users
   - [ ] POST /api/users
   - [ ] PUT /api/users/{id}
   - [ ] DELETE /api/users/{id}

2. **Phase 2 (Optional Enhancements):**
   - [ ] Search/filter endpoints
   - [ ] Pagination support
   - [ ] Bulk operations (delete multiple)
   - [ ] Role-based user listing

---

## Testing Endpoints with Postman

**Create Workshop:**
```
POST http://localhost:8080/api/workshops
Headers: Authorization: Bearer <token>
Body: {
  "title": "Python 101",
  "description": "Intro to Python",
  "startDate": "2025-12-15",
  "startTime": "10:00",
  "endTime": "12:00",
  "capacity": 50,
  "instructor": "John Doe"
}
```

**Get All Workshops:**
```
GET http://localhost:8080/api/workshops
Headers: Authorization: Bearer <token>
```

**Update Workshop:**
```
PUT http://localhost:8080/api/workshops/1
Headers: Authorization: Bearer <token>
Body: { "title": "Updated Title" }
```

**Delete Workshop:**
```
DELETE http://localhost:8080/api/workshops/1
Headers: Authorization: Bearer <token>
```

---

## Notes

- All endpoints require authentication via Bearer token
- Admin endpoints require `@PreAuthorize("hasRole('ADMIN')")` annotation
- Use consistent naming conventions (camelCase in Java, snake_case in database)
- Implement proper error handling and validation
- Add @CrossOrigin(origins = "http://localhost:5173") for CORS
- Use DTOs to separate internal models from API responses
- Log all CRUD operations for audit trail
