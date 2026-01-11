# Quick Admin Panel Setup for Seeding

If you want a dedicated route for seeding accommodation data, follow these steps:

## Option 1: Add to Existing Admin Dashboard

Already covered in `ACCOMMODATION_QUICK_START.md`. This is the recommended approach.

## Option 2: Create Separate Seeding Route

### 1. Update Routes

Open `src/app/app.routes.ts` and add:

```typescript
import { SeedAccommodationComponent } from './components/seed-accommodation/seed-accommodation.component';

export const routes: Routes = [
  // ... existing routes
  {
    path: 'admin/seed-accommodation',
    component: SeedAccommodationComponent,
    // Optional: Add auth guard
    // canActivate: [authGuard]
  }
];
```

### 2. Access the Seeding Tool

Navigate to: `http://localhost:4200/admin/seed-accommodation`

### 3. Add Navigation Link (Optional)

In your admin dashboard, add a link:

```html
<a routerLink="/admin/seed-accommodation" class="nav-link">
  Seed Accommodation Data
</a>
```

## Option 3: Console-based Seeding

If you prefer using browser console:

### 1. Open Browser Console
- Navigate to your app
- Login as admin
- Open DevTools (F12)
- Go to Console tab

### 2. Paste This Code

```typescript
// Get Firestore instance
const { doc, updateDoc, getDoc } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');

// Your accommodation data
const accommodationData = {
  'uiuc': {
    accommodationGroups: [
      {
        name: 'UIUC Off-Campus Housing',
        platform: 'Facebook',
        url: 'https://www.facebook.com/groups/uiucoffcampushousing',
        note: 'Active group with daily posts. Verify landlord credentials before signing.'
      }
      // ... add more groups
    ],
    accommodationTips: [
      'Never pay deposits before seeing the lease.',
      'Use the university\'s official housing portal.'
    ]
  }
  // ... add more universities
};

// Seed function
async function seedAccommodation() {
  const db = firebase.firestore();
  
  for (const [universityId, data] of Object.entries(accommodationData)) {
    try {
      const docRef = doc(db, 'universities', universityId);
      await updateDoc(docRef, {
        accommodationGroups: data.accommodationGroups,
        accommodationTips: data.accommodationTips
      });
      console.log(`✅ Updated ${universityId}`);
    } catch (error) {
      console.error(`❌ Error updating ${universityId}:`, error);
    }
  }
  console.log('✨ Seeding complete!');
}

// Run it
seedAccommodation();
```

## Recommended Approach

**Use Option 1** (add to existing admin dashboard) because:
- ✅ Already authenticated
- ✅ Cleaner UI
- ✅ No route changes needed
- ✅ Easy to remove after use

## Security Note

After seeding is complete, consider:

1. **Removing the component** from production builds
2. **Adding auth guards** if keeping the route
3. **Using environment flags** to enable/disable seeding

Example with environment flag:

```typescript
// environment.ts
export const environment = {
  production: false,
  enableSeeding: true  // Set to false in production
};

// In admin dashboard
@Component({
  template: `
    <app-seed-accommodation *ngIf="enableSeeding"></app-seed-accommodation>
  `
})
export class AdminDashboardComponent {
  enableSeeding = environment.enableSeeding;
}
```

## Alternative: Firebase Cloud Functions

For production seeding, consider using Firebase Cloud Functions:

```typescript
// functions/src/index.ts
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const seedAccommodation = functions.https.onCall(async (data, context) => {
  // Check admin auth
  if (!context.auth || !context.auth.token.admin) {
    throw new functions.https.HttpsError('permission-denied', 'Must be admin');
  }

  const db = admin.firestore();
  const accommodationData = { /* ... */ };

  // Seed logic here
  // ...

  return { success: true, message: 'Seeding complete' };
});
```

Call from Angular:

```typescript
import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions();
const seedAccommodation = httpsCallable(functions, 'seedAccommodation');

async seedData() {
  const result = await seedAccommodation();
  console.log(result.data);
}
```

---

**Recommended:** Just use Option 1 from ACCOMMODATION_QUICK_START.md - it's the simplest!
