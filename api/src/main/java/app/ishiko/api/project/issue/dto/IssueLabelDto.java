package app.ishiko.api.project.issue.dto;

public class IssueLabelDto {
    private Integer id = 1;
    private String name = "";

    public IssueLabelDto() {}

    public IssueLabelDto(Integer id, String name) {
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
