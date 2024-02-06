package app.ishiko.api.project.issue.dto;

import jakarta.annotation.Nullable;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.Instant;
import java.util.Optional;

public class IssueDto {

    private Integer id;
    private String subject;
    @Nullable
    private String description;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private Instant createDate;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    @Nullable
    private Instant dueDate;
    private String project;
    private String author;
    @Nullable
    private IssueStatusDto status = new IssueStatusDto();
    @Nullable
    private IssueLabelDto label = new IssueLabelDto();

    public IssueDto() {}

    public IssueDto(Integer id, String subject, @Nullable String description,
            Instant createDate, @Nullable Instant dueDate, String project,
            String author, @Nullable IssueStatusDto status,
            @Nullable IssueLabelDto label) {
        this.id = id;
        this.subject = subject;
        this.description = description;
        this.createDate = createDate;
        this.dueDate = dueDate;
        this.project = project;
        this.author = author;
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

    public Instant getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Instant createDate) {
        this.createDate = createDate;
    }

    public Optional<Instant> getDueDate() {
        return Optional.ofNullable(dueDate);
    }

    public void setDueDate(@Nullable Instant dueDate) {
        this.dueDate = dueDate;
    }

    public String getProject() {
        return project;
    }

    public void setProject(String project) {
        this.project = project;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public Optional<IssueStatusDto> getStatus() {
        return Optional.ofNullable(status);
    }

    public void setStatus(@Nullable IssueStatusDto status) {
        this.status = status;
    }

    public Optional<IssueLabelDto> getLabel() {
        return Optional.ofNullable(label);
    }

    public void setLabel(@Nullable IssueLabelDto label) {
        this.label = label;
    }
}
