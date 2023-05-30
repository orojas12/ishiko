package app.ishiko.ishikoserver.security.user;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface UserRepository extends JpaRepository<User, String> {
    public Optional<User> getByUsername(String username);
}
