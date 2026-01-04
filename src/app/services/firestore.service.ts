import { Injectable, inject } from '@angular/core';
import { FirebaseService } from './firebase.service';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  DocumentData,
  QueryConstraint,
  onSnapshot,
  Unsubscribe
} from 'firebase/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  private firebaseService = inject(FirebaseService);
  private firestore = this.firebaseService.firestore;

  // Get a single document
  async getDoc<T = DocumentData>(collectionName: string, docId: string): Promise<T | null> {
    const docRef = doc(this.firestore, collectionName, docId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as T;
    }
    return null;
  }

  // Get all documents from a collection
  async getDocs<T = DocumentData>(collectionName: string): Promise<T[]> {
    const querySnapshot = await getDocs(collection(this.firestore, collectionName));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
  }

  // Get documents with query
  async getDocsWithQuery<T = DocumentData>(
    collectionName: string,
    ...queryConstraints: QueryConstraint[]
  ): Promise<T[]> {
    const q = query(collection(this.firestore, collectionName), ...queryConstraints);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
  }

  // Add a document
  async addDoc<T = DocumentData>(collectionName: string, data: T): Promise<string> {
    const docRef = await addDoc(collection(this.firestore, collectionName), data as DocumentData);
    return docRef.id;
  }

  // Update a document
  async updateDoc<T = Partial<DocumentData>>(
    collectionName: string,
    docId: string,
    data: T
  ): Promise<void> {
    const docRef = doc(this.firestore, collectionName, docId);
    return updateDoc(docRef, data as DocumentData);
  }

  // Delete a document
  async deleteDoc(collectionName: string, docId: string): Promise<void> {
    const docRef = doc(this.firestore, collectionName, docId);
    return deleteDoc(docRef);
  }

  // Real-time listener for a document
  onDocSnapshot<T = DocumentData>(
    collectionName: string,
    docId: string
  ): Observable<T | null> {
    return new Observable((observer) => {
      const docRef = doc(this.firestore, collectionName, docId);
      const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          observer.next({ id: docSnap.id, ...docSnap.data() } as T);
        } else {
          observer.next(null);
        }
      });
      return () => unsubscribe();
    });
  }

  // Real-time listener for a collection
  onCollectionSnapshot<T = DocumentData>(
    collectionName: string,
    ...queryConstraints: QueryConstraint[]
  ): Observable<T[]> {
    return new Observable((observer) => {
      const q = query(collection(this.firestore, collectionName), ...queryConstraints);
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
        observer.next(docs);
      });
      return () => unsubscribe();
    });
  }
}
