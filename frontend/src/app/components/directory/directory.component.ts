import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AlumniService, Alumni } from '../../services/alumni.service';

@Component({
  selector: 'app-directory',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './directory.component.html',
  styleUrl: './directory.component.css',
})
export class DirectoryComponent implements OnInit {
  alumniList: Alumni[] = [];
  loading = false;
  searchTerm = '';
  selectedBatch = '';
  companyFilter = '';

  constructor(private alumniService: AlumniService, private router: Router) {}

  ngOnInit(): void {
    this.loadAlumni();
  }

  // Load alumni with Promise demonstration
  async loadAlumni(): Promise<void> {
    this.loading = true;

    try {
      const filters: any = {};
      if (this.selectedBatch) filters.batch = this.selectedBatch;
      if (this.companyFilter) filters.company = this.companyFilter;
      if (this.searchTerm) filters.search = this.searchTerm;

      // Using Promise (demonstrating async/await with Promises)
      const response = await this.alumniService.getAllAlumni(filters);

      if (response.success) {
        this.alumniList = response.data || [];
      }
    } catch (error: any) {
      console.error('Error loading alumni:', error);
      alert('Failed to load alumni directory. Please try again.');
    } finally {
      this.loading = false;
    }
  }

  onSearch(): void {
    // Debounce search for better UX
    setTimeout(() => {
      this.loadAlumni();
    }, 500);
  }

  onFilterChange(): void {
    this.loadAlumni();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedBatch = '';
    this.companyFilter = '';
    this.loadAlumni();
  }

  getInitials(name: string): string {
    const names = name.split(' ');
    if (names.length >= 2) {
      return names[0][0] + names[1][0];
    }
    return name.substring(0, 2).toUpperCase();
  }

  viewProfile(id: string): void {
    this.router.navigate(['/update-profile', id]);
  }

  openLinkedIn(linkedInUrl: string): void {
    if (linkedInUrl) {
      const url = linkedInUrl.startsWith('http') ? linkedInUrl : `https://${linkedInUrl}`;
      window.open(url, '_blank');
    }
  }
}
