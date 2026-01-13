import { Injectable } from '@angular/core';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { initializeFirestore, getFirestore, Firestore, CACHE_SIZE_UNLIMITED, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { firebaseConfig } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private app: FirebaseApp;
  public auth: Auth;
  public firestore: Firestore;
  public storage: FirebaseStorage;

  constructor() {
    // Initialize Firebase
    this.app = initializeApp(firebaseConfig);
    
    // Initialize Firebase services
    this.auth = getAuth(this.app);
    
    // Initialize Firestore with persistent cache (new method - replaces deprecated enableIndexedDbPersistence)
    try {
      this.firestore = initializeFirestore(this.app, {
        localCache: persistentLocalCache({
          cacheSizeBytes: CACHE_SIZE_UNLIMITED,
          tabManager: persistentMultipleTabManager()
        })
      });
      console.log('✅ Firestore initialized with persistent cache');
    } catch (err: any) {
      // Fallback to default Firestore if initialization fails
      console.warn('⚠️ Failed to initialize Firestore with cache, using default:', err);
      this.firestore = getFirestore(this.app);
    }
    
    this.storage = getStorage(this.app);
  }

  // Get Firebase app instance
  getApp(): FirebaseApp {
    return this.app;
  }
}
