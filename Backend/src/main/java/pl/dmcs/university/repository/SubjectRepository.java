package pl.dmcs.university.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.dmcs.university.model.Subject;
import pl.dmcs.university.model.User;
import java.util.List;
import java.util.Optional;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Long> {
    List<Subject> findByTeacher(User teacher);
    boolean existsByPassword(String password);
    Optional<Subject> findByPassword(String password);
    List<Subject> findByStudentsContaining(User student);
}
