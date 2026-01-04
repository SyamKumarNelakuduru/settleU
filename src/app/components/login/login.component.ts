import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  public modalService = inject(ModalService);

  isLoading = false;
  errorMessage = '';
  isModalOpen = false;

  ngOnInit(): void {
    this.modalService.isLoginModalOpen$.subscribe(isOpen => {
      this.isModalOpen = isOpen;
      if (isOpen) {
        this.errorMessage = '';
      }
    });
  }

  closeModal(): void {
    this.modalService.closeLoginModal();
  }

  async onGoogleSignIn(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = '';

    try {
      const user = await this.authService.signInWithGoogle();
      console.log('Google Sign-In successful:', user);
      this.closeModal();
      
      // Navigate to home or dashboard
      this.router.navigate(['/']);
    } catch (error: any) {
      console.error('Google Sign-In error:', error);
      if (error.code === 'auth/popup-closed-by-user') {
        this.errorMessage = 'Sign-in was cancelled';
      } else if (error.code === 'auth/popup-blocked') {
        this.errorMessage = 'Pop-up was blocked. Please allow pop-ups for this site';
      } else if (error.code === 'auth/unauthorized-domain') {
        this.errorMessage = 'This domain is not authorized. Please add it in Firebase Console';
      } else {
        this.errorMessage = 'Failed to sign in with Google. Please try again';
      }
    } finally {
      this.isLoading = false;
    }
  }
}
