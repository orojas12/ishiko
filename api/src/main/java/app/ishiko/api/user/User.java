package app.ishiko.api.user;

import jakarta.persistence.*;

@Entity
@EntityListeners(PreventWrite.class)
@Table(name = "users")
public class User {

    @Id
    private final String username;

    public User(String username) {
        this.username = username;
    }

    public String getUsername() {
        return username;
    }
}
