import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  private modalService = inject(ModalService);
  appName = 'Lewis University';

  ngOnInit(): void {
    console.log('Header initialized with app name:', this.appName);
  }

  onSearchClick(): void {
    // TODO: Implement search functionality
    console.log('Search clicked');
  }

  onLoginClick(): void {
    this.modalService.openLoginModal();
  }
}
