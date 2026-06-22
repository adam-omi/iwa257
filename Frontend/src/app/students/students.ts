import {Component, inject, OnInit, signal} from '@angular/core';
import {Student} from '../models/student';
import {StudentService} from '../services/studentService';

@Component({
  selector: 'app-students',
  imports: [],
  templateUrl: './students.html',
  styleUrl: './students.css',
})
export class Students implements OnInit {

  private studentService = inject(StudentService);

  studentList = signal<Student[]>([]);

  ngOnInit(){
    this.getStudents();
  }

  getStudents(): void {
    this.studentService.getStudents().subscribe({
      next: (newStudentList) => {
        this.studentList.set(newStudentList);
      },
      error: () => {},
      complete: () => {}
    });
  }

  add(firstname: string, lastname: string, email: string, telephone: string): void {
    firstname = firstname.trim();
    lastname = lastname.trim();
    email = email.trim();
    telephone = telephone.trim();
    this.studentService.addStudent({ firstname, lastname, email, telephone } as Student)
      .subscribe({
        next: (newStudent: Student) => {
          this.studentList.update((currentList: Student[]) => [...currentList, newStudent]);
           },
        error: () => {},
        complete: () => {}
      });
  }

  delete(student: Student): void {
    this.studentService.deleteStudent(student).subscribe(() => {
      this.studentList.update(currentList => currentList.filter(c => c !== student));
      }
    );
  }

  deleteAll(): void {
    this.studentService.deleteStudents().subscribe(() => {
      this.studentList.update(currentList => {
        console.log(`Deleting ${currentList.length} students.`);
        return [];
      });
      // or use .set() method
      // this.studentList.set([]);
      }
    );
  }

  update(firstname: string, lastname: string, email: string, telephone: string, chosenToUpdateStudent:Student):void {
    let id = chosenToUpdateStudent.id;
    firstname = firstname.trim();
    lastname = lastname.trim();
    email = email.trim();
    telephone = telephone.trim();
    console.log(id);
    if (id != undefined) {
      this.studentService.updateStudent({firstname, lastname, email, telephone} as Student, id)
        .subscribe({
          next: (updatedStudent: Student) => {
            this.studentList.update( currentStudents =>
            currentStudents.map(currentStudent =>
            currentStudent.id === updatedStudent.id ? updatedStudent : currentStudent))
          },
          error: () => {
          },
          complete: () => {
          }
        })
    }
  }

}















