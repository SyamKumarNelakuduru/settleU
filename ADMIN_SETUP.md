# Admin Setup Instructions

## Creating Admin Accounts in Firebase

Since we're using Firebase Authentication, you need to create the admin user accounts in the Firebase Console.

### Steps to Create Admin Accounts:

1. **Go to Firebase Console**: https://console.firebase.google.com
2. **Select your project**: settleU
3. **Navigate to Authentication**:
   - Click on "Authentication" in the left sidebar
   - Click on the "Users" tab

4. **Add Admin User 1**:
   - Click "Add user" button
   - Email: `syamkumarnelakuduru25@gmail.com`
   - Password: `Syam123`
   - Click "Add user"

5. **Add Admin User 2**:
   - Click "Add user" button
   - Email: `ksamuelsujith@gmail.com`
   - Password: `Samuel123`
   - Click "Add user"

### Important Notes:

- These admin emails are hardcoded in `/src/app/services/user.service.ts`
- When these users sign in (via email/password or Google), they will automatically get the "admin" role
- Admin users are redirected to `/admin` dashboard after login
- Non-admin users are redirected to `/` home page

### Admin Login Process:

1. Click the login button in the header
2. Click "Admin Login" toggle button
3. Enter admin email and password
4. Sign in

### Admin Dashboard Features:

- Stats overview (placeholder for now)
- Quick action buttons
- Admin information display
- Logout functionality

### Testing Admin Flow:

1. Create the admin accounts in Firebase Console (as described above)
2. Open your app
3. Click login
4. Toggle to "Admin Login"
5. Enter admin credentials
6. Verify redirect to `/admin` dashboard
7. Check that admin role is correctly saved in Firestore (`users/{uid}` collection)

### Security:

The current implementation:
- ✅ Checks role on login
- ✅ Redirects based on role
- ✅ Admin dashboard checks role on init
- ⚠️ Add Firebase Security Rules to protect admin routes
- ⚠️ Consider adding route guards for additional security

### Recommended Firestore Security Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      // Users can read their own profile
      allow read: if request.auth != null && request.auth.uid == userId;
      
      // Only the user themselves can write to their profile
      // (but role is auto-set by the app, not directly writable by users)
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Add admin-only collections here
    match /admin/{document=**} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

## Admin Email List

Current admin emails (defined in `user.service.ts`):
1. syamkumarnelakuduru25@gmail.com
2. ksamuelsujith@gmail.com

To add more admins, update the `ADMIN_EMAILS` array in `/src/app/services/user.service.ts`.
