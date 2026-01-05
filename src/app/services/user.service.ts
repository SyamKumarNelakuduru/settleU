import { Injectable, inject } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { 
  doc, 
  setDoc, 
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

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private firebaseService = inject(FirebaseService);
  private db = this.firebaseService.firestore;

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
        role: 'student', // Default role for new users
        updatedAt: serverTimestamp() as Timestamp,
        lastLoginAt: serverTimestamp() as Timestamp
      };

      // Use merge: true to:
      // - Create the document if it doesn't exist (including createdAt)
      // - Update only the specified fields if it exists (preserve createdAt)
      await setDoc(userRef, {
        ...profileData,
        // createdAt only sets on first creation, won't overwrite existing
        createdAt: serverTimestamp()
      }, { merge: true });

      console.log('User profile saved/updated successfully:', user.uid);
    } catch (error) {
      // Log error but don't throw - keep user logged in even if Firestore fails
      console.error('Failed to save user profile to Firestore:', error);
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
      const { getDoc } = await import('firebase/firestore');
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
