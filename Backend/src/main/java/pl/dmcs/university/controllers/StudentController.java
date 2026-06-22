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
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600)
@RequestMapping("/api/student")
public class StudentController {

    @Autowired
    SubjectRepository subjectRepository;

    @Autowired
    GradeRepository gradeRepository;

    @Autowired
    UserRepository userRepository;

    // 1. ZAPISYWANIE NA PRZEDMIOT ZA POMOCĄ HASŁA
    @PostMapping("/enroll")
    @PreAuthorize("hasRole('USER') or hasRole('STUDENT')")
    public org.springframework.http.ResponseEntity<?> enrollSubject(@RequestBody Map<String, String> payload) {
        String password = payload.get("password");

        // Szukamy przedmiotu o podanym haśle
        Subject subject = subjectRepository.findByPassword(password)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono przedmiotu z takim hasłem!"));

        // Pobieramy aktualnego studenta z tokena
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentStudent = userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new RuntimeException("Nie znaleziono studenta!"));

        // Zabezpieczenie przed podwójnym zapisaniem
        if(subject.getStudents().contains(currentStudent)) {
            return org.springframework.http.ResponseEntity.badRequest()
                    .body(new pl.dmcs.university.message.response.ResponseMessage("Już jesteś zapisany na ten przedmiot!"));
        }

        // Dopisywanie i zapis
        subject.getStudents().add(currentStudent);
        subjectRepository.save(subject);

        return org.springframework.http.ResponseEntity.ok(
                new pl.dmcs.university.message.response.ResponseMessage("Zapisano na przedmiot pomyślnie!")
        );
    }

    // 2. POBIERANIE TYLKO SWOICH PRZEDMIOTÓW
    @GetMapping("/subjects")
    @PreAuthorize("hasRole('USER') or hasRole('STUDENT')")
    public List<Subject> getMySubjects() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentStudent = userRepository.findByUsername(auth.getName()).get();
        return subjectRepository.findByStudentsContaining(currentStudent);
    }

    // 3. POBIERANIE TYLKO SWOICH OCEN
    @GetMapping("/grades")
    @PreAuthorize("hasRole('USER') or hasRole('STUDENT')")
    public List<Grade> getMyGrades() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentStudent = userRepository.findByUsername(auth.getName()).get();
        return gradeRepository.findByStudent(currentStudent);
    }
}