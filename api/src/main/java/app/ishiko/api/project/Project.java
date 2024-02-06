package app.ishiko.api.project;

import java.util.List;
import app.ishiko.api.project.issue.model.IssueLabel;
import app.ishiko.api.project.issue.model.IssueStatus;
import app.ishiko.api.user.User;
import jakarta.annotation.Nullable;
import jakarta.persistence.*;

@Entity
@Table(name = "project")
public class Project {
    @Id
    String id;

    @Column(nullable = false)
    String name;

    @Nullable
    String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner", referencedColumnName = "username",
            nullable = false)
    User owner;

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "project")
    private List<IssueStatus> issueStatuses;

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "project")
    private List<IssueLabel> issueLabels;

    public Project() {}

    public Project(String id, String name, @Nullable String description) {
        this.id = id;
        this.name = name;
        this.description = description;
    }

    public Project(String id, String name, @Nullable String description,
            User owner) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.owner = owner;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Nullable
    public String getDescription() {
        return description;
    }

    public void setDescription(@Nullable String description) {
        this.description = description;
    }

    public User getOwner() {
        return owner;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }

    public List<IssueStatus> getIssueStatuses() {
        return issueStatuses;
    }

    public void setIssueStatuses(List<IssueStatus> issueStatuses) {
        this.issueStatuses = issueStatuses;
    }

    public List<IssueLabel> getIssueLabels() {
        return issueLabels;
    }

    public void setIssueLabels(List<IssueLabel> issueLabels) {
        this.issueLabels = issueLabels;
    }
}
