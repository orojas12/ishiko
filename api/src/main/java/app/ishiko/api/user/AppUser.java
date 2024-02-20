package app.ishiko.api.user;

import jakarta.persistence.*;

@Entity
@EntityListeners(PreventWrite.class)
@Table(name = "users")
public class AppUser {

    @Id
    private String username;

    public AppUser() {}

    public AppUser(String username) {
        this.username = username;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
