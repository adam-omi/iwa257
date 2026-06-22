package pl.dmcs.university.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "subjects")
public class Subject {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;

    private String password;

    @ManyToOne
    @JoinColumn(name = "teacher_id")
    @JsonIgnoreProperties({"password", "roles"})
    private User teacher;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "subject_students",
            joinColumns = @JoinColumn(name = "subject_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id"))
    @JsonIgnoreProperties({"password", "roles"})
    private Set<User> students = new HashSet<>();

    public Subject() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public User getTeacher() { return teacher; }
    public void setTeacher(User teacher) { this.teacher = teacher; }

    public Set<User> getStudents() { return students; }
    public void setStudents(Set<User> students) { this.students = students; }
}