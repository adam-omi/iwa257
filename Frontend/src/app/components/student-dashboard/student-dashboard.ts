import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-dashboard.html',
  styleUrl: './student-dashboard.css'
})

export class StudentDashboard implements OnInit {
  enrollPassword: string = '';
  mySubjects: any[] = [];
  
  myGrades: { [subjectId: number]: any[] } = {};

  constructor(
    private http: HttpClient, 
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadMyData();
  }

  loadMyData() {
    const token = localStorage.getItem('auth-token');
    const headers = { 'Authorization': `Bearer ${token}` };

    this.http.get<any[]>('http://localhost:8080/api/student/subjects', { headers }).subscribe({
      next: (data) => {
        this.mySubjects = data;
        this.cdr.detectChanges();
      }
    });

    this.http.get<any[]>('http://localhost:8080/api/student/grades', { headers }).subscribe({
      next: (data) => {
        this.myGrades = {};
        data.forEach(grade => {
          const subId = grade.subject.id;
          if (!this.myGrades[subId]) {
            this.myGrades[subId] = [];
          }
          this.myGrades[subId].push(grade);
        });
        this.cdr.detectChanges();
      }
    });
  }

  enroll() {
    if (!this.enrollPassword.trim()) {
      alert('Wpisz hasło przedmiotu!');
      return;
    }

    const token = localStorage.getItem('auth-token');
    const headers = { 'Authorization': `Bearer ${token}` };

    this.http.post('http://localhost:8080/api/student/enroll', { password: this.enrollPassword }, { headers }).subscribe({
      next: () => {
        alert('Pomyślnie dołączono do przedmiotu!');
        this.enrollPassword = ''; 
        this.loadMyData();   
      },
      error: err => {
        if (err.error && err.error.message) {
          alert(err.error.message); 
        } else {
          alert('Błędne hasło lub przedmiot nie istnieje!');
        }
      }
    });
  }

  logout() {
    localStorage.removeItem('auth-token');
    this.router.navigate(['/login']);
  }
}