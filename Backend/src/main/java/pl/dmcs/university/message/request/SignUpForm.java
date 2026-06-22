package pl.dmcs.university.message.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.Set;

public class SignUpForm {

    @NotBlank
    @Size(min = 3, max = 50)
    private String username;

    // NOWE POLA:
    private String name;
    private String email;

    private Set<String> role;

    @NotBlank
    @Size(min = 6, max = 40)
    private String password;

    // Gettery i settery dla nowych pól
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    // Stare, istniejące gettery i settery:
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public Set<String> getRole() { return role; }
    public void setRole(Set<String> role) { this.role = role; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}