package com.ishiko.api.issue.model;

import jakarta.persistence.*;

@Entity
@Table(name = "issue_status")
public class IssueStatus {
    @Id
    @SequenceGenerator(name = "issue_status_id_seq", sequenceName = "issue_status_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "issue_status_id_seq")
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
