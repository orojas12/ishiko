package app.ishiko.api.auth;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.User.UserBuilder;
import org.springframework.security.provisioning.UserDetailsManager;
import org.springframework.stereotype.Service;

import app.ishiko.api.exception.InvalidInputException;

@Service
public class AuthService {
    private UserDetailsManager manager;

    public AuthService(UserDetailsManager manager) {
        this.manager = manager;
    }

    public void signUpUser(SignUpDto dto) throws InvalidInputException {
        if (manager.userExists(dto.username())) {
            throw new InvalidInputException("This username already exists");
        }
        UserBuilder user = User.builder();
        user.username(dto.username()).password("{noop}" + dto.password())
                .authorities("ROLE_USER");
        manager.createUser(user.build());
    }
}
