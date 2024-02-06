package app.ishiko.api.project;

import java.util.List;
import app.ishiko.api.project.issue.dto.IssueLabelDto;
import app.ishiko.api.project.issue.dto.IssueStatusDto;

public class ProjectDto {
    private String id;
    private String name;
    private String description;
    private String owner;
    private List<IssueStatusDto> statuses;
    private List<IssueLabelDto> labels;

    public ProjectDto() {}

    public ProjectDto(String id, String name, String description,
            String owner) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.owner = owner;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getOwner() {
        return owner;
    }

    public void setOwner(String owner) {
        this.owner = owner;
    }

    public List<IssueStatusDto> getStatuses() {
        return statuses;
    }

    public void setStatuses(List<IssueStatusDto> statuses) {
        this.statuses = statuses;
    }

    public List<IssueLabelDto> getLabels() {
        return labels;
    }

    public void setLabels(List<IssueLabelDto> labels) {
        this.labels = labels;
    }
}
