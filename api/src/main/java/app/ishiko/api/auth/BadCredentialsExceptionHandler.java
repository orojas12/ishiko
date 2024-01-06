package app.ishiko.api.auth;

import com.fasterxml.jackson.databind.ObjectMapper;

public class BadCredentialsExceptionHandler extends DefaultAuthenticationExceptionHandler {
    public BadCredentialsExceptionHandler(ObjectMapper mapper) {
        super(mapper);
        this.errorMessage = "Invalid username or password";
    }
}
