import { Component, signal, OnInit, inject } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { AuthService } from './services/auth.service';
import { ModalService } from './services/modal.service';
import { User } from 'firebase/auth';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, HeaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('settleU');
  public currentUser = signal<User | null>(null);
  public readonly currentYear = new Date().getFullYear();

  private authService = inject(AuthService);
  private modalService = inject(ModalService);

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      this.currentUser.set(user);
    });
  }

  openSearch(): void {
    this.modalService.openSearch();
  }

  openLogin(): void {
    this.modalService.openLoginModal();
  }
}
