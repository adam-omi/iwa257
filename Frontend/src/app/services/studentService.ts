import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, Observable, of, tap} from 'rxjs';
import {Student} from '../models/student';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})
export class StudentService {

  private http = inject(HttpClient);

  private studentsUrl = 'http://localhost:8080/students';

  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(this.studentsUrl).pipe(
      tap((studentsList: Student[]) => this.log(`size of the list = ${studentsList.length}`)),
      catchError(this.handleError<Student[]>('getStudent all'))
    );
  }

  getStudent(id: number): Observable<Student> {
    const url = `${this.studentsUrl}/${id}`;
    return this.http.get<Student>(url).pipe(
      tap(_ => this.log(`fetched student id=${id}`)),
      catchError(this.handleError<Student>(`getStudent id=${id}`))
    );
  }

  addStudent(student: Student): Observable<Student> {
    return this.http.post<Student>(this.studentsUrl, student, httpOptions).pipe(
      tap((studentAdded: Student) => this.log(`added student id=${studentAdded.id}`)),
      catchError(this.handleError<Student>('addStudent'))
    );
  }

  deleteStudent(student: Student | number): Observable<Student> {
    const id = typeof student === 'number' ? student : student.id;
    const url = `${this.studentsUrl}/${id}`;
    return this.http.delete<Student>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted student id=${id}`)),
      catchError(this.handleError<Student>('deleteStudent'))
    );
  }

  deleteStudents(): Observable<Student> {
    return this.http.delete<Student>(this.studentsUrl, httpOptions).pipe(
      tap(_ => this.log(`deleted students`)),
      catchError(this.handleError<Student>('deleteStudents'))
    );
  }

  updateStudent(student: Student, id:number): Observable<Student> {
    return this.http.put<Student>(`${this.studentsUrl}/${id}`, student, httpOptions).pipe(
      tap((studentUpdated: Student) => this.log(`updated student id=${studentUpdated.id}`)),
      catchError(this.handleError<any>('updateStudent'))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a StudentService message with the MessageService */
  private log(message: string) {
    console.log('StudentService: ' + message);
  }

}









