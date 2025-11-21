# Admin Dashboard - Suggested Additional Features

Beyond the MVP CRUD operations, here are useful features you could add to enhance the admin dashboard:

---

## 1. Workshop Analytics & Statistics 📊

### Frontend Feature
Show statistics per workshop:
- Total participants enrolled
- Completion rate
- Average rating/satisfaction
- Upcoming vs completed

### Backend Requirements
```java
// New endpoints needed:
GET /api/workshops/{workshopId}/statistics
GET /api/workshops/{workshopId}/participants

// Response:
{
  "workshopId": 1,
  "totalEnrolled": 45,
  "totalCompleted": 32,
  "completionRate": 71,
  "averageRating": 4.5,
  "upcomingCount": 5,
  "completedCount": 3
}
```

### Database Query
```sql
SELECT 
  COUNT(DISTINCT wp.participant_id) as total_enrolled,
  COUNT(CASE WHEN wp.status = 'COMPLETED' THEN 1 END) as completed,
  AVG(wr.rating) as avg_rating
FROM workshop_participants wp
LEFT JOIN workshop_reviews wr ON wr.workshop_id = w.id
WHERE w.id = ?
GROUP BY w.id;
```

---

## 2. Bulk Operations 🔄

### Features
- Select multiple workshops/participants with checkboxes
- Bulk delete button
- Bulk status update (enable/disable workshops)
- Bulk role change for participants

### Frontend Implementation
```javascript
// Add state for selected items
const [selectedWorkshops, setSelectedWorkshops] = useState([]);

// Add checkbox column to table
// Add "Delete Selected" button when items are checked
// Add "Change Role" dropdown for participants

const handleBulkDelete = async () => {
  if (window.confirm(`Delete ${selectedWorkshops.length} workshops?`)) {
    await Promise.all(
      selectedWorkshops.map(id => axiosInstance.delete(`/workshops/${id}`))
    );
    await fetchWorkshops();
    setSelectedWorkshops([]);
  }
};
```

### Backend Requirements
```java
@PostMapping("/bulk-delete")
public ResponseEntity<?> bulkDeleteWorkshops(@RequestBody List<Integer> workshopIds) {
    workshopService.deleteWorkshops(workshopIds);
    return ResponseEntity.ok("Deleted successfully");
}

@PostMapping("/bulk-update-status")
public ResponseEntity<?> bulkUpdateStatus(@RequestBody BulkUpdateRequest request) {
    workshopService.updateWorkshopsStatus(request.getIds(), request.getStatus());
    return ResponseEntity.ok("Updated successfully");
}
```

---

## 3. Import/Export Functionality 📥📤

### Features
- Export workshops to CSV
- Export participants to CSV
- Import participants from CSV
- Import workshops from CSV

### Frontend Implementation
```javascript
// Export to CSV
const exportWorkshopsToCSV = () => {
  const csvContent = [
    ["ID", "Title", "Instructor", "Start Date", "Capacity"],
    ...workshops.map(w => [w.id, w.title, w.instructor, w.startDate, w.capacity])
  ]
  .map(row => row.join(","))
  .join("\n");
  
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "workshops.csv";
  a.click();
};

// Import from CSV
const handleImportParticipants = async (file) => {
  const text = await file.text();
  const lines = text.split("\n");
  const participants = lines.slice(1).map(line => {
    const [firstName, lastName, email, role] = line.split(",");
    return { firstName, lastName, email, role };
  });
  
  for (const p of participants) {
    await axiosInstance.post("/users", p);
  }
  await fetchParticipants();
};
```

### Backend Requirements
```java
@PostMapping("/import-participants")
public ResponseEntity<?> importParticipants(@RequestParam("file") MultipartFile file) {
    // Parse CSV and create participants
    // Return results (created, failed, duplicates)
}

@GetMapping("/export-workshops")
public ResponseEntity<?> exportWorkshops() {
    // Return CSV content
}
```

---

## 4. Advanced Search & Filtering 🔍

### Features
- Filter workshops by date range
- Filter by capacity range
- Filter participants by enrollment status
- Filter by last activity date
- Saved filter presets

### Frontend Implementation
```javascript
const [filters, setFilters] = useState({
  dateFrom: "",
  dateTo: "",
  capacityMin: "",
  capacityMax: "",
  instructor: "",
  status: "all" // upcoming, ongoing, completed
});

const filteredWorkshops = workshops.filter(w => {
  const matchesDate = (!filters.dateFrom || w.startDate >= filters.dateFrom) &&
                      (!filters.dateTo || w.startDate <= filters.dateTo);
  const matchesCapacity = (!filters.capacityMin || w.capacity >= filters.capacityMin) &&
                          (!filters.capacityMax || w.capacity <= filters.capacityMax);
  const matchesInstructor = !filters.instructor || w.instructor === filters.instructor;
  return matchesDate && matchesCapacity && matchesInstructor;
});
```

### Backend Requirements
```java
@GetMapping("/search")
public ResponseEntity<?> searchWorkshops(
    @RequestParam(required = false) LocalDate dateFrom,
    @RequestParam(required = false) LocalDate dateTo,
    @RequestParam(required = false) Integer capacityMin,
    @RequestParam(required = false) Integer capacityMax,
    @RequestParam(required = false) String instructor
) {
    // Apply filters and return results
}
```

---

## 5. Sorting & Pagination 📄

### Features
- Click column headers to sort
- Sort ascending/descending
- Pagination (10, 25, 50 items per page)
- Show "1-10 of 150" indicator

### Frontend Implementation
```javascript
const [sortField, setSortField] = useState("title");
const [sortOrder, setSortOrder] = useState("asc");
const [page, setPage] = useState(1);
const [pageSize, setPageSize] = useState(10);

const sortedWorkshops = [...workshops].sort((a, b) => {
  const aVal = a[sortField];
  const bVal = b[sortField];
  if (sortOrder === "asc") return aVal > bVal ? 1 : -1;
  return aVal < bVal ? 1 : -1;
});

const paginatedWorkshops = sortedWorkshops.slice(
  (page - 1) * pageSize,
  page * pageSize
);
```

### Backend Requirements
```java
@GetMapping
public ResponseEntity<?> getWorkshops(
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "10") int size,
    @RequestParam(defaultValue = "id") String sortBy,
    @RequestParam(defaultValue = "ASC") Sort.Direction direction
) {
    Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
    Page<WorkshopResponseDTO> result = workshopService.getWorkshops(pageable);
    return ResponseEntity.ok(result);
}
```

---

## 6. Activity Log & Audit Trail 📝

### Features
- Log all admin actions (create, update, delete, login)
- Show who made changes and when
- View change history for each item
- Filter by admin user, date, action type

### Backend Requirements
```java
@Entity
public class AuditLog {
    @Id
    private Long id;
    private Integer adminId;
    private String action; // CREATE, UPDATE, DELETE, LOGIN
    private String entityType; // WORKSHOP, USER
    private Integer entityId;
    private String changes; // JSON diff of what changed
    @Timestamp
    private LocalDateTime createdAt;
}

// Endpoint
@GetMapping("/audit-logs")
public ResponseEntity<?> getAuditLogs(
    @RequestParam(required = false) String entityType,
    @RequestParam(required = false) LocalDate dateFrom
) {
    // Return audit logs
}
```

---

## 7. Role-Based Visibility & Permissions 👥

### Features
- Show role badges for participants (PARTICIPANT, INSTRUCTOR, ADMIN)
- Different workshop actions based on role (instructors can only edit their own)
- Participant enrollment status
- Show which workshops each participant is enrolled in

### Backend Requirements
```java
@GetMapping("/users/{userId}/enrollments")
public ResponseEntity<?> getUserEnrollments(@PathVariable Integer userId) {
    // Return list of workshops user is enrolled in
}

@GetMapping("/workshops/{workshopId}/enrollments")
public ResponseEntity<?> getWorkshopEnrollments(@PathVariable Integer workshopId) {
    // Return list of participants enrolled in workshop
}
```

---

## 8. Email Notifications 📧

### Features
- Send email to participants when new workshop is created
- Send reminders before workshop starts
- Notify admins of registrations
- Notify participants of enrollment status changes

### Backend Requirements
```java
@PostMapping("/workshops/{workshopId}/notify-participants")
public ResponseEntity<?> notifyParticipants(
    @PathVariable Integer workshopId,
    @RequestBody NotificationRequest request
) {
    // Send email to all enrolled participants
}

// Scheduled task
@Scheduled(cron = "0 0 9 * * *") // 9 AM daily
public void sendWorkshopReminders() {
    // Send reminders for workshops starting today
}
```

---

## 9. Dashboard Analytics 📈

### Features
- Total revenue/participants trend chart
- Workshop popularity (most enrolled)
- Instructor performance metrics
- Completion rate trends

### Backend Requirements
```java
@GetMapping("/analytics/dashboard")
public ResponseEntity<?> getDashboardAnalytics() {
    return ResponseEntity.ok(new DashboardAnalytics(
        totalParticipants,
        totalWorkshops,
        completionRate,
        averageRating,
        revenueThisMonth
    ));
}

@GetMapping("/analytics/workshop-popularity")
public ResponseEntity<?> getWorkshopPopularity() {
    // Return top 5 workshops by enrollment
}
```

---

## 10. Workshop Scheduling & Recurring 🔄

### Features
- Create recurring workshops (weekly, bi-weekly, monthly)
- Calendar view of workshops
- Recurring schedule management
- Edit single instance or all instances

### Backend Requirements
```java
@PostMapping("/workshops/recurring")
public ResponseEntity<?> createRecurringWorkshop(
    @RequestBody RecurringWorkshopRequest request
) {
    // Create workshop instances based on recurrence pattern
}

// RecurringWorkshopRequest
{
  "title": "Weekly Python",
  "description": "...",
  "recurrence": "WEEKLY",
  "daysOfWeek": ["MONDAY", "WEDNESDAY"],
  "startDate": "2025-12-01",
  "endDate": "2026-03-31",
  "startTime": "10:00"
}
```

---

## Implementation Priority

**Phase 2 (Highly Recommended):**
1. Sorting & Pagination
2. Advanced Search & Filtering
3. Activity Log/Audit Trail

**Phase 3 (Nice to Have):**
4. Bulk Operations
5. Import/Export
6. Workshop Analytics
7. Email Notifications

**Phase 4 (Future Enhancement):**
8. Dashboard Analytics
9. Recurring Workshops
10. Role-Based Visibility

---

## Time Estimates

- Sorting & Pagination: 2-3 hours
- Advanced Search: 1-2 hours
- Bulk Operations: 2-3 hours
- Import/Export: 3-4 hours
- Activity Log: 2-3 hours
- Email Notifications: 3-4 hours
- Dashboard Analytics: 4-6 hours
- Recurring Workshops: 4-5 hours

---

## Example: Implementing Sorting & Pagination

### Frontend
```javascript
const [page, setPage] = useState(1);
const [sortBy, setSortBy] = useState("title");
const [sortOrder, setSortOrder] = useState("ASC");
const pageSize = 10;

const fetchWorkshops = async () => {
  const response = await axiosInstance.get(
    `/workshops?page=${page-1}&size=${pageSize}&sortBy=${sortBy}&direction=${sortOrder}`
  );
  setWorkshops(response.data.content);
  setTotalPages(response.data.totalPages);
};

// In table header
<th onClick={() => {
  setSortBy("title");
  setSortOrder(sortOrder === "ASC" ? "DESC" : "ASC");
}}>
  Title {sortBy === "title" && (sortOrder === "ASC" ? "↑" : "↓")}
</th>

// Pagination controls
<div className="flex gap-2 mt-4">
  <button onClick={() => setPage(page - 1)} disabled={page === 1}>Prev</button>
  {[...Array(totalPages)].map((_, i) => (
    <button key={i+1} onClick={() => setPage(i+1)}>{i+1}</button>
  ))}
  <button onClick={() => setPage(page + 1)} disabled={page === totalPages}>Next</button>
</div>
```

### Backend
```java
@GetMapping
public ResponseEntity<?> getAllWorkshops(
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "10") int size,
    @RequestParam(defaultValue = "id") String sortBy,
    @RequestParam(defaultValue = "ASC") Sort.Direction direction
) {
    Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
    Page<WorkshopResponseDTO> workshops = workshopService.getAllWorkshops(pageable);
    return ResponseEntity.ok(workshops);
}
```

---

Choose which features align best with your project requirements and add them in phases!
