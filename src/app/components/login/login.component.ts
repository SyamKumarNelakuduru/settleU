import { Component, inject, EventEmitter, Output, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  @Output() close = new EventEmitter<void>();

  private authService = inject(AuthService);
  private router = inject(Router);

  isLoading = false;
  errorMessage = '';

  closeModal(): void {
    this.close.emit();
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

  @HostListener('window:keydown.escape')
  onEscape(): void {
    this.close.emit();
  }
}
