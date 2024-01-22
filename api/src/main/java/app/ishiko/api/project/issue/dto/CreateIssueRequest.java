package app.ishiko.api.project.issue.dto;

import java.time.Instant;
import org.springframework.format.annotation.DateTimeFormat;
import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class CreateIssueRequest {
    @NotNull(message = "Subject cannot be null")
    @Size(min = 1, max = 255, message = "Subject must be between 1 and 255 characters")
    private String subject;
    @Nullable
    @Size(max = 9000, message = "Description may be a maximum of 9000 characters")
    private String description;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    @Nullable
    private Instant dueDate;
    private String project;
    @Nullable
    private Integer status;
    @Nullable
    private Integer label;

    public CreateIssueRequest() {}

    public CreateIssueRequest(
            @NotNull(message = "Subject cannot be null") @Size(min = 1, max = 255,
                    message = "Subject must be between 1 and 255 characters") String subject,
            @Size(max = 9000,
                    message = "Description may be a maximum of 9000 characters") String description,
            Instant dueDate, String project, Integer status, Integer label) {
        this.subject = subject;
        this.description = description;
        this.dueDate = dueDate;
        this.project = project;
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

    public Instant getDueDate() {
        return dueDate;
    }

    public void setDueDate(Instant dueDate) {
        this.dueDate = dueDate;
    }

    public String getProject() {
        return project;
    }

    public void setProject(String project) {
        this.project = project;
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
