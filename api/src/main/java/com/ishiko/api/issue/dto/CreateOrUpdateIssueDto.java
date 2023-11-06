package com.ishiko.api.issue.dto;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.Instant;
import java.util.Optional;

public class CreateOrUpdateIssueDto {
    @NotNull(message = "Subject cannot be null")
    @Size(min = 1, max = 255, message = "Subject must be between 1 and 255 characters")
    private String subject;
    @Size(max = 1000, message = "Description must be a maximum of 1000 characters")
    private String description = "";
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    @Nullable
    private Instant dueDate;
    @NotNull
    private Integer status = 1;
    @NotNull
    private Integer label = 1;

    public CreateOrUpdateIssueDto() {
    }

    public CreateOrUpdateIssueDto(String subject, String description, @Nullable Instant dueDate, Integer status, Integer label) {
        this.subject = subject;
        this.description = description;
        this.dueDate = dueDate;
        this.status = status;
        this.label = label;
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

    public Optional<Instant> getDueDate() {
        return Optional.ofNullable(dueDate);
    }

    public void setDueDate(@Nullable Instant dueDate) {
        this.dueDate = dueDate;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public Integer getLabel() {
        return label;
    }

    public void setLabel(Integer label) {
        this.label = label;
    }
}
