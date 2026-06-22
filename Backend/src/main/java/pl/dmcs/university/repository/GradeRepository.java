package pl.dmcs.university.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.dmcs.university.model.Grade;
import pl.dmcs.university.model.User;

import java.util.List;

@Repository
public interface GradeRepository extends JpaRepository<Grade, Long> {
    List<Grade> findByStudentId(Long studentId);
    List<Grade> findBySubjectId(Long subjectId);
    List<Grade> findByStudent(User student);
}