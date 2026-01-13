import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UniversityService } from '../../services/university.service';

interface SeedingOption {
  id: string;
  title: string;
  description: string;
  method: string;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-data-seeding',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './data-seeding.component.html',
  styleUrl: './data-seeding.component.scss'
})
export class DataSeedingComponent {
  private universityService = inject(UniversityService);

  isSeeding = signal(false);
  currentOperation = signal('');
  results = signal<string[]>([]);
  showResults = signal(false);

  seedingOptions: SeedingOption[] = [
    {
      id: 'universities',
      title: 'Seed Universities',
      description: 'Add 20 Illinois universities with basic information (name, address, website)',
      method: 'seedUniversities',
      icon: '🏛️',
      color: '#667eea'
    },
    {
      id: 'details',
      title: 'Seed University Details',
      description: 'Add about descriptions and student enrollment data (total, international, domestic)',
      method: 'seedUniversityDetails',
      icon: '📊',
      color: '#764ba2'
    },
    {
      id: 'safety',
      title: 'Seed Safety Data',
      description: 'Add safety information and best areas to live for each university',
      method: 'seedUniversitySafetyData',
      icon: '🛡️',
      color: '#f093fb'
    },
    {
      id: 'accommodation',
      title: 'Seed Accommodation Data',
      description: 'Add accommodation groups (Facebook, Discord) and housing tips',
      method: 'seedUniversityAccommodationData',
      icon: '🏠',
      color: '#4facfe'
    }
  ];

  async seedData(option: SeedingOption) {
    if (this.isSeeding()) return;

    const confirmMsg = `Are you sure you want to run: ${option.title}?\n\nThis will update university data in Firestore.`;
    if (!confirm(confirmMsg)) return;

    this.isSeeding.set(true);
    this.currentOperation.set(option.title);
    this.results.set([]);
    this.showResults.set(true);

    const startTime = Date.now();
    this.addResult(`🚀 Starting: ${option.title}`, 'info');
    this.addResult(`⏰ ${new Date().toLocaleTimeString()}`, 'info');

    try {
      let result: any;

      // Call the appropriate seeding method
      switch (option.method) {
        case 'seedUniversities':
          result = await this.universityService.seedUniversities();
          this.displayUniversitiesResult(result);
          break;
        case 'seedUniversityDetails':
          result = await this.universityService.seedUniversityDetails();
          this.displayStandardResult(result);
          break;
        case 'seedUniversitySafetyData':
          result = await this.universityService.seedUniversitySafetyData();
          this.displayStandardResult(result);
          break;
        case 'seedUniversityAccommodationData':
          result = await this.universityService.seedUniversityAccommodationData();
          this.displayStandardResult(result);
          break;
        default:
          throw new Error('Unknown seeding method');
      }

      const duration = ((Date.now() - startTime) / 1000).toFixed(2);
      this.addResult('', 'info');
      this.addResult(`✨ Completed successfully in ${duration}s`, 'success');

    } catch (error: any) {
      this.addResult('', 'info');
      this.addResult(`❌ Error: ${error.message}`, 'error');
      console.error('Seeding error:', error);
    } finally {
      this.isSeeding.set(false);
      this.currentOperation.set('');
    }
  }

  private displayUniversitiesResult(result: { added: number; skipped: number; errors: string[] }) {
    this.addResult('', 'info');
    this.addResult('📋 Results:', 'info');
    this.addResult(`✅ Added: ${result.added} universities`, 'success');
    this.addResult(`⏭️  Skipped: ${result.skipped} universities (already exist)`, 'warning');
    
    if (result.errors && result.errors.length > 0) {
      this.addResult(`❌ Errors: ${result.errors.length}`, 'error');
      result.errors.forEach(error => this.addResult(`   ${error}`, 'error'));
    } else {
      this.addResult('✨ No errors encountered', 'success');
    }
  }

  private displayStandardResult(result: { updated: number; errors: string[] }) {
    this.addResult('', 'info');
    this.addResult('📋 Results:', 'info');
    this.addResult(`✅ Updated: ${result.updated} universities`, 'success');
    
    if (result.errors && result.errors.length > 0) {
      this.addResult(`❌ Errors: ${result.errors.length}`, 'error');
      result.errors.forEach(error => this.addResult(`   ${error}`, 'error'));
    } else {
      this.addResult('✨ No errors encountered', 'success');
    }
  }

  private addResult(message: string, type: 'info' | 'success' | 'warning' | 'error') {
    const current = this.results();
    this.results.set([...current, `${type}:${message}`]);
  }

  clearResults() {
    this.results.set([]);
    this.showResults.set(false);
  }

  async removeAccommodationData() {
    if (this.isSeeding()) return;

    const confirmMsg = '⚠️ WARNING!\n\nThis will REMOVE accommodation data from all universities.\n\nType "REMOVE" to confirm:';
    const userInput = prompt(confirmMsg);
    
    if (userInput !== 'REMOVE') {
      alert('Operation cancelled');
      return;
    }

    this.isSeeding.set(true);
    this.currentOperation.set('Remove Accommodation Data');
    this.results.set([]);
    this.showResults.set(true);

    const startTime = Date.now();
    this.addResult('🗑️  Starting: Remove Accommodation Data', 'warning');
    this.addResult(`⏰ ${new Date().toLocaleTimeString()}`, 'info');

    try {
      const result = await this.universityService.removeAccommodationData();
      
      this.addResult('', 'info');
      this.addResult('📋 Results:', 'info');
      this.addResult(`✅ Updated: ${result.updated} universities`, 'success');
      
      if (result.errors && result.errors.length > 0) {
        this.addResult(`❌ Errors: ${result.errors.length}`, 'error');
        result.errors.forEach(error => this.addResult(`   ${error}`, 'error'));
      }

      const duration = ((Date.now() - startTime) / 1000).toFixed(2);
      this.addResult('', 'info');
      this.addResult(`✨ Completed in ${duration}s`, 'success');

    } catch (error: any) {
      this.addResult('', 'info');
      this.addResult(`❌ Error: ${error.message}`, 'error');
      console.error('Remove error:', error);
    } finally {
      this.isSeeding.set(false);
      this.currentOperation.set('');
    }
  }

  async deleteAllUniversities() {
    if (this.isSeeding()) return;

    const confirmMsg = '⚠️ DANGER! PERMANENT DELETION!\n\nThis will DELETE ALL UNIVERSITIES from Firestore.\nThis action CANNOT be undone!\n\nType "DELETE ALL" to confirm:';
    const userInput = prompt(confirmMsg);
    
    if (userInput !== 'DELETE ALL') {
      alert('Operation cancelled');
      return;
    }

    // Second confirmation
    const finalConfirm = confirm('Are you ABSOLUTELY sure? This will permanently delete all university data!');
    if (!finalConfirm) {
      alert('Operation cancelled');
      return;
    }

    this.isSeeding.set(true);
    this.currentOperation.set('Delete All Universities');
    this.results.set([]);
    this.showResults.set(true);

    const startTime = Date.now();
    this.addResult('⚠️  Starting: Delete All Universities', 'error');
    this.addResult(`⏰ ${new Date().toLocaleTimeString()}`, 'info');

    try {
      const result = await this.universityService.deleteAllUniversities();
      
      this.addResult('', 'info');
      this.addResult('📋 Results:', 'info');
      this.addResult(`🗑️  Deleted: ${result.deleted} universities`, 'warning');
      
      if (result.errors && result.errors.length > 0) {
        this.addResult(`❌ Errors: ${result.errors.length}`, 'error');
        result.errors.forEach(error => this.addResult(`   ${error}`, 'error'));
      }

      const duration = ((Date.now() - startTime) / 1000).toFixed(2);
      this.addResult('', 'info');
      this.addResult(`✨ Completed in ${duration}s`, 'success');

    } catch (error: any) {
      this.addResult('', 'info');
      this.addResult(`❌ Error: ${error.message}`, 'error');
      console.error('Delete error:', error);
    } finally {
      this.isSeeding.set(false);
      this.currentOperation.set('');
    }
  }

  getResultClass(result: string): string {
    if (result.startsWith('success:')) return 'result-success';
    if (result.startsWith('error:')) return 'result-error';
    if (result.startsWith('warning:')) return 'result-warning';
    return 'result-info';
  }

  getResultText(result: string): string {
    return result.split(':')[1] || result;
  }
}
