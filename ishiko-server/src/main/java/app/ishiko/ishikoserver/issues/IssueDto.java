package app.ishiko.ishikoserver.issues;

import java.util.List;

public class IssueDto {

    private int id;
    private String subject;
    private long unixTime;
    private List<String> assignees;

    public IssueDto(String subject) {
        this.subject = subject;
    }

    public IssueDto(String subject, List<String> assignees) {
        this.subject = subject;
        this.assignees = assignees;
    }

    public IssueDto(int id, String subject, long unixTime, List<String> assignees) {
        this.id = id;
        this.subject = subject;
        this.unixTime = unixTime;
        this.assignees = assignees;
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

    public long getUnixTime() {
        return unixTime;
    }

    public void setUnixTime(long unixTime) {
        this.unixTime = unixTime;
    }

    public List<String> getAssignees() {
        return assignees;
    }

    public void setAssignees(List<String> assignees) {
        this.assignees = assignees;
    }
}
