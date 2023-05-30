package app.ishiko.ishikoserver.security.filters;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.session.SessionAuthenticationStrategy;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.IOException;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Similar to {@link org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter } except it
 * obtains username and password from a json request body.
 */
@Component
public class JsonAuthenticationFilter extends UsernamePasswordAuthenticationFilter {

    private final ObjectMapper objectMapper;
    private boolean postOnly = true;

    public JsonAuthenticationFilter(
            ObjectMapper objectMapper,
            AuthenticationManager authenticationManager,
            SessionAuthenticationStrategy sessionAuthenticationStrategy
    ) {
        super(authenticationManager);
        this.objectMapper = objectMapper;
        setSessionAuthenticationStrategy(sessionAuthenticationStrategy);
        setFilterProcessesUrl("/login");
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)
            throws AuthenticationException {
        if (this.postOnly && !request.getMethod().equals("POST")) {
            throw new AuthenticationServiceException("Authentication method not supported: " + request.getMethod());
        }
        Optional<UsernamePassword> credentials = getUsernamePasswordFromRequest(request);
        UsernamePasswordAuthenticationToken authRequest = getUsernamePasswordToken(credentials);
        setDetails(request, authRequest);
        return this.getAuthenticationManager().authenticate(authRequest);
    }

    private UsernamePasswordAuthenticationToken getUsernamePasswordToken(Optional<UsernamePassword> usernamePassword) {
        if (usernamePassword.isPresent()) {
            UsernamePassword credentials = usernamePassword.get();
            return UsernamePasswordAuthenticationToken.unauthenticated(
                    credentials.getUsername(),
                    credentials.getPassword()
            );
        } else {
            return UsernamePasswordAuthenticationToken.unauthenticated("", "");
        }
    }

    private Optional<UsernamePassword> getUsernamePasswordFromRequest(HttpServletRequest request) {
        try (BufferedReader reader = request.getReader()) {
            // get json data from request body
            String data = reader.lines().collect(Collectors.joining(System.lineSeparator()));
            // deserialize to object containing username and password
            UsernamePassword usernamePassword = objectMapper.readValue(data, UsernamePassword.class);
            return Optional.of(usernamePassword);
        } catch (IOException e) {
            return Optional.empty();
        }
    }

    private class UsernamePassword {

        private final String username;
        private final String password;

        public UsernamePassword(String username, String password) {
            this.username = username.trim();
            this.password = password;
        }

        public String getUsername() {
            return username;
        }

        public String getPassword() {
            return password;
        }
    }
}
