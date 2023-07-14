package app.ishiko.ishikoserver.issues;

import java.util.List;

public class IssueDto {

    private int id;
    private String subject;
    private long datetime;
    private List<String> assignedTo;
    private int projectId;

    public IssueDto(String subject) {
        this.subject = subject;
    }

    public IssueDto(String subject, List<String> assignedTo) {
        this.subject = subject;
        this.assignedTo = assignedTo;
    }

    public IssueDto(int id, String subject, long datetime, List<String> assignedTo, int projectId) {
        this.id = id;
        this.subject = subject;
        this.datetime = datetime;
        this.assignedTo = assignedTo;
        this.projectId = projectId;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public long getDateTime() {
        return datetime;
    }

    public void setDateTime(long datetime) {
        this.datetime = datetime;
    }

    public List<String> getAssignedTo() {
        return assignedTo;
    }

    public void setAssignedTo(List<String> assignedTo) {
        this.assignedTo = assignedTo;
    }

    public int getProjectId() {
        return projectId;
    }

    public void setProjectId(int projectId) {
        this.projectId = projectId;
    }
}
