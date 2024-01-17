package app.ishiko.api.project.issue.dto;

import java.time.Instant;
import java.util.Optional;
import org.springframework.format.annotation.DateTimeFormat;
import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class UpdateIssueDto {
    @NotNull
    private Integer id;
    @NotNull(message = "Subject cannot be null")
    @Size(min = 1, max = 255, message = "Subject must be between 1 and 255 characters")
    private String subject;
    @Nullable
    @Size(max = 9000, message = "Description may be a maximum of 9000 characters")
    private String description;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    @Nullable
    private Instant dueDate;
    @Nullable
    private Integer status;
    @Nullable
    private Integer label;

    public UpdateIssueDto() {}

    public UpdateIssueDto(Integer id, String subject, @Nullable String description,
            @Nullable Instant dueDate, @Nullable Integer status, @Nullable Integer label) {
        this.id = id;
        this.subject = subject;
        this.description = description;
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

    public Optional<String> getDescription() {
        return Optional.ofNullable(description);
    }

    public void setDescription(@Nullable String description) {
        this.description = description;
    }

    public Optional<Instant> getDueDate() {
        return Optional.ofNullable(dueDate);
    }

    public void setDueDate(@Nullable Instant dueDate) {
        this.dueDate = dueDate;
    }

    public Optional<Integer> getStatus() {
        return Optional.ofNullable(status);
    }

    public void setStatus(@Nullable Integer status) {
        this.status = status;
    }

    public Optional<Integer> getLabel() {
        return Optional.ofNullable(label);
    }

    public void setLabel(@Nullable Integer label) {
        this.label = label;
    }
}
