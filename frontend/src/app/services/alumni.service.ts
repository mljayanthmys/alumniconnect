import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Alumni {
  _id?: string;
  name: string;
  email: string;
  batch: string;
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
  private apiUrl = 'http://localhost:5000/api/alumni';

  constructor(private http: HttpClient) {}

  // CREATE - Register new alumni (demonstrating Promise usage)
  registerAlumni(alumni: Alumni): Promise<ApiResponse> {
    return new Promise((resolve, reject) => {
      this.http.post<ApiResponse>(`${this.apiUrl}/register`, alumni).subscribe({
        next: (response) => resolve(response),
        error: (error) => reject(error),
      });
    });
  }

  // READ - Get all alumni (demonstrating Promise usage)
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

  // READ - Get single alumni by ID
  getAlumniById(id: string): Promise<ApiResponse> {
    return new Promise((resolve, reject) => {
      this.http.get<ApiResponse>(`${this.apiUrl}/${id}`).subscribe({
        next: (response) => resolve(response),
        error: (error) => reject(error),
      });
    });
  }

  // UPDATE - Update alumni profile (demonstrating Promise usage)
  updateAlumni(id: string, alumni: Partial<Alumni>): Promise<ApiResponse> {
    return new Promise((resolve, reject) => {
      this.http.put<ApiResponse>(`${this.apiUrl}/${id}`, alumni).subscribe({
        next: (response) => resolve(response),
        error: (error) => reject(error),
      });
    });
  }

  // DELETE - Delete alumni profile (demonstrating Promise usage)
  deleteAlumni(id: string): Promise<ApiResponse> {
    return new Promise((resolve, reject) => {
      this.http.delete<ApiResponse>(`${this.apiUrl}/${id}`).subscribe({
        next: (response) => resolve(response),
        error: (error) => reject(error),
      });
    });
  }

  // Get admin statistics
  getAdminStats(): Promise<ApiResponse> {
    return new Promise((resolve, reject) => {
      this.http.get<ApiResponse>(`${this.apiUrl}/admin/stats`).subscribe({
        next: (response) => resolve(response),
        error: (error) => reject(error),
      });
    });
  }

  // Verify alumni
  verifyAlumni(id: string): Promise<ApiResponse> {
    return new Promise((resolve, reject) => {
      this.http.patch<ApiResponse>(`${this.apiUrl}/${id}/verify`, {}).subscribe({
        next: (response) => resolve(response),
        error: (error) => reject(error),
      });
    });
  }
}
