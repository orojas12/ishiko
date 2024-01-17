package app.ishiko.api.project;

import app.ishiko.api.user.User;
import jakarta.annotation.Nullable;
import jakarta.persistence.*;

@Entity
@Table(name = "project")
public class Project {
    @Id
    String id;

    @Column(nullable = false)
    String name;

    @Nullable
    String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "username")
    User owner;

    public Project() {}

    public Project(String id, String name, @Nullable String description) {
        this.id = id;
        this.name = name;
        this.description = description;
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

    @Nullable
    public String getDescription() {
        return description;
    }

    public void setDescription(@Nullable String description) {
        this.description = description;
    }

    public User getOwner() {
        return owner;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }
}
