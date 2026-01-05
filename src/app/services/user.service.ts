import { Injectable, inject } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { 
  doc, 
  setDoc, 
  getDoc,
  serverTimestamp, 
  Timestamp 
} from 'firebase/firestore';
import { User } from 'firebase/auth';

export interface UserProfile {
  uid: string;
  name: string | null;
  email: string | null;
  photoURL: string | null;
  provider: string;
  role: string;
  createdAt?: Timestamp;
  updatedAt: Timestamp;
  lastLoginAt: Timestamp;
}

// Admin email list
const ADMIN_EMAILS = [
  'syamkumarnelakuduru25@gmail.com',
  'ksamuelsujith@gmail.com'
];

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private firebaseService = inject(FirebaseService);
  private db = this.firebaseService.firestore;

  /**
   * Check if an email belongs to an admin
   */
  isAdminEmail(email: string | null): boolean {
    if (!email) return false;
    return ADMIN_EMAILS.includes(email.toLowerCase());
  }

  /**
   * Determine user role based on email
   */
  private getUserRole(email: string | null): string {
    return this.isAdminEmail(email) ? 'admin' : 'student';
  }

  /**
   * Upsert (create or update) a Google user profile in Firestore.
   * Uses merge=true to preserve existing fields and only update specified ones.
   * 
   * @param user - Firebase Auth User object from Google sign-in
   * @returns Promise that resolves when the user profile is saved
   */
  async upsertGoogleUser(user: User): Promise<void> {
    try {
      const userRef = doc(this.db, 'users', user.uid);
      
      const profileData: Partial<UserProfile> = {
        uid: user.uid,
        name: user.displayName ?? null,
        email: user.email ?? null,
        photoURL: user.photoURL ?? null,
        provider: 'google',
        role: this.getUserRole(user.email), // Check if admin
        updatedAt: serverTimestamp() as Timestamp,
        lastLoginAt: serverTimestamp() as Timestamp
      };

      await setDoc(userRef, {
        ...profileData,
        createdAt: serverTimestamp()
      }, { merge: true });

      console.log('User profile saved/updated successfully:', user.uid);
    } catch (error) {
      console.error('Failed to save user profile to Firestore:', error);
    }
  }

  /**
   * Upsert user profile for email/password authentication (admins)
   * 
   * @param user - Firebase Auth User object from email/password sign-in
   * @returns Promise that resolves when the user profile is saved
   */
  async upsertEmailUser(user: User): Promise<void> {
    try {
      const userRef = doc(this.db, 'users', user.uid);
      
      const profileData: Partial<UserProfile> = {
        uid: user.uid,
        name: user.displayName ?? user.email?.split('@')[0] ?? null,
        email: user.email ?? null,
        photoURL: user.photoURL ?? null,
        provider: 'email',
        role: this.getUserRole(user.email), // Check if admin
        updatedAt: serverTimestamp() as Timestamp,
        lastLoginAt: serverTimestamp() as Timestamp
      };

      await setDoc(userRef, {
        ...profileData,
        createdAt: serverTimestamp()
      }, { merge: true });

      console.log('Email user profile saved/updated successfully:', user.uid);
    } catch (error) {
      console.error('Failed to save email user profile to Firestore:', error);
    }
  }

  /**
   * Get a user profile from Firestore by UID.
   * 
   * @param uid - User's Firebase Auth UID
   * @returns Promise with user profile data or null if not found
   */
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const userRef = doc(this.db, 'users', uid);
      const docSnap = await getDoc(userRef);
      
      if (docSnap.exists()) {
        return docSnap.data() as UserProfile;
      }
      return null;
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      return null;
    }
  }
}
