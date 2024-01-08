package app.ishiko.api.auth;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.User.UserBuilder;
import org.springframework.security.provisioning.UserDetailsManager;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.View;

@Controller
@RequestMapping("/auth")
public class AuthController {
    UserDetailsManager userDetailsManager;
    String baseUrl;

    public AuthController(UserDetailsManager userDetailsManager, @Value("${ishiko.base_url}") String baseUrl) {
        this.userDetailsManager = userDetailsManager;
        this.baseUrl = baseUrl;
    }

    @GetMapping("signup")
    public ModelAndView signUpPage(HttpServletRequest request) {
        CsrfToken csrfToken = (CsrfToken) request.getAttribute("_csrf");
        // Render the csrf token to a cookie by loading the deferred token
        csrfToken.getToken();
        return new ModelAndView("redirect:" + baseUrl + "/auth/signup");
    }

    @GetMapping("/signin")
    public String signInPage(HttpServletRequest request, Model model) {
        CsrfToken csrfToken = (CsrfToken) request.getAttribute("_csrf");
        csrfToken.getToken();
        model.addAttribute("csrfToken", csrfToken);
        return "signin";
    }

    @PostMapping("signup")
    public ModelAndView signUp(HttpServletRequest request, SignUpDto signUpDto) {
        String redirectUrl = baseUrl + "/auth/signup";

        // create user
        request.setAttribute(View.RESPONSE_STATUS_ATTRIBUTE, HttpStatus.FOUND);
        return new ModelAndView("redirect:" + redirectUrl);
    }
}
