package pl.dmcs.university.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pl.dmcs.university.model.User;
import pl.dmcs.university.repository.UserRepository;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600)
@RequestMapping("/api/students")
public class StudentRESTController {

    @Autowired
    UserRepository userRepository;

    // Endpoint dla Nauczyciela/Admina do pobierania listy wszystkich studentów
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<User> findAllStudents() {
        // Zwracamy listę wszystkich użytkowników w systemie.
        // (W przyszłości na froncie będziemy z tej listy wybierać komu wstawić ocenę)
        return userRepository.findAll();
    }
}