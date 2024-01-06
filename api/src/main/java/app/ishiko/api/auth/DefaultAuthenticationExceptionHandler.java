
package app.ishiko.api.auth;

import app.ishiko.api.exception.HttpErrorResponseBodyDto;

import java.io.IOException;
import java.io.PrintWriter;

import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;

import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class DefaultAuthenticationExceptionHandler implements AuthenticationFailureHandler {

    String errorMessage = "Authentication error";

    ObjectMapper mapper;

    public DefaultAuthenticationExceptionHandler(ObjectMapper mapper) {
        this.mapper = mapper;
    }

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
            AuthenticationException exception) throws IOException, ServletException {
        response.setStatus(401);
        response.setContentType(MediaType.APPLICATION_JSON.toString());
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
        mapper.writeValue(out, new HttpErrorResponseBodyDto(errorMessage));
    }

}
