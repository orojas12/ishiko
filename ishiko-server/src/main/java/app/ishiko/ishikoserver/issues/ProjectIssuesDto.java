package app.ishiko.ishikoserver.issues;

import java.util.List;

public class ProjectIssuesDto {

    private int projectId;
    private List<IssueDto> issues;

    public ProjectIssuesDto(int projectId, List<IssueDto> issues) {
        this.projectId = projectId;
        this.issues = issues;
    }

    public int getProjectId() {
        return projectId;
    }

    public void setProjectId(int projectId) {
        this.projectId = projectId;
    }

    public List<IssueDto> getIssues() {
        return issues;
    }

    public void setIssues(List<IssueDto> issues) {
        this.issues = issues;
    }
}
