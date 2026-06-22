package pl.dmcs.university.model;

import jakarta.persistence.*;

@Entity
@Table(name = "grades")
public class Grade {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private double value; // e.g., 3.0, 4.5, 5.0

    @ManyToOne
    @JoinColumn(name = "student_id")
    private User student;

    @ManyToOne
    @JoinColumn(name = "subject_id")
    private Subject subject;

    public Grade() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public double getValue() { return value; }
    public void setValue(double value) { this.value = value; }
    public User getStudent() { return student; }
    public void setStudent(User student) { this.student = student; }
    public Subject getSubject() { return subject; }
    public void setSubject(Subject subject) { this.subject = subject; }
}