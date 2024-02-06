package app.ishiko.api.project.issue.model;

import app.ishiko.api.project.Project;
import app.ishiko.api.user.User;

import jakarta.annotation.Nullable;
import jakarta.persistence.*;

import java.time.Instant;
import java.util.Optional;

@Entity
@Table(name = "issue")
public class Issue {
    @Id
    @SequenceGenerator(name = "issue_id_seq", sequenceName = "issue_id_seq",
            allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE,
            generator = "issue_id_seq")
    private Integer id;
    @Column(nullable = false)
    private String subject;
    @Nullable
    private String description;
    @Column(nullable = false)
    private Instant createDate = Instant.now();
    @Nullable
    private Instant dueDate;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project", nullable = false)
    private Project project;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author", referencedColumnName = "username",
            nullable = false)
    private User author;
    @Nullable
    @ManyToOne
    @JoinColumn(name = "status")
    private IssueStatus status = new IssueStatus();
    @Nullable
    @ManyToOne
    @JoinColumn(name = "label")
    private IssueLabel label = new IssueLabel();

    public Issue() {}

    public Issue(Integer id, String subject, @Nullable String description,
            Instant createDate, @Nullable Instant dueDate, User author,
            Project project) {
        this.id = id;
        this.subject = subject;
        this.description = description;
        this.createDate = createDate;
        this.dueDate = dueDate;
        this.author = author;
        this.project = project;
    }

    public Issue(Integer id, String subject, @Nullable String description,
            Instant createDate, @Nullable Instant dueDate, User author,
            Project project, @Nullable IssueStatus status,
            @Nullable IssueLabel label) {
        this.id = id;
        this.subject = subject;
        this.description = description;
        this.createDate = createDate;
        this.dueDate = dueDate;
        this.author = author;
        this.project = project;
        this.status = status;
        this.label = label;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public Optional<String> getDescription() {
        return Optional.ofNullable(description);
    }

    public void setDescription(@Nullable String description) {
        this.description = description;
    }

    public Instant getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Instant createDate) {
        this.createDate = createDate;
    }

    public Optional<Instant> getDueDate() {
        return Optional.ofNullable(dueDate);
    }

    public void setDueDate(@Nullable Instant dueDate) {
        this.dueDate = dueDate;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public User getAuthor() {
        return author;
    }

    public void setAuthor(User author) {
        this.author = author;
    }

    public Optional<IssueStatus> getStatus() {
        return Optional.ofNullable(status);
    }

    public void setStatus(@Nullable IssueStatus status) {
        this.status = status;
    }

    public Optional<IssueLabel> getLabel() {
        return Optional.ofNullable(label);
    }

    public void setLabel(@Nullable IssueLabel label) {
        this.label = label;
    }
}
