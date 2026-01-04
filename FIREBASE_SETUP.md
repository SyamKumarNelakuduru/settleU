# Firebase Configuration Guide

## Step 1: Get Your Firebase Config

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create a new one)
3. Click on the gear icon (⚙️) next to "Project Overview" → "Project settings"
4. Scroll down to "Your apps" section
5. Click on the web app icon (</>) or "Add app" if you haven't created one
6. Copy the Firebase configuration object

## Step 2: Update Environment Files

Replace the placeholder values in these files with your actual Firebase configuration:

- `src/environments/environment.ts` (for development)
- `src/environments/environment.prod.ts` (for production)

```typescript
export const environment = {
  production: false, // true for production
  firebase: {
    apiKey: "YOUR_ACTUAL_API_KEY",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456",
    measurementId: "G-XXXXXXXXXX" // Optional, for Analytics
  }
};
```

## Step 3: Enable Firebase Services

In the Firebase Console, enable the services you need:

### Authentication
1. Go to "Authentication" → "Sign-in method"
2. Enable "Email/Password" or other providers you want to use

### Firestore Database
1. Go to "Firestore Database"
2. Click "Create database"
3. Choose production or test mode
4. Select your region

### Storage (Optional)
1. Go to "Storage"
2. Click "Get started"
3. Set up security rules

## Usage Examples

### Using Authentication Service

```typescript
import { Component, inject } from '@angular/core';
import { AuthService } from './services/auth.service';

export class MyComponent {
  authService = inject(AuthService);

  async signIn() {
    try {
      const user = await this.authService.signIn('email@example.com', 'password');
      console.log('Signed in:', user);
    } catch (error) {
      console.error('Sign in error:', error);
    }
  }

  async signUp() {
    try {
      const user = await this.authService.signUp('email@example.com', 'password', 'Display Name');
      console.log('Signed up:', user);
    } catch (error) {
      console.error('Sign up error:', error);
    }
  }

  async signOut() {
    await this.authService.signOut();
  }
}
```

### Using Firestore Service

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { FirestoreService } from './services/firestore.service';

interface User {
  id?: string;
  name: string;
  email: string;
}

export class MyComponent implements OnInit {
  firestoreService = inject(FirestoreService);

  async ngOnInit() {
    // Get all documents
    const users = await this.firestoreService.getDocs<User>('users');
    console.log(users);

    // Get single document
    const user = await this.firestoreService.getDoc<User>('users', 'user-id');
    console.log(user);

    // Add document
    const newUserId = await this.firestoreService.addDoc('users', {
      name: 'John Doe',
      email: 'john@example.com'
    });

    // Update document
    await this.firestoreService.updateDoc('users', newUserId, {
      name: 'Jane Doe'
    });

    // Delete document
    await this.firestoreService.deleteDoc('users', newUserId);

    // Real-time listener
    this.firestoreService.onCollectionSnapshot<User>('users').subscribe(users => {
      console.log('Real-time users:', users);
    });
  }
}
```

## Security Note

**Important:** Never commit your Firebase config with real credentials to public repositories!

Consider:
- Adding `src/environments/environment.ts` to `.gitignore`
- Using environment variables in CI/CD
- Keeping production config separate and secure
