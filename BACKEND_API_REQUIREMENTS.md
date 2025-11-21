# Backend API Requirements for ParticipantDashboard

## Endpoints Required

Your backend needs these endpoints to make ParticipantDashboard work:

### 1. Get Enrolled Workshops (Participant-specific)
```
GET /api/workshops/participant/{userId}
Authorization: Bearer {token}

Response (200 OK):
[
  {
    "id": 1,
    "title": "React Fundamentals",
    "description": "Learn the basics of React...",
    "startDate": "2024-01-15",
    "startTime": "10:00 AM",
    "date": "2024-01-15"  // optional alternative to startDate
  },
  ...
]

Response (400/500 Error):
{
  "message": "Error message here"
}
```

### 2. Get Upcoming Workshops (Public, no userId needed)
```
GET /api/workshops/upcoming
Authorization: Bearer {token}

Response (200 OK):
[
  {
    "id": 3,
    "title": "TypeScript Masterclass",
    "description": "Complete guide to TypeScript...",
    "startDate": "2024-02-01",
    "startTime": "9:00 AM"
  },
  ...
]
```

### 3. Register Participant for Workshop
```
POST /api/workshops/{workshopId}/participants
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "participantId": "123"  // can be string or number
}

Response (200 OK):
{
  "id": 1,
  "title": "React Fundamentals",
  "participants": [123, 456, 789],
  ...
}

Response (400/409 Error):
{
  "message": "Already enrolled" or other error
}
```

## Important Notes

1. **Base URL**: All calls go to `http://localhost:8080/api` (from axiosConfig.js)
2. **Authentication**: Bearer token is automatically added from localStorage by axiosConfig
3. **Field Names**: Can use either `startDate` or `date` for the date field
4. **userId Format**: Can be string or number (extracted as `user?.id || user?.sub`)

## Test with Postman/Insomnia

Before testing in the app, verify your endpoints work:

```bash
# Test 1: Get upcoming workshops (no auth needed in theory, but we send it)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8080/api/workshops/upcoming

# Test 2: Get enrolled workshops for user 123
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8080/api/workshops/participant/123

# Test 3: Register for workshop 5
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"participantId": 123}' \
  http://localhost:8080/api/workshops/5/participants
```

## Current Frontend Code

The component calls these endpoints like this:

```javascript
// Fetch enrolled
const response = await axiosInstance.get(`/workshops/participant/${userId}`);
enrolled = response.data || [];

// Fetch upcoming
const response = await axiosInstance.get("/workshops/upcoming");
upcoming = response.data || [];

// Register
const response = await axiosInstance.post(
  `/workshops/${workshop.id}/participants`, 
  { participantId: userId }
);
```

All errors are caught and displayed in the error alert on the UI.

