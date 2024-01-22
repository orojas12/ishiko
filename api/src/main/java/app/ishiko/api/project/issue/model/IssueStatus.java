package app.ishiko.api.project.issue.model;

import jakarta.persistence.*;

@Entity
@Table(name = "status")
public class IssueStatus {
    @Id
    @SequenceGenerator(name = "status_id_seq", sequenceName = "status_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "status_id_seq")
    private Integer id = 1;

    @Column(nullable = false)
    private String name = "";

    public IssueStatus() {
    }

    public IssueStatus(Integer id, String name) {
        this.id = id;
        this.name = name;
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
}
