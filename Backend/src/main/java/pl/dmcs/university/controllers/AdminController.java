package pl.dmcs.university.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import pl.dmcs.university.model.Subject;
import pl.dmcs.university.model.Grade;
import pl.dmcs.university.model.User;
import pl.dmcs.university.repository.SubjectRepository;
import pl.dmcs.university.repository.GradeRepository;
import pl.dmcs.university.repository.UserRepository;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600)
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    SubjectRepository subjectRepository;

    @Autowired
    GradeRepository gradeRepository;

    @Autowired
    UserRepository userRepository;

    // TWORZENIE PRZEDMIOTU
    @PostMapping("/subjects")
    @PreAuthorize("hasRole('ADMIN')")
    public org.springframework.http.ResponseEntity<?> addSubject(@RequestBody Subject subject) {

        // ZABEZPIECZENIE: Sprawdzamy, czy hasło jest już zajęte
        if (subjectRepository.existsByPassword(subject.getPassword())) {
            return org.springframework.http.ResponseEntity.badRequest()
                    .body(new pl.dmcs.university.message.response.ResponseMessage("Błąd: To hasło jest już używane przez inny przedmiot!"));
        }

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentTeacher = userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new RuntimeException("Nie znaleziono nauczyciela!"));

        subject.setTeacher(currentTeacher);
        subjectRepository.save(subject);

        return org.springframework.http.ResponseEntity.ok(subject);
    }

    // POBIERANIE SZCZEGÓŁÓW PRZEDMIOTU (wraz z listą uczniów)
    @GetMapping("/subjects/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Subject getSubjectDetails(@PathVariable Long id) {
        return subjectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono przedmiotu!"));
    }

    // PRZYPISYWANIE UCZNIA DO PRZEDMIOTU
    @PostMapping("/subjects/{subjectId}/students/{studentId}")
    @PreAuthorize("hasRole('ADMIN')")
    public org.springframework.http.ResponseEntity<?> addStudentToSubject(
            @PathVariable Long subjectId,
            @PathVariable Long studentId) {

        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono przedmiotu!"));

        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono studenta!"));

        subject.getStudents().add(student);
        subjectRepository.save(subject);

        return org.springframework.http.ResponseEntity.ok(
                new pl.dmcs.university.message.response.ResponseMessage("Uczeń przypisany pomyślnie!")
        );
    }

    // POBIERANIE PRZEDMIOTÓW
    @GetMapping("/subjects")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Subject> getAdminSubjects() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();

        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono użytkownika!"));

        return subjectRepository.findByTeacher(currentUser);
    }

    // WYSTAWIANIE OCENY
    @PostMapping("/grades")
    @PreAuthorize("hasRole('ADMIN')")
    public Grade assignGrade(@RequestBody Grade grade) {
        return gradeRepository.save(grade);
    }

    // POBIERANIE OCEN DLA KONKRETNEGO PRZEDMIOTU
    @GetMapping("/subjects/{subjectId}/grades")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Grade> getSubjectGrades(@PathVariable Long subjectId) {
        return gradeRepository.findBySubjectId(subjectId);
    }
}