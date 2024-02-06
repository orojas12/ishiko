package app.ishiko.api.user;

import jakarta.persistence.*;

@Entity
@EntityListeners(PreventWrite.class)
@Table(name = "users")
public class User {

    @Id
    private String username;

    public User() {}

    public User(String username) {
        this.username = username;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
