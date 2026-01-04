import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private isLoginModalOpenSubject = new BehaviorSubject<boolean>(false);
  public isLoginModalOpen$: Observable<boolean> = this.isLoginModalOpenSubject.asObservable();

  openLoginModal(): void {
    this.isLoginModalOpenSubject.next(true);
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
  }

  closeLoginModal(): void {
    this.isLoginModalOpenSubject.next(false);
    // Restore body scroll
    document.body.style.overflow = 'auto';
  }

  get isLoginModalOpen(): boolean {
    return this.isLoginModalOpenSubject.value;
  }
}
