import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AlumniService, Alumni } from '../../services/alumni.service';

declare var bootstrap: any;

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent implements OnInit {
  alumniList: Alumni[] = [];
  filteredAlumniList: Alumni[] = [];
  stats: any = {
    totalAlumni: 0,
    verifiedAlumni: 0,
    unverifiedAlumni: 0,
    batchStats: [],
    topCompanies: [],
  };

  loading = false;
  searchTerm = '';
  filterStatus = 'all';
  filterBatch = '';
  successMessage = '';
  errorMessage = '';
  alumniToDelete: Alumni | null = null;

  constructor(private alumniService: AlumniService, private router: Router) {}

  ngOnInit(): void {
    this.loadData();
  }

  // Load all data with Promise demonstration
  async loadData(): Promise<void> {
    this.loading = true;

    try {
      // Load alumni and stats in parallel using Promise.all
      const [alumniResponse, statsResponse] = await Promise.all([
        this.alumniService.getAllAlumni(),
        this.alumniService.getAdminStats(),
      ]);

      if (alumniResponse.success) {
        this.alumniList = alumniResponse.data || [];
        this.filteredAlumniList = [...this.alumniList];
      }

      if (statsResponse.success) {
        this.stats = statsResponse.data;
      }
    } catch (error: any) {
      console.error('Error loading data:', error);
      this.errorMessage = 'Failed to load dashboard data.';
    } finally {
      this.loading = false;
    }
  }

  filterAlumni(): void {
    this.filteredAlumniList = this.alumniList.filter((alumni) => {
      // Search filter
      const matchesSearch =
        !this.searchTerm ||
        alumni.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        alumni.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        alumni.currentCompany.toLowerCase().includes(this.searchTerm.toLowerCase());

      // Status filter
      const matchesStatus =
        this.filterStatus === 'all' ||
        (this.filterStatus === 'verified' && alumni.isVerified) ||
        (this.filterStatus === 'unverified' && !alumni.isVerified);

      // Batch filter
      const matchesBatch = !this.filterBatch || alumni.batch === this.filterBatch;

      return matchesSearch && matchesStatus && matchesBatch;
    });
  }

  // Verify alumni with Promise demonstration
  async verifyAlumni(id: string): Promise<void> {
    try {
      const response = await this.alumniService.verifyAlumni(id);

      if (response.success) {
        this.successMessage = 'Alumni verified successfully!';
        this.loadData(); // Reload data

        setTimeout(() => (this.successMessage = ''), 3000);
      }
    } catch (error: any) {
      console.error('Error verifying alumni:', error);
      this.errorMessage = 'Failed to verify alumni.';
      setTimeout(() => (this.errorMessage = ''), 3000);
    }
  }

  editAlumni(id: string): void {
    this.router.navigate(['/update-profile', id]);
  }

  confirmDelete(alumni: Alumni): void {
    this.alumniToDelete = alumni;
    const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
    modal.show();
  }

  // Delete alumni with Promise demonstration
  async deleteAlumni(): Promise<void> {
    if (!this.alumniToDelete?._id) return;

    this.loading = true;

    try {
      const response = await this.alumniService.deleteAlumni(this.alumniToDelete._id);

      if (response.success) {
        this.successMessage = 'Alumni profile deleted successfully!';

        // Close modal
        const modalElement = document.getElementById('deleteModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal?.hide();

        this.alumniToDelete = null;
        this.loadData(); // Reload data

        setTimeout(() => (this.successMessage = ''), 3000);
      }
    } catch (error: any) {
      console.error('Error deleting alumni:', error);
      this.errorMessage = 'Failed to delete alumni profile.';
      setTimeout(() => (this.errorMessage = ''), 3000);
    } finally {
      this.loading = false;
    }
  }

  getInitials(name: string): string {
    const names = name.split(' ');
    if (names.length >= 2) {
      return names[0][0] + names[1][0];
    }
    return name.substring(0, 2).toUpperCase();
  }
}
