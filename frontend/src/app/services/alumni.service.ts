import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs'; // Used only for typing, not for the core logic (which uses Promises)

// --- Alumni Interface (Extended Data Model) ---
export interface Alumni {
  _id?: string;
  name: string;
  email: string;
  batch: string; // Changed to string/number if backend expects number
  currentCompany: string;
  jobRole: string;
  location: string;
  phone?: string;
  linkedIn?: string;
  skills?: string[];
  bio?: string;
  isVerified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// --- API Response Interface ---
export interface ApiResponse {
  success: boolean;
  message?: string;
  data?: any;
  count?: number;
}

@Injectable({
  providedIn: 'root',
})
export class AlumniService {
  // CRITICAL: REPLACE THIS with your live Render API base URL
  // New Base URL is: https://alumniconnect-sgkm.onrender.com/api/alumni
  private apiUrl = 'https://alumniconnect-sgkm.onrender.com/api/alumni';

  // Standard headers for JSON communication
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient) {}

  // ===========================================
  // C - CREATE: Register new alumni (Uses Promise)
  // Maps to: POST /api/alumni/register
  // ===========================================
  registerAlumni(alumni: Alumni): Promise<ApiResponse> {
    return new Promise((resolve, reject) => {
      // .subscribe is used inside the Promise wrapper to convert Observable to Promise
      this.http
        .post<ApiResponse>(`${this.apiUrl}/register`, alumni, this.httpOptions)
        .subscribe({
          next: (response) => resolve(response),
          error: (error) => reject(error),
        });
    });
  }

  // ===========================================
  // R - READ: Get all alumni (Uses Promise)
  // Maps to: GET /api/alumni/directory
  // ===========================================
  getAllAlumni(filters?: any): Promise<ApiResponse> {
    return new Promise((resolve, reject) => {
      let url = `${this.apiUrl}/directory`;

      if (filters) {
        const params = new URLSearchParams();
        if (filters.batch) params.append('batch', filters.batch);
        if (filters.company) params.append('company', filters.company);
        if (filters.search) params.append('search', filters.search);
        url += `?${params.toString()}`;
      }

      this.http.get<ApiResponse>(url).subscribe({
        next: (response) => resolve(response),
        error: (error) => reject(error),
      });
    });
  }

  // ===========================================
  // R - READ: Get single alumni by ID (Uses Promise)
  // Maps to: GET /api/alumni/:id
  // ===========================================
  getAlumniById(id: string): Promise<ApiResponse> {
    return new Promise((resolve, reject) => {
      this.http.get<ApiResponse>(`${this.apiUrl}/${id}`).subscribe({
        next: (response) => resolve(response),
        error: (error) => reject(error),
      });
    });
  }

  // ===========================================
  // U - UPDATE: Update alumni profile (Uses Promise)
  // Maps to: PUT /api/alumni/:id
  // ===========================================
  updateAlumni(id: string, alumni: Partial<Alumni>): Promise<ApiResponse> {
    return new Promise((resolve, reject) => {
      this.http
        .put<ApiResponse>(`${this.apiUrl}/${id}`, alumni, this.httpOptions)
        .subscribe({
          next: (response) => resolve(response),
          error: (error) => reject(error),
        });
    });
  }

  // ===========================================
  // D - DELETE: Delete alumni profile (Uses Promise)
  // Maps to: DELETE /api/alumni/:id
  // ===========================================
  deleteAlumni(id: string): Promise<ApiResponse> {
    return new Promise((resolve, reject) => {
      this.http.delete<ApiResponse>(`${this.apiUrl}/${id}`).subscribe({
        next: (response) => resolve(response),
        error: (error) => reject(error),
      });
    });
  }

  // ===========================================
  // ADMIN STATS (Uses Promise)
  // Maps to: GET /api/alumni/admin/stats
  // ===========================================
  getAdminStats(): Promise<ApiResponse> {
    return new Promise((resolve, reject) => {
      this.http.get<ApiResponse>(`${this.apiUrl}/admin/stats`).subscribe({
        next: (response) => resolve(response),
        error: (error) => reject(error),
      });
    });
  }

  // ===========================================
  // VERIFY ALUMNI (Uses Promise)
  // Maps to: PATCH /api/alumni/:id/verify
  // ===========================================
  verifyAlumni(id: string): Promise<ApiResponse> {
    return new Promise((resolve, reject) => {
      this.http
        .patch<ApiResponse>(`${this.apiUrl}/${id}/verify`, {}, this.httpOptions)
        .subscribe({
          next: (response) => resolve(response),
          error: (error) => reject(error),
        });
    });
  }
}
