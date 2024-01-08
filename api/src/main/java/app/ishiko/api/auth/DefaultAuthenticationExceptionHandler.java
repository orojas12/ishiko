package app.ishiko.api.auth;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;

import java.io.IOException;

public class DefaultAuthenticationExceptionHandler implements AuthenticationFailureHandler {

    String errorMessage = "Authentication error";

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
                                        AuthenticationException exception) throws IOException {

        response.sendRedirect(request.getContextPath() + "/auth/signin?error=" + errorMessage);
    }
}
