package app.ishiko.api.project.issue.model;

import jakarta.persistence.*;

@Entity
@Table(name = "label")
public class IssueLabel {
    @Id
    @SequenceGenerator(name = "label_id_seq", sequenceName = "label_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "label_id_seq")
    private Integer id = 1;

    @Column(nullable = false)
    private String name = "";

    public IssueLabel() {
    }

    public IssueLabel(Integer id, String name) {
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
