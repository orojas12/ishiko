package app.ishiko.api.project.issue.model;

import app.ishiko.api.project.Project;
import jakarta.persistence.*;

@Entity
@Table(name = "status")
public class IssueStatus {
    @Id
    @SequenceGenerator(name = "status_id_seq", sequenceName = "status_id_seq",
            allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE,
            generator = "status_id_seq")
    private Integer id = 1;

    @Column(nullable = false)
    private String name = "";

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project", nullable = false)
    private Project project;

    public IssueStatus() {}

    public IssueStatus(Integer id, String name, Project project) {
        this.id = id;
        this.name = name;
        this.project = project;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }
}
