import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, OnChanges, SimpleChanges, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

Chart.register(...registerables);

interface CountryData {
  country: string;
  students: number;
}

@Component({
  selector: 'app-international-student-demographics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './international-student-demographics.component.html',
  styleUrl: './international-student-demographics.component.scss'
})
export class InternationalStudentDemographicsComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  @Input() isOpen: boolean = false;
  @Input() universityName: string = '';
  @Output() close = new EventEmitter<void>();
  @ViewChild('pieChart', { static: false }) pieChartRef!: ElementRef<HTMLCanvasElement>;

  private chart: Chart<'pie'> | null = null;
  
  // Mock data for 10 countries
  private mockCountryData: CountryData[] = [
    { country: 'China', students: 1250 },
    { country: 'India', students: 980 },
    { country: 'South Korea', students: 750 },
    { country: 'Saudi Arabia', students: 620 },
    { country: 'Canada', students: 540 },
    { country: 'Brazil', students: 480 },
    { country: 'Mexico', students: 420 },
    { country: 'Germany', students: 380 },
    { country: 'Japan', students: 320 },
    { country: 'United Kingdom', students: 280 }
  ];

  ngOnInit() {
    if (this.isOpen) {
      document.body.style.overflow = 'hidden';
    }
  }

  ngAfterViewInit() {
    if (this.isOpen) {
      // Initialize chart after view is fully rendered
      this.initializeChart();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isOpen']) {
      if (this.isOpen) {
        document.body.style.overflow = 'hidden';
        // Wait for Angular to render the view, then initialize chart
        setTimeout(() => {
          this.initializeChart();
        }, 0);
      } else {
        document.body.style.overflow = 'auto';
        this.destroyChart();
      }
    }
  }

  ngOnDestroy() {
    document.body.style.overflow = 'auto';
    this.destroyChart();
  }

  initializeChart(): void {
    // Check if canvas element exists, if not try again after a short delay
    if (!this.pieChartRef?.nativeElement) {
      console.log('Chart canvas not found, retrying in 100ms...');
      setTimeout(() => {
        this.initializeChart();
      }, 100);
      return;
    }

    // Destroy existing chart if any
    if (this.chart) {
      this.destroyChart();
    }

    const ctx = this.pieChartRef.nativeElement.getContext('2d');
    if (!ctx) {
      console.error('Could not get canvas context');
      return;
    }

    console.log('Initializing pie chart with mock data...', this.mockCountryData);

    const totalStudents = this.mockCountryData.reduce((sum, item) => sum + item.students, 0);
    
    const colors = [
      '#f093fb', '#f5576c', '#4facfe', '#00f2fe', '#43e97b',
      '#fa709a', '#fee140', '#30cfd0', '#330867', '#a8edea'
    ];

    // Determine legend position based on screen size
    const isMobile = window.innerWidth < 768;
    const legendPosition = isMobile ? 'bottom' : 'right';

    const config: ChartConfiguration<'pie'> = {
      type: 'pie',
      data: {
        labels: this.mockCountryData.map(item => item.country),
        datasets: [{
          data: this.mockCountryData.map(item => item.students),
          backgroundColor: colors,
          borderColor: '#ffffff',
          borderWidth: 2,
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: legendPosition,
            align: 'center',
            labels: {
              padding: isMobile ? 8 : 12,
              usePointStyle: true,
              pointStyle: 'circle',
              font: {
                size: isMobile ? 10 : 11,
                family: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
              },
              generateLabels: (chart) => {
                const data = chart.data;
                if (data.labels && data.datasets) {
                  return data.labels.map((label, i) => {
                    const dataset = data.datasets[0];
                    const value = dataset.data[i] as number;
                    const percentage = ((value / totalStudents) * 100).toFixed(1);
                    const labelText = isMobile 
                      ? `${label}: ${percentage}%`
                      : `${label}: ${value.toLocaleString()} (${percentage}%)`;
                    
                    // Safely get backgroundColor - it's an array in our case
                    const bgColor = Array.isArray(dataset.backgroundColor) 
                      ? (dataset.backgroundColor[i] as string)
                      : (dataset.backgroundColor as string);
                    
                    return {
                      text: labelText,
                      fillStyle: bgColor || '#f093fb',
                      strokeStyle: dataset.borderColor as string,
                      lineWidth: dataset.borderWidth as number,
                      hidden: false,
                      index: i
                    };
                  });
                }
                return [];
              }
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.parsed || 0;
                const percentage = ((value / totalStudents) * 100).toFixed(1);
                return `${label}: ${value.toLocaleString()} students (${percentage}%)`;
              }
            },
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 12,
            titleFont: {
              size: 14,
              weight: 'bold'
            },
            bodyFont: {
              size: 13
            }
          }
        }
      }
    };

    this.chart = new Chart(ctx, config);
    console.log('Pie chart initialized successfully with', this.mockCountryData.length, 'countries');
  }

  private destroyChart(): void {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }

  closeModal(): void {
    document.body.style.overflow = 'auto';
    this.close.emit();
  }

  onOverlayClick(): void {
    this.closeModal();
  }

  getTotalStudents(): number {
    return this.mockCountryData.reduce((sum, item) => sum + item.students, 0);
  }

  getCountryData(): CountryData[] {
    return this.mockCountryData;
  }
}
