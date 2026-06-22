import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-subject-manage',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-subject-manage.html',
  styleUrl: './admin-subject-manage.css'
})
export class AdminSubjectManage implements OnInit { 
  subjectId: string | null = null;
  subjectDetails: any = null;
  enrolledStudents: any[] = []; 
  allStudents: any[] = [];      
  selectedStudentToAdd: number | null = null;
  inlineGrades: { [studentId: number]: number } = {};
  studentGrades: { [studentId: number]: any[] } = {};

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.subjectId = this.route.snapshot.paramMap.get('id');
    this.loadSubjectData();
    this.loadAllStudents();
    this.loadGrades(); // Odpalamy pobieranie ocen!
  }

  loadGrades() {
    const token = localStorage.getItem('auth-token');
    const headers = { 'Authorization': `Bearer ${token}` };

    this.http.get<any[]>(`http://localhost:8080/api/admin/subjects/${this.subjectId}/grades`, { headers }).subscribe({
      next: (data) => {
        this.studentGrades = {}; 
        
        data.forEach(grade => {
          const sId = grade.student.id;
          if (!this.studentGrades[sId]) {
            this.studentGrades[sId] = [];
          }
          this.studentGrades[sId].push(grade);
        });
        
        this.cdr.detectChanges();
      },
      error: err => console.error('Błąd pobierania ocen:', err)
    });
  }

  loadSubjectData() {
    const token = localStorage.getItem('auth-token');
    const headers = { 'Authorization': `Bearer ${token}` };
    this.http.get<any>(`http://localhost:8080/api/admin/subjects/${this.subjectId}`, { headers }).subscribe({
      next: (data) => {
        this.subjectDetails = data;
        this.enrolledStudents = data.students || [];
        this.cdr.detectChanges();
      }
    });
  }

  loadAllStudents() {
    const token = localStorage.getItem('auth-token');
    const headers = { 'Authorization': `Bearer ${token}` };
    this.http.get<any[]>('http://localhost:8080/api/students', { headers }).subscribe({
      next: (data) => {
        this.allStudents = data.filter(user => !user.roles.some((role: any) => role.name === 'ROLE_ADMIN'));
        this.cdr.detectChanges();
      }
    });
  }

  addStudentToSubject() {
    if (!this.selectedStudentToAdd) return;
    const token = localStorage.getItem('auth-token');
    const headers = { 'Authorization': `Bearer ${token}` };
    this.http.post(`http://localhost:8080/api/admin/subjects/${this.subjectId}/students/${this.selectedStudentToAdd}`, {}, { headers }).subscribe({
      next: () => {
        this.selectedStudentToAdd = null; 
        this.loadSubjectData();           
      }
    });
  }

  assignGrade(studentId: number) {
    const gradeValue = this.inlineGrades[studentId];
    if (!gradeValue) {
      alert('Wybierz najpierw ocenę z listy!');
      return;
    }

    const payload = {
      value: gradeValue,
      student: { id: studentId },
      subject: { id: Number(this.subjectId) }
    };

    const token = localStorage.getItem('auth-token');
    const headers = { 'Authorization': `Bearer ${token}` };

    this.http.post('http://localhost:8080/api/admin/grades', payload, { headers }).subscribe({
      next: () => {
        this.inlineGrades[studentId] = undefined as any; 
        this.loadGrades();
      },
      error: err => alert('Błąd podczas wystawiania oceny.')
    });
  }

  goBack() {
    this.router.navigate(['/admin']);
  }
}