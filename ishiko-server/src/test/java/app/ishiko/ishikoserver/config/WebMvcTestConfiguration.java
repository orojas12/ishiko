package app.ishiko.ishikoserver.config;

import app.ishiko.ishikoserver.security.SecurityConfig;
import app.ishiko.ishikoserver.security.user.UserDetailsServiceImpl;
import app.ishiko.ishikoserver.security.user.UserRepository;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;

@TestConfiguration
@Import({SecurityConfig.class, UserDetailsServiceImpl.class})
public class WebMvcTestConfiguration {
    @MockBean
    public UserRepository userRepository;
}
