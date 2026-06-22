import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  isLoginMode = true;

  loginForm: any = { username: '', password: '' };

  signupForm: any = {
    name: '',
    username: '',
    email: '',
    password: '',
    role: ['student'], 
    adminSecret: ''    
  };

  // sekretny klucz, który trzeba znać, by zarejestrować Admina
  private SECRET_ADMIN_CODE = 'admin';

  constructor(private http: HttpClient, private router: Router) {}

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onLoginSubmit() {
    this.http.post('http://localhost:8080/api/auth/signin', this.loginForm).subscribe({
      next: (data: any) => {
        localStorage.setItem('auth-token', data.accessToken);
        if (data.authorities && data.authorities.some((a: any) => a.authority === 'ROLE_ADMIN')) {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/student']);
        }
      },
      error: err => alert('Błąd logowania! Sprawdź dane.')
    });
  }

  onSignupSubmit() {
    if (this.signupForm.role.includes('admin')) {
      if (this.signupForm.adminSecret !== this.SECRET_ADMIN_CODE) {
        alert('Niepoprawny kod autoryzacyjny dla Administratora!');
        return;
      }
    }

    const payload = {
      username: this.signupForm.username,
      name: this.signupForm.name,
      email: this.signupForm.email,
      password: this.signupForm.password,
      role: this.signupForm.role
    };

    this.http.post('http://localhost:8080/api/auth/signup', payload).subscribe({
      next: (res: any) => {
        alert('Konto zarejestrowane pomyślnie! Możesz się teraz zalogować.');
        this.isLoginMode = true; 
        this.loginForm.username = this.signupForm.username; 
      },
      error: err => alert('Błąd rejestracji! Nazwa użytkownika może być zajęta.')
    });
  }
}