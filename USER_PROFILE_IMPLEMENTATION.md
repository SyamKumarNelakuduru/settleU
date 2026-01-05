# User Profile Storage Implementation

## Overview
Implemented automatic Firestore user profile storage on Google authentication.

## Architecture

### UserService (`src/app/services/user.service.ts`)
- **Purpose**: Manages user profiles in Firestore
- **Collection**: `users/{uid}`
- **Key Method**: `upsertGoogleUser(user: User)`

### Data Model
```typescript
interface UserProfile {
  uid: string;
  name: string | null;
  email: string | null;
  photoURL: string | null;
  provider: 'google';
  role: 'student'; // Default
  createdAt: Timestamp; // Set only on first creation
  updatedAt: Timestamp; // Updated every login
  lastLoginAt: Timestamp; // Updated every login
}
```

## Integration

### AuthService Modification
Added single line to `signInWithGoogle()`:
```typescript
const credential = await signInWithPopup(this.auth, provider);

// ✅ NEW: Save/update user profile in Firestore
await this.userService.upsertGoogleUser(credential.user);

return credential.user;
```

## Key Features

1. **Merge Strategy**: Uses `{ merge: true }` to preserve existing data
2. **Timestamp Handling**: 
   - `createdAt`: Set once, never overwritten
   - `updatedAt` & `lastLoginAt`: Updated on every login
3. **Null Safety**: Handles nullable fields (`displayName`, `email`, `photoURL`)
4. **Error Resilience**: Logs errors but keeps user logged in
5. **Zero Impact**: Doesn't change existing navigation/redirect behavior

## Firestore Security Rules (Recommended)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      // Users can only read/write their own profile
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Testing

Test the flow:
1. Sign in with Google
2. Check Firestore console for `users/{uid}` document
3. Sign out and sign in again
4. Verify `updatedAt` and `lastLoginAt` timestamps update
5. Verify `createdAt` remains unchanged

## Production Checklist

- ✅ Uses modern modular Firebase SDK
- ✅ Handles nulls safely
- ✅ Error handling (non-blocking)
- ✅ TypeScript interfaces
- ✅ Server timestamps
- ✅ Merge strategy prevents data loss
- ✅ Clean, maintainable code
