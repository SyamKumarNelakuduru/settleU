import { Component, inject, EventEmitter, Output, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  @Output() close = new EventEmitter<void>();

  private authService = inject(AuthService);
  private userService = inject(UserService);
  private router = inject(Router);

  isLoading = false;
  errorMessage = '';
  isAdminMode = false;
  
  // Admin login form fields
  adminEmail = '';
  adminPassword = '';

  closeModal(): void {
    this.close.emit();
  }

  toggleAdminMode(): void {
    this.isAdminMode = !this.isAdminMode;
    this.errorMessage = '';
    this.adminEmail = '';
    this.adminPassword = '';
  }

  async onAdminSignIn(): Promise<void> {
    console.log('=== Admin Sign-In Started ===');
    console.log('Email:', this.adminEmail);
    console.log('Password length:', this.adminPassword?.length);
    
    this.isLoading = true;
    this.errorMessage = '';

    if (!this.adminEmail || !this.adminPassword) {
      this.errorMessage = 'Please enter both email and password';
      this.isLoading = false;
      return;
    }

    try {
      console.log('Attempting to sign in...');
      const user = await this.authService.signIn(this.adminEmail, this.adminPassword);
      console.log('✅ Admin Sign-In successful:', user);
      console.log('User UID:', user.uid);
      console.log('User Email:', user.email);
      
      // Get user profile to check role
      console.log('Fetching user profile...');
      const profile = await this.userService.getUserProfile(user.uid);
      console.log('User profile:', profile);
      console.log('User role:', profile?.role);
      
      this.closeModal();
      
      // Navigate based on role
      if (profile?.role === 'admin') {
        console.log('Navigating to /admin');
        this.router.navigate(['/admin']);
      } else {
        console.log('Navigating to / (not admin)');
        this.router.navigate(['/']);
      }
    } catch (error: any) {
      console.error('❌ Admin Sign-In error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.error('Full error:', JSON.stringify(error, null, 2));
      
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-login-credentials') {
        this.errorMessage = 'Invalid email or password. Please check your credentials.';
      } else if (error.code === 'auth/user-not-found') {
        this.errorMessage = 'Admin account not found. Please contact administrator.';
      } else if (error.code === 'auth/too-many-requests') {
        this.errorMessage = 'Too many failed attempts. Please try again later.';
      } else if (error.code === 'auth/network-request-failed') {
        this.errorMessage = 'Network error. Please check your connection.';
      } else {
        this.errorMessage = `Failed to sign in: ${error.message || 'Please try again'}`;
      }
    } finally {
      this.isLoading = false;
      console.log('=== Admin Sign-In Finished ===');
    }
  }

  async onGoogleSignIn(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = '';

    try {
      const user = await this.authService.signInWithGoogle();
      console.log('Google Sign-In successful:', user);
      
      // Get user profile to check role
      const profile = await this.userService.getUserProfile(user.uid);
      
      this.closeModal();
      
      // Navigate based on role
      if (profile?.role === 'admin') {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/']);
      }
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
