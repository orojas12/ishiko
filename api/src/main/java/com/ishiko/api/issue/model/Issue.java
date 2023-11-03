package com.ishiko.api.issue.model;

import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "issue")
public class Issue {
    @Id
    @SequenceGenerator(name = "issue_id_seq", sequenceName = "issue_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "issue_id_seq")
    private Integer id;
    @Column(nullable = false)
    private String subject = "Untitled issue";
    @Column(nullable = false)
    private String description = "No description";
    @Column(nullable = false)
    private Instant createdDate;
    private Instant dueDate;
    @ManyToOne
    @JoinColumn(name = "status")
    private IssueStatus status;
    @ManyToOne
    @JoinColumn(name = "label")
    private IssueLabel label;

    public Issue() {
    }

    public Issue(Integer id, String subject, String description, Instant createdDate, Instant dueDate) {
        this.id = id;
        this.subject = subject;
        this.description = description;
        this.createdDate = createdDate;
        this.dueDate = dueDate;
    }

    public Issue(Integer id, String subject, String description, Instant createdDate, Instant dueDate,
                 IssueStatus status, IssueLabel label) {
        this.id = id;
        this.subject = subject;
        this.description = description;
        this.createdDate = createdDate;
        this.dueDate = dueDate;
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Instant getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Instant createdDate) {
        this.createdDate = createdDate;
    }

    public Instant getDueDate() {
        return dueDate;
    }

    public void setDueDate(Instant dueDate) {
        this.dueDate = dueDate;
    }

    public IssueStatus getStatus() {
        return status;
    }

    public void setStatus(IssueStatus status) {
        this.status = status;
    }

    public IssueLabel getLabel() {
        return label;
    }

    public void setLabel(IssueLabel label) {
        this.label = label;
    }
}
