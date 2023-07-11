package app.ishiko.ishikoserver.issues;

import app.ishiko.ishikoserver.users.User;
import jakarta.persistence.*;

import java.util.Date;
import java.util.List;

@Entity
@Table(name = "issues")
public class Issue {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;
    private String subject;
    private Date date;
    @ManyToMany
    private List<User> assignees;

    public Issue() {
    }

    public Issue(int id, String subject, Date date, List<User> assignees) {
        this.id = id;
        this.subject = subject;
        this.date = date;
        this.assignees = assignees;
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

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public List<User> getAssignees() {
        return assignees;
    }

    public void setAssignees(List<User> assignees) {
        this.assignees = assignees;
    }
}
