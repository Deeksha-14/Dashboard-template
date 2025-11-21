# ParticipantDashboard - Implementation Checklist

## ✅ Frontend Changes Complete

- [x] Removed all mock data from ParticipantDashboard.jsx
- [x] Switched to using `axiosInstance` directly (not workshopService)
- [x] Fixed Grid components to use native Tailwind CSS
- [x] Added detailed console logging with useEffect
- [x] Flexible user ID extraction (id or sub)
- [x] Proper error handling and display
- [x] All API calls documented

## 🔧 What You Need to Do

### Step 1: Verify Backend Endpoints Exist
Check that your backend has these endpoints implemented:
- [ ] `GET /api/workshops/upcoming` 
- [ ] `GET /api/workshops/participant/{userId}`
- [ ] `POST /api/workshops/{workshopId}/participants`

### Step 2: Test in Browser
- [ ] Run `npm run dev`
- [ ] Navigate to http://localhost:5174
- [ ] Login with PARTICIPANT credentials
- [ ] Press F12 to open DevTools Console
- [ ] Look for console logs starting with "=== ParticipantDashboard"
- [ ] Check what the user object contains
- [ ] Check if API calls succeed (✓) or fail (✗)

### Step 3: Share Console Output
If dashboard doesn't render, share these console logs:
```
=== ParticipantDashboard Component Mounted/Updated ===
User object: ???
User role: ???
User ID: ???
All user keys: ???
Fetching workshops for userId: ???
✗ Error fetching enrolled workshops: ???
✗ Error fetching upcoming workshops: ???
```

## 📋 If Backend Returns Errors

The error will appear on the page like:
```
Error loading workshops
Failed to load enrolled workshops: {detailed error message}
```

Common issues and fixes:

| Error | Fix |
|-------|-----|
| "404 Not Found" | Backend endpoint doesn't exist - create it |
| "401 Unauthorized" | Token not being sent - check localStorage.getItem('token') |
| "500 Internal Server" | Backend error - check server logs |
| "Cannot read property 'data' of undefined" | Backend not returning response.data |

## 🎯 Expected Behavior (When Everything Works)

1. **Page loads** with loading spinner
2. **Console shows** user object and workshop count logs
3. **Page renders** with:
   - Welcome message with user's name
   - 3 stat cards (Enrolled, Upcoming, Jupyter Access)
   - List of enrolled workshops (if any)
   - List of upcoming workshops (if any)
   - Purple "Run Code on Jupyter" button at bottom right
4. **Can register** for workshops by clicking Register button
5. **Dashboard updates** after successful registration

## 🚨 If Components Still Don't Render

Check these in order:

1. **Is the route loading at all?**
   - URL should be `http://localhost:5174/dashboard/participant`
   - If you see 404, check routes.config.jsx and App.jsx

2. **Is the component mounted?**
   - Should see "=== ParticipantDashboard Component Mounted ===" in console
   - If not, component isn't rendering at all (route issue)

3. **Is user object populated?**
   - Check if `user` is null or has properties
   - If null, you're not authenticated or AuthContext isn't working

4. **Are API calls succeeding?**
   - Look for ✓ or ✗ in console logs
   - If ✗, check the error message for API details

## 📞 Questions?

If you get stuck, share:
1. Browser console output (with all logs)
2. What happens when you load `/dashboard/participant`
3. Whether you see the loading spinner or nothing at all
4. Any error messages in red text

