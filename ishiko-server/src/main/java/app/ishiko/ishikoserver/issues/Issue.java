package app.ishiko.ishikoserver.issues;

import app.ishiko.ishikoserver.projects.Project;
import app.ishiko.ishikoserver.users.User;
import jakarta.persistence.*;

import java.time.Instant;
import java.util.List;

@Entity
@Table(name = "issues")
public class Issue {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;
    private String subject;
    private Instant datetime;
    @ManyToOne
    private Project project;
    @ManyToMany
    private List<User> assignedTo;

    public Issue() {
    }

    public Issue(int id, String subject, Instant datetime, List<User> assignedTo, Project project) {
        this.id = id;
        this.subject = subject;
        this.datetime = datetime;
        this.assignedTo = assignedTo;
        this.project = project;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public Instant getDateTime() {
        return datetime;
    }

    public void setDateTime(Instant date) {
        this.datetime = date;
    }

    public List<User> getAssignedTo() {
        return assignedTo;
    }

    public void setAssignedTo(List<User> assignees) {
        this.assignedTo = assignees;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }
}
