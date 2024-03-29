package app.ishiko.api.issue.dto;

public class IssueStatusDto {
    private Integer id = 1;
    private String name = "";

    public IssueStatusDto() {
    }

    public IssueStatusDto(Integer id, String name) {
        this.id = id;
        this.name = name;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
