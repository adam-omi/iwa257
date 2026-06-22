import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard implements OnInit {
  newSubject = { name: '', description: '', password: '' };

  students: any[] = [];
  subjects: any[] = [];
  isSortedAsc = true;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef, private router: Router) {}

  ngOnInit() {
    this.loadAllData();
  }

  loadAllData() {
    const token = localStorage.getItem('auth-token');
    const headers = { 'Authorization': `Bearer ${token}` };

    // Pobieranie studentów 
    this.http.get<any[]>('http://localhost:8080/api/students', { headers }).subscribe({
      next: (data: any[]) => {
        this.students = data.filter(user => 
          !user.roles.some((role: any) => role.name === 'ROLE_ADMIN')
        );
        this.cdr.detectChanges(); 
      },
      error: err => console.error('Błąd pobierania studentów:', err)
    });

    this.http.get<any[]>('http://localhost:8080/api/admin/subjects', { headers }).subscribe({
      next: (data: any[]) => {
        this.subjects = data;
        this.cdr.detectChanges(); 
      },
      error: err => console.error('Błąd pobierania przedmiotów:', err)
    });
  }

  addSubject() {
    // Sprawdzamy czy podano nazwę i hasło
    if (!this.newSubject.name || !this.newSubject.password) {
      alert('Nazwa przedmiotu i hasło są wymagane!');
      return;
    }

    const token = localStorage.getItem('auth-token');
    const headers = { 'Authorization': `Bearer ${token}` };

    this.http.post('http://localhost:8080/api/admin/subjects', this.newSubject, { headers }).subscribe({
      next: () => {
        alert('Przedmiot dodany pomyślnie!');
        this.newSubject = { name: '', description: '', password: '' };
        this.loadAllData();
      },
      error: err => alert('Błąd dodawania przedmiotu. Sprawdź konsolę.')
    });
  }

  goToSubject(subjectId: number) {
    this.router.navigate(['/admin/subject', subjectId]);
  }

  toggleSortGrades() {
    this.isSortedAsc = !this.isSortedAsc;
    this.subjects.sort((a, b) => this.isSortedAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));
    this.cdr.detectChanges();
  }

  logout() {
    // 1. Usuwamy token z pamięci przeglądarki
    localStorage.removeItem('auth-token');
    // 2. Wyrzucamy użytkownika do ekranu logowania
    this.router.navigate(['/login']);
  }
}