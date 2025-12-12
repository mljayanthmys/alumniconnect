import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { AlumniService, Alumni } from '../../services/alumni.service';

@Component({
  selector: 'app-update-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './update-profile.component.html',
  styleUrl: './update-profile.component.css',
})
export class UpdateProfileComponent implements OnInit {
  alumni: Alumni | null = null;
  alumniId: string = '';
  skillsInput = '';
  loading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private alumniService: AlumniService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.alumniId = this.route.snapshot.paramMap.get('id') || '';
    if (this.alumniId) {
      this.loadAlumniProfile();
    }
  }

  // Load alumni profile with Promise demonstration
  async loadAlumniProfile(): Promise<void> {
    this.loading = true;

    try {
      const response = await this.alumniService.getAlumniById(this.alumniId);

      if (response.success) {
        this.alumni = response.data;

        // Convert skills array to comma-separated string
        if (this.alumni?.skills && this.alumni.skills.length > 0) {
          this.skillsInput = this.alumni.skills.join(', ');
        }
      }
    } catch (error: any) {
      console.error('Error loading profile:', error);
      this.errorMessage = 'Failed to load profile. Please try again.';
    } finally {
      this.loading = false;
    }
  }

  // Update profile with Promise demonstration
  async onUpdate(): Promise<void> {
    if (!this.alumni) return;

    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    // Process skills
    if (this.skillsInput) {
      this.alumni.skills = this.skillsInput
        .split(',')
        .map((skill) => skill.trim())
        .filter((skill) => skill);
    }

    try {
      console.log('Updating alumni:', this.alumni);
      const response = await this.alumniService.updateAlumni(this.alumniId, this.alumni);

      if (response.success) {
        this.successMessage = response.message || 'Profile updated successfully!';
        this.alumni = response.data;

        // Scroll to top to show success message
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Redirect after 2 seconds
        setTimeout(() => {
          this.router.navigate(['/directory']);
        }, 2000);
      }
    } catch (error: any) {
      console.error('Update error:', error);
      this.errorMessage = error.error?.message || 'Failed to update profile. Please try again.';
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
