package app.ishiko.ishikoserver.features.projects;

public class ProjectRequest {

    private String title;
    private String owner;

    public ProjectRequest() {
    }

    public ProjectRequest(String title, String owner) {
        this.title = title;
        this.owner = owner;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getOwner() {
        return owner;
    }

    public void setOwner(String owner) {
        this.owner = owner;
    }
}
