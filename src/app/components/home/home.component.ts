import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [CommonModule]
})
export class HomeComponent implements OnInit, OnDestroy {
  currentSlide = 0;
  slides = [0, 1, 2];
  private autoPlayInterval: any;

  ngOnInit(): void {
    this.startAutoPlay();
  }

  ngOnDestroy(): void {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
    }
  }

  get transformValue(): string {
    // Container is 300% wide, each slide is 33.333% (100% of viewport)
    // To move one slide, we translate by 33.333% of container width
    const translatePercent = (this.currentSlide * 100) / this.slides.length;
    return `translateX(-${translatePercent}%)`;
  }

  nextSlide(): void {
    if (this.currentSlide < this.slides.length - 1) {
      this.currentSlide++;
    } else {
      this.currentSlide = 0; // Loop back to first slide
    }
    this.resetAutoPlay();
  }

  previousSlide(): void {
    if (this.currentSlide > 0) {
      this.currentSlide--;
    } else {
      this.currentSlide = this.slides.length - 1; // Loop to last slide
    }
    this.resetAutoPlay();
  }

  goToSlide(index: number): void {
    if (index >= 0 && index < this.slides.length) {
      this.currentSlide = index;
      this.resetAutoPlay();
    }
  }

  startAutoPlay(): void {
    this.autoPlayInterval = setInterval(() => {
      this.nextSlide();
    }, 5000); // Change slide every 5 seconds
  }

  resetAutoPlay(): void {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
    }
    this.startAutoPlay();
  }
}
