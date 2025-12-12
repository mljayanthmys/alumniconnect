import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AlumniService, Alumni } from '../../services/alumni.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  alumni: Alumni = {
    name: '',
    email: '',
    batch: '',
    currentCompany: '',
    jobRole: '',
    location: '',
    phone: '',
    linkedIn: '',
    skills: [],
    bio: '',
  };

  skillsInput = '';
  loading = false;
  successMessage = '';
  errorMessage = '';

  constructor(private alumniService: AlumniService, private router: Router) {}

  // Submit form with Promise demonstration
  async onSubmit(): Promise<void> {
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
      // Using Promise (demonstrating async/await)
      console.log('Registering alumni:', this.alumni);
      const response = await this.alumniService.registerAlumni(this.alumni);

      if (response.success) {
        this.successMessage = response.message || 'Registration successful!';

        // Show success message for 2 seconds then redirect
        setTimeout(() => {
          this.router.navigate(['/directory']);
        }, 2000);
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      this.errorMessage = error.error?.message || 'Registration failed. Please try again.';

      // Scroll to top to show error
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      this.loading = false;
    }
  }
}
