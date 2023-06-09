package app.ishiko.ishikoserver.security.user;

import app.ishiko.ishikoserver.features.projects.Project;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.util.List;


@Entity
@Table(name = "users")
public class User {

    @Id
    private String id;

    @NotNull
    private String username;

    @NotNull
    private String password;
    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL)
    private List<Project> projects;

    public User() {
    }

    public User(String id, String username, String password) {
        this.id = id;
        this.username = username;
        this.password = password;
    }

    public List<Project> getProjects() {
        return projects;
    }

    public void setProjects(List<Project> projects) {
        this.projects = projects;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @Override
    public String toString() {
        return "User{" +
                "id='" + id + '\'' +
                ", username='" + username + '\'' +
                ", password='" + password + '\'' +
                ", projects=" + projects +
                '}';
    }
}