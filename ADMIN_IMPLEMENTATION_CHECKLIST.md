# Admin Dashboard - Implementation Checklist

## 🎯 Pre-Implementation Checklist

### Verify Prerequisites
- [ ] Java/Spring Boot environment set up
- [ ] MySQL database running and accessible
- [ ] Frontend running on http://localhost:5173
- [ ] Backend running on http://localhost:8080
- [ ] Node.js and npm installed
- [ ] Postman installed for API testing
- [ ] Git repository configured

### Verify Database
- [ ] workshops table exists (or create from spec)
- [ ] users table exists (or update with required fields)
- [ ] Test database connection works
- [ ] Can query both tables directly

### Verify Frontend
- [ ] AdminDashboard.jsx compiles: `npm run build`
- [ ] No errors in browser console
- [ ] Can navigate to /dashboard/admin as admin user
- [ ] All three tabs visible and clickable

---

## 📦 Phase 1: Setup (30 minutes)

### Step 1: Create DTOs
- [ ] Create WorkshopRequestDTO
  - [ ] title (String, required)
  - [ ] description (String, optional)
  - [ ] startDate (LocalDate, optional)
  - [ ] startTime (LocalTime, optional)
  - [ ] endTime (LocalTime, optional)
  - [ ] capacity (Integer, optional)
  - [ ] instructor (String, optional)

- [ ] Create WorkshopResponseDTO
  - [ ] id (Integer)
  - [ ] title (String)
  - [ ] description (String)
  - [ ] startDate (LocalDate)
  - [ ] startTime (LocalTime)
  - [ ] endTime (LocalTime)
  - [ ] capacity (Integer)
  - [ ] instructor (String)
  - [ ] createdAt (LocalDateTime)
  - [ ] updatedAt (LocalDateTime)

- [ ] Create UserRequestDTO
  - [ ] firstName (String, required)
  - [ ] lastName (String, required)
  - [ ] email (String, required)
  - [ ] role (String, required: PARTICIPANT/ADMIN/INSTRUCTOR)
  - [ ] password (String, optional)

- [ ] Create UserResponseDTO
  - [ ] id (Integer)
  - [ ] firstName (String)
  - [ ] lastName (String)
  - [ ] email (String)
  - [ ] role (String)
  - [ ] createdAt (LocalDateTime)
  - [ ] updatedAt (LocalDateTime)

### Step 2: Update Service Layer
- [ ] Create/update WorkshopService interface with 4 methods
  - [ ] List<WorkshopResponseDTO> getAllWorkshops()
  - [ ] WorkshopResponseDTO createWorkshop(WorkshopRequestDTO)
  - [ ] WorkshopResponseDTO updateWorkshop(Integer id, WorkshopRequestDTO)
  - [ ] void deleteWorkshop(Integer id)

- [ ] Create/update UserService interface with 4 methods
  - [ ] List<UserResponseDTO> getAllUsers()
  - [ ] UserResponseDTO createUser(UserRequestDTO)
  - [ ] UserResponseDTO updateUser(Integer id, UserRequestDTO)
  - [ ] void deleteUser(Integer id)

- [ ] Implement WorkshopService methods
  - [ ] Add proper error handling
  - [ ] Add validation
  - [ ] Add logging

- [ ] Implement UserService methods
  - [ ] Add proper error handling
  - [ ] Add validation
  - [ ] Add logging

---

## 🔗 Phase 2: Workshop Endpoints (1 hour)

### Endpoint 1: Get All Workshops
- [ ] Create method in WorkshopController
  ```java
  @GetMapping
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<?> getAllWorkshops() { }
  ```
- [ ] Add error handling (500 error)
- [ ] Test with Postman (GET http://localhost:8080/api/workshops)
  - [ ] Test with valid token → 200 with data
  - [ ] Test without token → 401
  - [ ] Test with non-admin user → 403

### Endpoint 2: Create Workshop
- [ ] Create method in WorkshopController
  ```java
  @PostMapping
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<?> createWorkshop(@RequestBody WorkshopRequestDTO request) { }
  ```
- [ ] Add validation (required fields: title, startDate)
- [ ] Return 201 Created with new object
- [ ] Test with Postman (POST http://localhost:8080/api/workshops)
  - [ ] Test with valid data → 201 with workshop ID
  - [ ] Test with missing title → 400
  - [ ] Test with invalid date → 400

### Endpoint 3: Update Workshop
- [ ] Create method in WorkshopController
  ```java
  @PutMapping("/{workshopId}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<?> updateWorkshop(@PathVariable Integer workshopId, @RequestBody WorkshopRequestDTO request) { }
  ```
- [ ] Check if workshop exists (404 if not)
- [ ] Update only provided fields
- [ ] Return 200 with updated object
- [ ] Test with Postman (PUT http://localhost:8080/api/workshops/1)
  - [ ] Test updating single field
  - [ ] Test with valid ID → 200
  - [ ] Test with invalid ID → 404

### Endpoint 4: Delete Workshop
- [ ] Create method in WorkshopController
  ```java
  @DeleteMapping("/{workshopId}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<?> deleteWorkshop(@PathVariable Integer workshopId) { }
  ```
- [ ] Check if workshop exists (404 if not)
- [ ] Delete from database
- [ ] Return 200 success message
- [ ] Test with Postman (DELETE http://localhost:8080/api/workshops/1)
  - [ ] Test with valid ID → 200
  - [ ] Test with invalid ID → 404
  - [ ] Verify workshop deleted from database

---

## 👥 Phase 3: User Endpoints (1 hour)

### Endpoint 5: Get All Users
- [ ] Create method in UserController
  ```java
  @GetMapping
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<?> getAllUsers() { }
  ```
- [ ] Add error handling
- [ ] Test with Postman (GET http://localhost:8080/api/users)
  - [ ] Test with valid token → 200 with data
  - [ ] Test without token → 401
  - [ ] Test with non-admin → 403

### Endpoint 6: Create User
- [ ] Create method in UserController
  ```java
  @PostMapping
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<?> createUser(@RequestBody UserRequestDTO request) { }
  ```
- [ ] Validate email is unique
- [ ] Validate required fields (firstName, lastName, email)
- [ ] Hash password if provided
- [ ] Return 201 with new user (no password in response)
- [ ] Test with Postman
  - [ ] Test with valid data → 201
  - [ ] Test with duplicate email → 400
  - [ ] Test with missing firstName → 400

### Endpoint 7: Update User
- [ ] Create method in UserController
  ```java
  @PutMapping("/{userId}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<?> updateUser(@PathVariable Integer userId, @RequestBody UserRequestDTO request) { }
  ```
- [ ] Check if user exists (404 if not)
- [ ] Validate email unique (if changing)
- [ ] Update fields
- [ ] Return 200 with updated user
- [ ] Test with Postman
  - [ ] Test with valid ID → 200
  - [ ] Test with invalid ID → 404

### Endpoint 8: Delete User
- [ ] Create method in UserController
  ```java
  @DeleteMapping("/{userId}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<?> deleteUser(@PathVariable Integer userId) { }
  ```
- [ ] Check if user exists (404 if not)
- [ ] Delete from database
- [ ] Return 200 success
- [ ] Test with Postman
  - [ ] Test with valid ID → 200
  - [ ] Test with invalid ID → 404

---

## 🧪 Phase 4: Testing (1 hour)

### Unit Tests
- [ ] Test each service method with valid data
- [ ] Test each service method with invalid data
- [ ] Test each controller endpoint with valid data
- [ ] Test each controller endpoint with invalid data
- [ ] Test authorization on all admin endpoints

### Integration Tests
- [ ] Test full CRUD cycle for workshops
- [ ] Test full CRUD cycle for users
- [ ] Test error scenarios
- [ ] Test concurrent requests

### Postman Tests
- [ ] Create Postman collection with all 8 endpoints
- [ ] Test each endpoint individually
- [ ] Test with valid authentication
- [ ] Test with invalid authentication
- [ ] Test with invalid data
- [ ] Document response times

### Frontend Tests
- [ ] Login as admin
- [ ] Navigate to /dashboard/admin
- [ ] Test Create Workshop
  - [ ] Fill form and submit
  - [ ] Verify in database
  - [ ] Verify appears in table
- [ ] Test Edit Workshop
  - [ ] Edit existing workshop
  - [ ] Verify changes saved
- [ ] Test Delete Workshop
  - [ ] Delete workshop
  - [ ] Verify in database
- [ ] Test Create Participant (same as workshop)
- [ ] Test Edit Participant (same as workshop)
- [ ] Test Delete Participant (same as workshop)
- [ ] Test Search Workshops
- [ ] Test Search Participants

### Edge Cases
- [ ] Test with empty database (no workshops/users)
- [ ] Test with large dataset (100+ items)
- [ ] Test with special characters in names
- [ ] Test with very long strings
- [ ] Test with null values
- [ ] Test with concurrent requests
- [ ] Test with invalid IDs (negative, 0, 999999)

---

## 🔐 Phase 5: Security & Validation (30 minutes)

### Authentication
- [ ] Verify Bearer token is required
- [ ] Verify expired token is rejected (401)
- [ ] Verify invalid token is rejected (401)
- [ ] Verify token extraction works correctly

### Authorization
- [ ] Verify ADMIN role check on all endpoints
- [ ] Verify non-admin users get 403
- [ ] Verify permissions are enforced

### Input Validation
- [ ] Verify required fields are checked
- [ ] Verify email format is validated
- [ ] Verify string length limits enforced
- [ ] Verify number ranges validated
- [ ] Verify date format validated
- [ ] Verify unique constraints enforced

### Error Handling
- [ ] Verify error messages are informative
- [ ] Verify error codes are correct
- [ ] Verify sensitive info not exposed
- [ ] Verify database errors handled gracefully

### SQL Injection Prevention
- [ ] Verify parameterized queries used
- [ ] Verify no string concatenation in queries
- [ ] Verify JPA/Hibernate used (not raw SQL)

---

## 📝 Phase 6: Documentation (15 minutes)

### Code Documentation
- [ ] Add JavaDoc comments to DTOs
- [ ] Add JavaDoc comments to Service methods
- [ ] Add JavaDoc comments to Controller methods
- [ ] Document validation rules
- [ ] Document error codes

### API Documentation
- [ ] Update Swagger/OpenAPI if using
- [ ] Document request/response formats
- [ ] Document authentication requirements
- [ ] Document authorization requirements
- [ ] Document error responses

### Database Documentation
- [ ] Document table schema
- [ ] Document column constraints
- [ ] Document relationships
- [ ] Document indexes

---

## ✅ Phase 7: Deployment Preparation (15 minutes)

### Code Quality
- [ ] Run code formatter (clean up style)
- [ ] Run linter (check for issues)
- [ ] Remove all console.log/System.out.print
- [ ] Remove all debug code
- [ ] Remove all TODO comments (or complete them)

### Performance
- [ ] Add indexes to database (if needed)
- [ ] Test with large dataset
- [ ] Check response times
- [ ] Check database query times

### Configuration
- [ ] Update database connection strings
- [ ] Update CORS settings for production domain
- [ ] Update token expiration settings
- [ ] Update logging levels

### Build & Deploy
- [ ] Build successfully: `mvn clean package`
- [ ] No build warnings
- [ ] JAR file created
- [ ] Can start application
- [ ] Application starts without errors
- [ ] All endpoints accessible

---

## 🎯 Final Verification Checklist

### Backend Complete?
- [ ] All 8 endpoints implemented
- [ ] All endpoints tested with Postman
- [ ] All endpoints return correct status codes
- [ ] All endpoints require ADMIN role
- [ ] All endpoints validate input
- [ ] All endpoints handle errors
- [ ] All endpoints work with frontend

### Frontend Integration?
- [ ] Can create workshops via admin dashboard
- [ ] Can list workshops in admin dashboard
- [ ] Can edit workshops via admin dashboard
- [ ] Can delete workshops via admin dashboard
- [ ] Can search workshops via admin dashboard
- [ ] Can create participants via admin dashboard
- [ ] Can list participants in admin dashboard
- [ ] Can edit participants via admin dashboard
- [ ] Can delete participants via admin dashboard
- [ ] Can search participants via admin dashboard

### Security?
- [ ] Authentication required for all endpoints
- [ ] Authorization enforced (ADMIN only)
- [ ] Input validation working
- [ ] No SQL injection vulnerabilities
- [ ] No sensitive data exposed
- [ ] Error messages safe

### Performance?
- [ ] Response times acceptable (<1 second)
- [ ] No N+1 queries
- [ ] Database queries optimized
- [ ] Can handle 100+ items
- [ ] No memory leaks

### Deployment Ready?
- [ ] Code is clean and documented
- [ ] No build warnings or errors
- [ ] All tests passing
- [ ] Ready for production

---

## 📊 Progress Tracking

### Start Date: _______________

### Phase 1 Completion: _______________
- DTO Creation: [ ] Complete
- Service Layer: [ ] Complete

### Phase 2 Completion: _______________
- Endpoint 1 (GET): [ ] Complete
- Endpoint 2 (POST): [ ] Complete
- Endpoint 3 (PUT): [ ] Complete
- Endpoint 4 (DELETE): [ ] Complete

### Phase 3 Completion: _______________
- Endpoint 5 (GET): [ ] Complete
- Endpoint 6 (POST): [ ] Complete
- Endpoint 7 (PUT): [ ] Complete
- Endpoint 8 (DELETE): [ ] Complete

### Phase 4 Completion: _______________
- Testing: [ ] Complete

### Phase 5 Completion: _______________
- Security: [ ] Complete

### Phase 6 Completion: _______________
- Documentation: [ ] Complete

### Phase 7 Completion: _______________
- Deployment: [ ] Complete

### End Date: _______________
### Total Time: _______________

---

## 🎓 Troubleshooting During Implementation

### Common Issues

**Issue: 401 Unauthorized**
- [ ] Verify token is being sent
- [ ] Verify token is valid (not expired)
- [ ] Check Authorization header format
- [ ] Verify security is not too strict

**Issue: 403 Forbidden**
- [ ] Verify user has ADMIN role
- [ ] Check @PreAuthorize annotation
- [ ] Verify SecurityContextHolder.getContext() returns user
- [ ] Check role prefix (ROLE_ vs no prefix)

**Issue: 400 Bad Request**
- [ ] Verify JSON format is correct
- [ ] Verify all required fields present
- [ ] Check field names match DTO
- [ ] Verify data types match

**Issue: 500 Internal Server Error**
- [ ] Check backend logs
- [ ] Verify database connection
- [ ] Check SQL syntax
- [ ] Verify JPA/Hibernate mapping
- [ ] Check null pointer exceptions

**Issue: Frontend not showing data**
- [ ] Verify backend endpoint returns data
- [ ] Check network tab in DevTools
- [ ] Verify API endpoint URL matches
- [ ] Check error messages in console
- [ ] Verify token is being sent

---

## 📞 Quick Reference

| When | Do This |
|------|---------|
| Building DTO | Copy from ADMIN_BACKEND_REQUIREMENTS.md |
| Implementing endpoint | Copy controller template from docs |
| Getting stuck | Check ADMIN_BACKEND_REQUIREMENTS.md examples |
| Testing endpoint | Use Postman examples from docs |
| Finding bug | Check backend logs or browser DevTools |
| Want overview | Read ADMIN_ARCHITECTURE.md |

---

## ✨ Success!

When you check off all items in this checklist, you're done! 🎉

The Admin Dashboard will be fully functional and ready for production use.

**Expected completion time:** 3-4 hours for experienced developers

**Good luck!** 💪
