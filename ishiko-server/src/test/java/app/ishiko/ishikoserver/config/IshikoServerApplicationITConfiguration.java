package app.ishiko.ishikoserver.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.client.TestRestTemplate.HttpClientOption;
import org.springframework.context.annotation.Bean;

@TestConfiguration
public class IshikoServerApplicationITConfiguration {


    @Value("${spring.security.user.name}")
    private String username;

    @Value("${spring.security.user.password}")
    private String password;

    @Bean
    TestRestTemplate testRestTemplate() {
        return new TestRestTemplate(HttpClientOption.ENABLE_COOKIES);
    }

    @Bean
    UsernamePassword usernamePassword() {
        return new UsernamePassword(username, password);
    }

    public record UsernamePassword(String username, String password) {
    }
}
