import { Component, EventEmitter, Input, Output, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent {
  @Input() title = '';
  @Input() items: any[] = [];
  @Output() close = new EventEmitter<void>();

  @HostListener('document:keydown.escape')
  onEscape() { this.close.emit(); }
}
