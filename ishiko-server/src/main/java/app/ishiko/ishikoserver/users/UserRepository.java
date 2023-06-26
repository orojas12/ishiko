package app.ishiko.ishikoserver.users;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface UserRepository extends JpaRepository<UserEntity, String> {
    public Optional<UserEntity> getByUsername(String username);
}
