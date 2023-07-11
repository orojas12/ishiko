package app.ishiko.ishikoserver.users;

import app.ishiko.ishikoserver.exceptions.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getUser(String username) throws ResourceNotFoundException {
        User user;
        Optional<User> userOptional = userRepository.getByUsername(username);
        if (userOptional.isPresent()) {
            user = userOptional.get();
        } else {
            throw new ResourceNotFoundException("Username '" + username + "' not found");
        }
        return user;
    }
}
