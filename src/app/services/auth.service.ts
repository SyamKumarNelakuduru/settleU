import { Injectable, inject } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { UserService } from './user.service';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  sendPasswordResetEmail,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult
} from 'firebase/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private firebaseService = inject(FirebaseService);
  private userService = inject(UserService);
  private auth = this.firebaseService.auth;

  // Get current user as Observable
  get user$(): Observable<User | null> {
    return new Observable((observer) => {
      const unsubscribe = onAuthStateChanged(this.auth, (user: User | null) => {
        observer.next(user);
      });
      return () => unsubscribe();
    });
  }

  // Get current user
  get currentUser(): User | null {
    return this.auth.currentUser;
  }

  // Sign in with email and password
  async signIn(email: string, password: string): Promise<User> {
    const credential = await signInWithEmailAndPassword(this.auth, email, password);
    return credential.user;
  }

  // Sign up with email and password
  async signUp(email: string, password: string, displayName?: string): Promise<User> {
    const credential = await createUserWithEmailAndPassword(this.auth, email, password);
    
    if (displayName && credential.user) {
      await updateProfile(credential.user, { displayName });
    }
    
    return credential.user;
  }

  // Sign out
  async signOut(): Promise<void> {
    return signOut(this.auth);
  }

  // Reset password
  async resetPassword(email: string): Promise<void> {
    return sendPasswordResetEmail(this.auth, email);
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.auth.currentUser !== null;
  }

  // Sign in with Google (Popup)
  async signInWithGoogle(): Promise<User> {
    const provider = new GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    
    const credential = await signInWithPopup(this.auth, provider);
    
    // Save/update user profile in Firestore
    await this.userService.upsertGoogleUser(credential.user);
    
    return credential.user;
  }

  // Sign in with Google (Redirect) - Alternative for mobile
  async signInWithGoogleRedirect(): Promise<void> {
    const provider = new GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    
    return signInWithRedirect(this.auth, provider);
  }

  // Get redirect result (call after redirect)
  async getRedirectResult(): Promise<User | null> {
    const result = await getRedirectResult(this.auth);
    return result?.user || null;
  }

  // Get user ID token
  async getIdToken(): Promise<string | null> {
    const user = this.auth.currentUser;
    if (user) {
      return user.getIdToken();
    }
    return null;
  }
}
