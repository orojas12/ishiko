package com.ishiko.api.issue.dto;

import jakarta.annotation.Nullable;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.Instant;
import java.util.Optional;

public class IssueDto {

    private Integer id;
    private String subject;
    private String description;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private Instant createdDate;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    @Nullable
    private Instant dueDate;
    private IssueStatusDto status = new IssueStatusDto();
    private IssueLabelDto label = new IssueLabelDto();

    public IssueDto() {
    }

    public IssueDto(Integer id, String subject, String description, Instant createdDate, @Nullable Instant dueDate,
                    IssueStatusDto status, IssueLabelDto label) {
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

    public Optional<Instant> getDueDate() {
        return Optional.ofNullable(dueDate);
    }

    public void setDueDate(@Nullable Instant dueDate) {
        this.dueDate = dueDate;
    }

    public IssueStatusDto getStatus() {
        return status;
    }

    public void setStatus(IssueStatusDto status) {
        this.status = status;
    }

    public IssueLabelDto getLabel() {
        return label;
    }

    public void setLabel(IssueLabelDto label) {
        this.label = label;
    }
}
